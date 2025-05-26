import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookService, Book } from '../../services/book.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  books: Book[] = [];
  allBooks: Book[] = [];
  searchTerm: string = '';
  selectedBook: Book | null = null;
  selectedQuantity: number = 1;

  constructor(private bookService: BookService,private cartService: CartService,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((data: Book[]) => {
      const booksWithImages = data.map(book => ({
        ...book,
        imageUrl: `assets/images/${book.imageUrl}`
      }));
      this.books = booksWithImages;
      this.allBooks = booksWithImages;
    });
  }

  filterBooks() {
    const term = this.searchTerm.toLowerCase();
    this.books = this.allBooks.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
  }

  openModal(book: Book) {
    this.selectedBook = book;
    this.selectedQuantity = 1;
    const modalElement = document.getElementById('viewBookModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeModal() {
    this.selectedBook = null;
    this.selectedQuantity = 1;
  }

  addToCart(book: Book) {
  if (book.stock && book.stock >= this.selectedQuantity) {
    this.cartService.addToCart(book, this.selectedQuantity);
    this.toastr.success('Added to cart!', 'Success');
  } else {
    this.toastr.error('Failed to add item to cart', 'Error');
  }
}
}