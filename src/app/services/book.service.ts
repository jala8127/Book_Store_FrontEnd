import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'http://localhost:8080/api/books'; // adjust path as needed

  constructor(private http: HttpClient) {}

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addBook(book: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, book);
  }
  
  updateBook(book: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${book.id}`, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}