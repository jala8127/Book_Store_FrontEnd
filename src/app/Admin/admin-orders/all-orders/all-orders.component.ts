import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss']
})
export class AllOrdersComponent implements OnInit {
  allOrders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllOrders();
  }

  fetchAllOrders(): void {
    this.http.get<any[]>('http://localhost:8080/api/orders/all').subscribe({
      next: (orders) => {
        // Sort orders in descending order by ID (latest first)
        this.allOrders = orders
          .sort((a, b) => b.id - a.id)
          .map(order => ({
            ...order,
            bookList: typeof order.bookDetails === 'string'
              ? order.bookDetails.split(',').map((b: string) => b.trim())
              : []
          }));
      },
      error: (err) => console.error('Failed to fetch all orders', err)
    });
  }

  updateStatus(orderId: number, newStatus: string): void {
    this.http.put(`http://localhost:8080/api/orders/${orderId}/status`, { status: newStatus })
      .subscribe(() => {
        this.fetchAllOrders(); // Refresh after status update
      });
  }

  onStatusChange(orderId: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value;
    this.updateStatus(orderId, newStatus);
  }
}