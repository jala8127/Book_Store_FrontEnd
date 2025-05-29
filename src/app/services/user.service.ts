import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserRegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // Register a new user, expects plain text response
  register(user: UserRegisterData): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, user, { responseType: 'text' });
  }

  // Login user, expects user object response
  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Get user by email, expects user object response
  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/email/${email}`);
  }

  // Update user's address, expects updated user object or status
  updateUserAddress(email: string, address: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-address/${email}`, { address });
  }

  // Forgot password request, expects plain text response
  forgotPassword(data: ForgotPasswordData): Observable<string> {
    return this.http.post(`${this.baseUrl}/forgot-password`, data, { responseType: 'text' });
  }
}