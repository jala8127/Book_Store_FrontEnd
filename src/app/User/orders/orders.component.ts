import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from 'app/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  userOrders: Order[] = [];
  email: string = '';

  constructor(private http: HttpClient, private orderService: OrderService) {}

ngOnInit() {
  this.email = localStorage.getItem('email') || '';
  console.log('Fetching orders for email:', this.email); // Optional for debugging

  if (this.email) {
    this.orderService.getUserOrders(encodeURIComponent(this.email)).subscribe({
      next: (orders) => {
        console.log('Orders received:', orders); // Optional for debugging
        this.userOrders = orders;
      },
      error: (err) => console.error('Error fetching orders:', err)
    });
  }
}
}