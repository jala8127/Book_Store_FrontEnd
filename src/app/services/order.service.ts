import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  bookDetails: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  email: string;
  orderDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getUserOrders(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user-orders/${email}`);
  }

  placeOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}`, order);
  }

  getTotalOrders(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`);
  }

  getCompletedOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/completed`);
  }
}