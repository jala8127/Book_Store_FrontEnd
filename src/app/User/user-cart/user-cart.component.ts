import { Component, OnInit } from '@angular/core';
import { CartService } from 'app/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'app/services/user.service';

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
  showPaymentPanel: boolean = false;

  isBuyNow: boolean = false;
  selectedBook: any = null;
  selectedQuantity: number = 1;

  orderDetails = {
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: '',
    upiId: '',
    cardNumber: '',
    cvv: ''
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.getUserDetails();
  }

  loadCartItems(): void {
    this.cartService.fetchUserCart();
    this.cartService.cart$.subscribe(cartData => {
      this.cart = cartData;
    });
  }

  showCheckout(isBuyNow: boolean, book?: any, quantity?: number): void {
    this.isBuyNow = isBuyNow;
    this.showCheckoutForm = true;
    this.showPaymentPanel = false;

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

  confirmOrder(): void {
    const userEmail = this.authService.getUserEmail();
    if (!userEmail) {
      this.toastr.error('Please log in first.');
      return;
    }

    if (
      !this.orderDetails.name ||
      !this.orderDetails.phone ||
      !this.orderDetails.address
    ) {
      this.toastr.warning('Please fill in all details before proceeding.');
      return;
    }

    this.showCheckoutForm = false;
    this.showPaymentPanel = true;
  }

  cancelPayment(): void {
    this.showPaymentPanel = false;
    this.showCheckoutForm = true;
  }

  finalizeOrder(): void {
    const userEmail = this.authService.getUserEmail();
    if (!userEmail) {
      this.toastr.error('Please log in first.');
      return;
    }

    const booksToOrder = this.isBuyNow
      ? [{ book: this.selectedBook, quantity: this.selectedQuantity }]
      : this.cart;

    const books = booksToOrder.map(item => item.book.title).join(',');
    const quantities = booksToOrder.map(item => item.quantity).join(',');

    const orderPayload = {
      user: { email: userEmail },
      customerName: this.orderDetails.name,
      phone: this.orderDetails.phone,
      address: this.orderDetails.address,
      paymentMethod: this.orderDetails.paymentMethod,
      bookDetails: books + ' x ' + quantities,
      totalAmount: this.isBuyNow
        ? this.selectedBook.price * this.selectedQuantity
        : this.getTotalPrice()
    };

     this.cartService.placeOrder(orderPayload).subscribe({
    next: (response: any) => {
      this.toastr.success('Order placed successfully!');
      
      this.showPaymentPanel = false;
      this.showCheckoutForm = false;

      this.cartService.clearCart();
      this.cart = [];

      this.selectedBook = null;
      this.selectedQuantity = 1;
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

  getTotalQuantity(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getUserDetails(): void {
  const userEmail = this.authService.getUserEmail();
  
  if (!userEmail) {
    this.toastr.error('User not logged in!');
    return;
  }

  this.userService.getUserByEmail(userEmail).subscribe((user: any) => {
    this.orderDetails.name = user.name;
    this.orderDetails.phone = user.phone;
    this.orderDetails.address = user.address;
    this.orderDetails.email = user.email;
  });
}
}