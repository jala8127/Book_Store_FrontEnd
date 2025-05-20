import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-library.component.html',
  styleUrls: ['./admin-library.component.scss']
})
export class AdminLibraryComponent {
  books: any[] = [];
  filteredBooks: any[] = [];
  selectedBook: any = this.getEmptyBook();
  searchTerm: string = '';
  isEditMode: boolean = false;
  deleteBookId: number | null = null;

  constructor(private bookService: BookService) {
    this.loadBooks();
  }

  // Default book structure
  getEmptyBook() {
    return {
      id: null,
      title: '',
      author: '',
      price: 0,
      stock: 0,
      genre: '',
      category: '',
      description: '',
      imageUrl: ''
    };
  }

  // Load books from backend
  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data: any[]) => {
        this.books = data;
        this.filterBooks();
      },
      error: (err: any) => {
        console.error('Error loading books:', err);
      }
    });
  }

  // Filter books based on search
  filterBooks(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      (book.title?.toLowerCase().includes(term) || false) ||
      (book.author?.toLowerCase().includes(term) || false) ||
      (book.category?.toLowerCase().includes(term) || false) ||
      (book.genre?.toLowerCase().includes(term) || false)
    );
  }

  // Open Add Book modal
  openAddModal(): void {
    this.isEditMode = false;
    this.selectedBook = this.getEmptyBook();
    this.openModal('bookModal');
  }

  // Open Edit Book modal
  openEditModal(book: any): void {
    this.isEditMode = true;
    this.selectedBook = { ...book };
    this.openModal('bookModal');
  }

  // Save book (Add or Edit)
  saveBook(): void {
    if (!this.selectedBook?.title || !this.selectedBook?.author) {
      alert('Title and Author are required.');
      return;
    }

    if (this.isEditMode) {
      this.bookService.updateBook(this.selectedBook).subscribe({
        next: () => {
          const index = this.books.findIndex(b => b.id === this.selectedBook.id);
          if (index !== -1) {
            this.books[index] = { ...this.selectedBook };
          }
          this.closeModal('bookModal');
          this.filterBooks();
        },
        error: (err: any) => console.error('Error updating book:', err)
      });
    } else {
      this.bookService.addBook(this.selectedBook).subscribe({
        next: (savedBook: any) => {
          this.books.push(savedBook);
          this.closeModal('bookModal');
          this.showToast();
          this.loadBooks();
        },
        error: (err: any) => console.error('Error adding book:', err)
      });
    }
  }

  // Open Confirm Delete Modal
  openConfirmDeleteModal(id: number): void {
    this.deleteBookId = id;
    this.openModal('confirmDeleteModal');
  }

  // Confirm delete book
  confirmDelete(): void {
    if (this.deleteBookId !== null) {
      this.bookService.deleteBook(this.deleteBookId).subscribe({
        next: () => {
          this.books = this.books.filter(book => book.id !== this.deleteBookId);
          this.filterBooks();
          this.closeModal('confirmDeleteModal');
          this.deleteBookId = null;
        },
        error: (err: any) => console.error('Error deleting book:', err)
      });
    }
  }

  // Modal handling
  openModal(id: string): void {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModal(id: string): void {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
  }

  // Show Bootstrap toast
  showToast(): void {
    const toastEl = document.getElementById('successToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }
}