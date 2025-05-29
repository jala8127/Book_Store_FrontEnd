import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_EMAIL_KEY = 'email';
  private readonly USER_INFO_KEY = 'userInfo';

  constructor(private http: HttpClient) {
    this.autoFetchUserInfo();
  }

  private autoFetchUserInfo(): void {
    const email = this.getUserEmail();
    if (email) {
      this.http.get<{ name: string; email: string; phone: string; address?: string }>(
        `http://localhost:8080/api/users/email/${email}`
      ).subscribe(user => {
        this.setUserInfo(user); // automatically update localStorage
      });
    }
  }

  setUserEmail(email: string): void {
    localStorage.setItem(this.USER_EMAIL_KEY, email);
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }

  clearUserEmail(): void {
    localStorage.removeItem(this.USER_EMAIL_KEY);
  }

  setUserInfo(user: { name: string; email: string; phone: string; address?: string }): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(user));
    this.setUserEmail(user.email);
  }

  getUserInfo(): { name: string; email: string; phone: string; address?: string } | null {
    const user = localStorage.getItem(this.USER_INFO_KEY);
    return user ? JSON.parse(user) : null;
  }

  clearUserInfo(): void {
    localStorage.removeItem(this.USER_INFO_KEY);
  }

  isLoggedIn(): boolean {
    return this.getUserEmail() !== null;
  }

  fetchUserDetailsFromBackend() {
    const email = this.getUserEmail();
    if (!email) return null;

    return this.http.get<{ name: string; email: string; phone: string; address?: string }>(
      `http://localhost:8080/api/users/email/${email}`
    );
  }

  getLoggedInUser(): { name: string; email: string; phone: string; address?: string } | null {
    const user = this.getUserInfo();
    return user;
  }
}