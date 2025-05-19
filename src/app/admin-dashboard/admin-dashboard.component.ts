import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Required to use <router-outlet>

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule], // ✅ Include RouterModule here
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {}