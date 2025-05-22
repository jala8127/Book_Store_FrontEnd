import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare const bootstrap: any;

@Component({
  selector: 'app-User-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isDropdownOpen: boolean = false;

  adminData = {
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router, private toastr: ToastrService) {}

  toggleDropdown(event: MouseEvent): void {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  logout(): void {
    localStorage.clear();
    this.toastr.success('Logout Successful..!');
    this.router.navigate(['/']);
  }

  }
