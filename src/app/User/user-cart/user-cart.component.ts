import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Book } from '../../services/book.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.scss']
  
})

export class UserCartComponent implements OnInit {
  cart: { book: Book; quantity: number }[] = [];
  showCheckoutForm = false;
  isBuyNow = false;

  selectedBook: Book | null = null;
  selectedQuantity: number = 1;

  orderDetails = {
    name: '',
    phone: '',
    address: '',
    paymentMethod: ''
  };

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cartService.fetchUserCart();
    this.cartService.cart$.subscribe(items => {
      this.cart = items;
    });
  }

  userEmail = localStorage.getItem('userEmail');

  removeFromCart(bookId: number): void {
    if (bookId !== undefined) {
      this.cartService.removeFromCart(bookId);
    }
  }

  getTotalPrice(): number {
    return this.cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  }

  showCheckout(forBuyNow: boolean = false, book?: Book, quantity: number = 1): void {
    this.isBuyNow = forBuyNow;
    this.showCheckoutForm = true;

    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.orderDetails.name = user.name || '';
        this.orderDetails.phone = user.phone || '';
      } catch {
        this.orderDetails.name = '';
        this.orderDetails.phone = '';
      }
    } else {
      this.orderDetails.name = '';
      this.orderDetails.phone = '';
    }

    // Set selected book and quantity
    if (forBuyNow && book) {
      this.selectedBook = book;
      this.selectedQuantity = quantity;
    } else {
      this.selectedBook = null;
      this.selectedQuantity = 1;
    }

    // Clear previous values
    this.orderDetails.address = '';
    this.orderDetails.paymentMethod = '';
  }

  cancelCheckout(): void {
    this.showCheckoutForm = false;
    this.selectedBook = null;
    this.selectedQuantity = 1;
    this.orderDetails = {
      name: '',
      phone: '',
      address: '',
      paymentMethod: ''
    };
  }

  submitOrder(): void {
  const { name, phone, address, paymentMethod } = this.orderDetails;

  if (!name || !phone || !address || !paymentMethod) {
    this.toastr.error('Please fill all fields', 'Error');
    return;
  }

  // Format book details
  let bookDetails = '';
  let totalAmount = 0;

  if (this.isBuyNow && this.selectedBook) {
    bookDetails = `${this.selectedBook.title} x${this.selectedQuantity}`;
    totalAmount = this.selectedBook.price * this.selectedQuantity;
  } else {
    bookDetails = this.cart
      .map(item => `${item.book.title} x${item.quantity}`)
      .join(', ');
    totalAmount = this.getTotalPrice();
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const orderPayload = {
    customerName: name,
    email: this.userEmail,
    phone,
    address,
    bookDetails,
    totalAmount,
    paymentMethod,
    status: 'Pending'
  };

  console.log(orderPayload);

  this.cartService.placeOrder(orderPayload).subscribe({
    next: () => {
      this.toastr.success('Order placed successfully!', 'Success');

      if (this.isBuyNow && this.selectedBook) {
        this.removeFromCart(this.selectedBook.id);
      } else {
        this.cartService.clearCart();
        this.cart = [];
      }

      this.cancelCheckout();
    },
    error: () => {
      this.toastr.error('Failed to place order', 'Error');
    }
  });
}
}