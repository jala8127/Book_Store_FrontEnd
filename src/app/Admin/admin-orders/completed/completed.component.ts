import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})
export class CompletedComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8080/api/orders/status?status=Completed')
      .subscribe({
        next: (res) => {
          this.orders = res.map(order => ({
            ...order,
            bookList: typeof order.bookDetails === 'string'
              ? order.bookDetails.split(',').map((b: string) => b.trim())
              : []
          }));
        },
        error: (err) => console.error('Error fetching completed orders:', err)
      });
  }
}