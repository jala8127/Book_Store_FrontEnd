import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  bookDetails: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  orderDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getUserOrders(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user-orders/${email}`);
  }

  getTotalOrders(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  // You can also add a method to update order status if needed:
  updateOrderStatus(orderId: number, newStatus: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-status/${orderId}`, { status: newStatus });
  }
}