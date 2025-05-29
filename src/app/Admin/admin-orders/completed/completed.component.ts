import { Component, OnInit } from '@angular/core';
import { OrderService, Order} from 'app/services/order.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-completed',
  imports: [CommonModule],
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})
export class CompletedComponent implements OnInit {

  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
  this.orderService.getCompletedOrders().subscribe((data: Order[]) => {
    console.log("Completed Orders Fetched:", data); // Debug log
    this.orders = data;
  });
}
}
