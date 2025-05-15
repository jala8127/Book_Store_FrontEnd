import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',  // ✅ Use external HTML file
  styleUrls: ['./dashboard.component.scss']   // ✅ Link SCSS
})
export class DashboardComponent {}