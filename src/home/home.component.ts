import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showModal = false;
  showForgotPasswordModal = false;
  showRegisterModal = false;

  Email: string = '';
  password: string = '';
  registerEmail: string = '';
  registerName: string = '';
  registerPhone: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.showModal = true;
  }

  onLoginClick(): void {
    const adminEmail = 'jalakandeswar.c.p@gmail.com';  
    const adminPassword = 'jalakandeswar';       
  
    this.http.post('http://localhost:8080/api/users/login', {
      email: this.Email,
      password: this.password
    }, { responseType: 'text' }).subscribe({
      next: () => {
        this.toastr.success('Login successful!');
        this.showModal = false;
  
      
        if (this.Email === adminEmail && this.password === adminPassword) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.toastr.error('Login failed!');
      }
    });
  }

  openForgotPassword(): void {
    this.showModal = false;
    this.showForgotPasswordModal = true;
  }

  openRegister(): void {
    this.showModal = false;
    this.showRegisterModal = true;
  }


  onRegisterSubmit(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(this.registerEmail)) {
      this.toastr.warning('Please enter a valid email address!');
      return;
    }

    if (!phoneRegex.test(this.registerPhone)) {
      this.toastr.warning('Please enter a valid 10-digit phone number!');
      return;
    }

    if (this.registerPassword.length < 6) {
      this.toastr.warning('Password must be at least 6 characters long!');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.toastr.warning('Passwords do not match!');
      return;
    }

    this.http.post('http://localhost:8080/api/users/register', {
      name: this.registerName,
      email: this.registerEmail,
      phone: this.registerPhone,
      password: this.registerPassword
    }, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.toastr.success(response);
        this.closeRegister();
      },
      error: () => {
        this.toastr.error('Registration failed!');
      }
    });
  }

  closeRegister(): void {
    this.showRegisterModal = false;
    this.registerName = '';
    this.registerEmail = '';
    this.registerPhone = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
  }
  forgotPasswordEmail: string = '';

onForgotPasswordSubmit(): void {
  if (!this.forgotPasswordEmail) {
    this.toastr.warning('Please enter your email!');
    return;
  }

  this.http.post('http://localhost:8080/api/users/forgot-password', {
    email: this.forgotPasswordEmail
  }, { responseType: 'text' }).subscribe({
    next: (response) => {
      this.toastr.success('Password reset link sent to your email.');
      this.closeForgotPassword();
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Error sending reset email.');
    }
  });
}
closeForgotPassword(): void {
  this.showForgotPasswordModal = false;
  this.forgotPasswordEmail = '';
}

}