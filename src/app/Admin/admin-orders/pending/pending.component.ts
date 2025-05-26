import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending',
  imports:[CommonModule],
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']  // fix: use 'styleUrls' not 'styleUrl'
})
export class PendingComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8080/api/orders/status?status=Pending')
      .subscribe({
        next: res => this.orders = res,
        error: err => console.error('Error fetching pending orders:', err)
      });
  }
}