import { Component, OnInit } from '@angular/core';
import { CartService } from 'app/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-user-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.scss']
})
export class UserCartComponent implements OnInit {
  cart: any[] = [];
  showCheckoutForm: boolean = false;
  isBuyNow: boolean = false;
  selectedBook: any = null;
  selectedQuantity: number = 1;

  orderDetails = {
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'COD'
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.fetchUserCart();
    this.cartService.cart$.subscribe(cartData => {
      console.log('Cart Data:', cartData);
      this.cart = cartData;
    });
  }

  showCheckout(isBuyNow: boolean, book?: any, quantity?: number): void {
    this.isBuyNow = isBuyNow;
    this.showCheckoutForm = true;
    if (isBuyNow && book && quantity) {
      this.selectedBook = book;
      this.selectedQuantity = quantity;
    }
  }

  cancelCheckout(): void {
    this.showCheckoutForm = false;
    this.selectedBook = null;
    this.selectedQuantity = 1;
  }

  submitOrder(): void {
    
    const booksToOrder = this.isBuyNow
      ? [{ book: this.selectedBook, quantity: this.selectedQuantity }]
      : this.cart;

    const userEmail = this.authService.getUserEmail();
    if (!userEmail) {
      this.toastr.error('Please log in first.');
      return;
    }

    if (
      !this.orderDetails.name ||
      !this.orderDetails.phone ||
      !this.orderDetails.address ||
      !this.orderDetails.paymentMethod
    ) {
      this.toastr.warning('Please fill in all order details.');
      return;
    }

    const books = booksToOrder.map(item => item.book.title).join(',');
    const quantities = booksToOrder.map(item => item.quantity).join(',');

    const orderPayload = {
      user: { email: userEmail },
      customerName: this.orderDetails.name, 
      phone: this.orderDetails.phone,
      address: this.orderDetails.address,
      paymentMethod: this.orderDetails.paymentMethod,
      bookDetails: books + ' = ' + quantities,
      // status: 'Pending',
      totalAmount: this.getTotalPrice()
    };

    console.log('Order Payload:', orderPayload);

    this.cartService.placeOrder(orderPayload).subscribe({
      next: (response: any) => {
        this.toastr.success('Order placed successfully!');
        this.cancelCheckout();
        this.cartService.clearCart();
        this.cart = [];
      },
      error: (error: any) => {
        console.error('Order failed', error);
        this.toastr.error(error?.error?.message || 'Failed to place order.');
      }
    });
  }

  removeFromCart(bookId: number): void {
    this.cartService.removeFromCart(bookId);
  }

  getTotalPrice(): number {
    return this.cart.reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    );
  }
}