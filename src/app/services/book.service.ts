import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  id?: number;
  title: string;
  author: string;
  category: string;
  genre: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  // Get all books
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}`);
  }

  // Get out-of-stock books
  getOutOfStockBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/out-of-stock`);
  }

  // Get book by ID
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  // Add book without image (optional)
  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}`, book);
  }

  // Update book without image (optional)
  updateBook(id: number | undefined, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, book);
  }

  // Add book with image file
  addBookWithImage(book: Book, imageFile: File | null): Observable<any> {
    const formData = new FormData();
    const bookBlob = new Blob([JSON.stringify(book)], { type: 'application/json' });
    formData.append('book', bookBlob);
  
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
  
    return this.http.post(`${this.baseUrl}/add-with-image`, formData);
  }

  // Update book with image file
  updateBookWithImage(id: number | undefined, book: Book, imageFile: File | null): Observable<any> {
    const formData = new FormData();
  
    const bookBlob = new Blob([JSON.stringify(book)], { type: 'application/json' });
    formData.append('book', bookBlob);
  
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
  
    return this.http.put(`${this.baseUrl}/update-with-image/${id}`, formData);
  }

  // Delete book
  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}