import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-completed',
  imports: [],
  templateUrl: './completed.component.html',
  styleUrl: './completed.component.scss'
})
export class CompletedComponent {
  constructor(private http: HttpClient) {}
  orders: any[] = [];
ngOnInit(): void {
  this.http.get<any[]>('http://localhost:8080/api/orders/status?status=Completed')
    .subscribe(res => this.orders = res);
}
}
