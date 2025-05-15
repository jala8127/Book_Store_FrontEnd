import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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

  constructor(private router: Router, private http: HttpClient) {} 

  onLoginClick(): void {
    if (this.Email === 'jala@gmail.com' && this.password === 'password') {
      this.showModal = false;
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid credentials!');
    }
  }

  openForgotPassword(): void {
    this.showModal = false;
    this.showForgotPasswordModal = true;
  }

  openRegister(): void {
    this.showModal = false;
    this.showRegisterModal = true;
  }

  closeForgotPassword(): void {
    this.showForgotPasswordModal = false;
  }

  onRegisterSubmit(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(this.registerEmail)) {
      alert('Please enter a valid email address!');
      return;
    }

    if (!phoneRegex.test(this.registerPhone)) {
      alert('Please enter a valid 10-digit phone number!');
      return;
    }

    if (this.registerPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.http.post('/api/users/register', {
      name: this.registerName,
      email: this.registerEmail,
      phone: this.registerPhone,
      password: this.registerPassword
    }).subscribe({
      next: () => {
        alert('Registration successful!');
        this.closeRegister(); 
      },
      error: () => {
        alert('Registration failed!');
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
}