import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookService, Book } from '../../services/book.service';

declare var bootstrap: any;

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-library.component.html',
  styleUrls: ['./admin-library.component.scss']
})
export class AdminLibraryComponent implements OnInit {
  searchTerm = '';
  books: Book[] = [];
  filteredBooks: Book[] = [];
  selectedBook: Partial<Book> = {};
  selectedImageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  bookToDeleteId: number | null = null;

  editableFields: (keyof Book)[] = ['title', 'author', 'price', 'stock', 'category', 'genre'];

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
      this.filteredBooks = data;
    });
  }

  filterBooks() {
    const term = this.searchTerm.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term) ||
      book.genre.toLowerCase().includes(term)
    );
  }

  openAddModal() {
    this.selectedBook = {};
    this.selectedImageFile = null;
    this.imagePreview = null;

    const fileInput = document.getElementById('addImageFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    const modal = new bootstrap.Modal(document.getElementById('addBookModal'));
    modal.show();
  }

  openEditModal(book: Book) {
  console.log('Editing Book:', book);

  this.selectedBook = { ...book };
  this.selectedImageFile = null;

  this.imagePreview = book.imageUrl ? `assets/images/${book.imageUrl}` : null;

  const fileInput = document.getElementById('editImageFile') as HTMLInputElement;
  if (fileInput) fileInput.value = '';

  const modal = new bootstrap.Modal(document.getElementById('editBookModal'));
  modal.show();
}

  closeModal(modalId: string) {
    const modalEl = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  saveBook() {

    if (this.selectedBook.id) {
      this.bookService.updateBookWithImage(this.selectedBook.id, this.selectedBook as Book, this.selectedImageFile).subscribe(() => {
        this.loadBooks();
        this.closeModal('editBookModal');
        this.showSuccessToast();
      });
    } else {
      console.log(this.selectedBook.imageUrl);
      this.bookService.addBookWithImage(this.selectedBook as Book, this.selectedImageFile).subscribe(() => {
        this.loadBooks();
        this.closeModal('addBookModal');
        this.showSuccessToast();
      });
    }
  }

  confirmDelete(bookId: number) {
    this.bookToDeleteId = bookId;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
  }

  deleteBook() {
    if (this.bookToDeleteId != null) {
      this.bookService.deleteBook(this.bookToDeleteId).subscribe(() => {
        this.loadBooks();
        this.closeModal('confirmDeleteModal');
        this.showSuccessToast();
      });
      this.bookToDeleteId = null;
    }
  }

  showSuccessToast() {
    const toastEl = document.getElementById('successToast');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}