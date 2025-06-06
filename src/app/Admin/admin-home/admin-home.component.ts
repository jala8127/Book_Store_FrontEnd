import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  totalBooks: number = 0;
  outOfStockBooks: any[] = [];
  outOfStockCount: number = 0;
  customerRequests: any[] = [];
  totalOrders: number = 0;

  // Add wishedBooks property
  wishedBooks: any[] = [];

  constructor(
    private bookService: BookService,
    private orderService: OrderService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.fetchTotalBooks();
    this.fetchOutOfStockBooks();
    this.fetchCustomerRequests();
    this.fetchTotalOrders();

    // Initialize wishedBooks - replace with API call if needed
    this.wishedBooks = [
      { title: 'The Hobbit',imageUrl: 'assets/images/hobbit.webp' },
      { title: 'The Witcher',imageUrl: 'assets/images/witcher.webp' },
      { title: 'The Martian',imageUrl: 'assets/images/martian.jpeg' },
      { title: 'The Road',imageUrl: 'assets/images/road.jpg' },
      { title: 'The Terror',imageUrl: 'assets/images/terror.webp' }
    ];
  }

  fetchTotalBooks() {
    this.bookService.getBooks().subscribe((books: any[]) => {
      this.totalBooks = books.length;
    });
  }

  fetchOutOfStockBooks() {
    this.bookService.getOutOfStockBooks().subscribe((books: any[]) => {
      this.outOfStockBooks = books;
      this.outOfStockCount = books.length;
    });
  }

  fetchCustomerRequests() {
    this.requestService.getAllRequests().subscribe((requests: any[]) => {
      this.customerRequests = requests;
    });
  }

  fetchTotalOrders() {
    this.orderService.getTotalOrders().subscribe((count: number) => {
      this.totalOrders = count;
    });
  }
}