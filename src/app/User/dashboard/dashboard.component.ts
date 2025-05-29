import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-User-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isDropdownOpen = false;
  userDetails: any = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const localUser = this.authService.getUserInfo();
    if (localUser) {
      this.userDetails = { ...localUser };
      if (!localUser.address) {
        this.toastr.info('Please update your address');
      }
    }
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    const email = this.authService.getUserEmail();
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (data) => {
          this.userDetails = data;
          this.authService.setUserInfo(data); // update local storage
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
        }
      });
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.loadUserDetails();
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  logout(): void {
    this.authService.clearUserEmail();
    this.authService.clearUserInfo();
    this.router.navigate(['/']);
  }

  updateAddress(): void {
    const email = this.userDetails.email;
    const newAddress = this.userDetails.address;

    this.userService.updateUserAddress(email, newAddress).subscribe({
      next: () => {
        this.toastr.success('Address updated successfully');
        this.loadUserDetails();
      },
      error: () => {
        this.toastr.error('Failed to update address');
      }
    });
  }
}