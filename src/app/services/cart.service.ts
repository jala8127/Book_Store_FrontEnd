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
  private cartSubject = new BehaviorSubject<{ book: Book; quantity: number }[]>([]);
  cart$ = this.cartSubject.asObservable();
  private apiUrl = 'http://localhost:8080/api/cart'; // Replace with your backend URL

  constructor(private http: HttpClient, private authService: AuthService) {}

   fetchUserCart() {
    const email = this.authService.getUserEmail();
    if (!email) return;

    this.http.get<any[]>(`${this.apiUrl}/${email}`).subscribe(data => {
      this.cart = data.map(item => ({
        book: {
          id: item.bookId,
          title: item.title,
          author: item.author,
          price: item.price,
          imageUrl: item.imageUrl,
          description: '', // optional
          category: '',    // optional
          genre: '',       // optional
          stock: 0         // optional
        },
        quantity: item.quantity
      }));
      this.cartSubject.next(this.cart);
    });
  }

  addToCart(book: Book, quantity: number) {
    const email = this.authService.getUserEmail();
    if (!email) {
      alert('Please log in first.');
      return;
    }

    const cartItem = {
      userEmail: email,
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      imageUrl: book.imageUrl,
      quantity
    };

    this.http.post(`${this.apiUrl}/add`, cartItem).subscribe({
      next: () => {
        // Optional: update local cart
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

  getCart() {
    return this.cart;
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
    this.cart = [];
    this.cartSubject.next(this.cart);

  }
  placeOrder(orderPayload: any) {
  return this.http.post<any>('http://localhost:8080/api/orders', orderPayload);
}
}