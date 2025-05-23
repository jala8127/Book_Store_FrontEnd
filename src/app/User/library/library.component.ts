import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookService, Book } from '../../services/book.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  books: Book[] = [];
  searchTerm: string = '';
  selectedBook: Book | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((data: Book[]) => {
      this.books = data.map(book => ({
        ...book,
        imageUrl: `assets/images/${book.imageUrl}`
      }));
    });
  }

  filterBooks() {
    const term = this.searchTerm.toLowerCase();
    this.books = this.books.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
  }

  openModal(book: Book) {
    this.selectedBook = book;
  }

  closeModal() {
    this.selectedBook = null;
  }

  addToCart(book: Book) {
    console.log('Added to cart:', book);
    alert(`"${book.title}" added to cart!`);
  }
}