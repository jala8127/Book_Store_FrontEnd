import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss',]
})
export class AdminOrdersComponent {}