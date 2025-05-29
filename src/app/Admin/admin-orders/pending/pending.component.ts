import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8080/api/orders/status?status=Pending')
      .subscribe({
        next: (res) => {
          // Pre-process orders to split bookDetails string into bookList array
          this.orders = res.map(order => ({
            ...order,
            bookList: typeof order.bookDetails === 'string'
              ? order.bookDetails.split(',').map((b: string) => b.trim())
              : []
          }));
        },
        error: (err) => console.error('Error fetching pending orders:', err)
      });
  }
}