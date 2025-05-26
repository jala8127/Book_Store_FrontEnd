import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_EMAIL_KEY = 'userEmail';

  constructor() {}

  // Save user email
  setUserEmail(email: string): void {
    localStorage.setItem(this.USER_EMAIL_KEY, email);
  }

  // Get user email
  getUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }

  // Remove user email (on logout)
  clearUserEmail(): void {
    localStorage.removeItem(this.USER_EMAIL_KEY);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getUserEmail();
  }
}