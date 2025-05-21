import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare const bootstrap: any;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
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

  submitAdminForm(): void {
    if (this.adminData.password !== this.adminData.confirmPassword) {
      this.toastr.error('Passwords do not match!', 'Error');
      return;
    }

    console.log('Admin data submitted:', this.adminData);

    // Close modal
    const modalElement = document.getElementById('addAdminModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }

    this.toastr.success('Admin added successfully!', 'Success');
    this.adminData = { email: '', phone: '', password: '', confirmPassword: '' }; // Reset form
  }
}