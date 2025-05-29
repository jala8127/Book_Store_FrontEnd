import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from './book.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: { book: Book; quantity: number }[] = [];
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();
  private apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchUserCart() {
    const email = this.authService.getUserEmail();
    if (!email) return;

    this.http.get<any[]>(`${this.apiUrl}/${email}`).subscribe({
      next: data => {
        this.cart = data.map(item => ({
          book: {
            id: item.book.id,
            title: item.book.title,
            author: item.book.author,
            price: item.bookPrice,
            imageUrl: item.book.imageUrl,
            description: '', // optional
            category: '',    // optional
            genre: '',       // optional
            stock: 0         // optional
          },
          quantity: item.quantity
        }));
        this.cartSubject.next(this.cart);
      },
      error: () => {
        console.error('Failed to fetch user cart');
      }
    });
  }

  addToCart(book: Book, quantity: number) {
    const email = this.authService.getUserEmail();
    if (!email) {
      alert('Please log in first.');
      return;
    }

    const cart = {
      userEmail: email,
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      imageUrl: book.imageUrl,
      quantity
    };

    this.http.post(`${this.apiUrl}/add`, cart).subscribe({
      next: () => {
        const existing = this.cart.find(item => item.book.id === book.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          this.cart.push({ book, quantity });
        }
        this.cartSubject.next(this.cart);
      },
      error: () => {
        alert('Failed to add item to cart');
      }
    });
  }

  removeFromCart(bookId: number) {
    const email = this.authService.getUserEmail();
    if (!email) return;

    this.http.delete(`${this.apiUrl}/remove?email=${email}&bookId=${bookId}`).subscribe(() => {
      this.cart = this.cart.filter(item => item.book.id !== bookId);
      this.cartSubject.next(this.cart);
    });
  }

  clearCart() {
    const email = this.authService.getUserEmail();
    if (!email) return;

    this.http.delete(`${this.apiUrl}/clear?email=${email}`).subscribe(() => {
      this.cart = [];
      this.cartSubject.next(this.cart);
    });
  }

  placeOrder(orderPayload: any) {
    return this.http.post('http://localhost:8080/api/orders', orderPayload);
  }
  
}