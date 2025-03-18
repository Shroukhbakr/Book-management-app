import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  standalone: true,
  selector: 'app-book-list',
  imports: [CommonModule, RouterModule],
  providers: [BookService],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  books: Book[] = [];
  filteredBooks: Book[] = [];

  constructor(private bookService: BookService, private router: Router) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fetchBooks();
      }
    });
  }

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks() {
    this.bookService.getBooks().subscribe(
      (response: Book[]) => {
        console.log("Fetched Books:", response);
        this.books = response;
        this.filteredBooks = [...this.books];
      },
      (error) => console.error('Error fetching books:', error)
    );
  }

  filterBooks() {
    const query = this.searchInput.nativeElement.value.toLowerCase();
    this.filteredBooks = this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        (book.description && book.description.toLowerCase().includes(query)) // تأكد إن `description` موجودة
    );
  }

  addBook() {
    const newBook: Book = {
      id: 0, 
      title: 'New Book',
      description: 'This is a new book description.',
      excerpt: 'Short excerpt of the book.',
      pageCount: 100,
      publishDate: new Date().toISOString(),
    };

    this.bookService.addBook(newBook).subscribe(() => {
      this.fetchBooks(); 
    });
  }

  editBook(bookId: number) {
    this.router.navigate(['/edit-book', bookId]);
  }

  deleteBook(book: Book) {
    if (book.id !== undefined) {
      this.bookService.deleteBook(book.id).subscribe(() => {
        this.books = this.books.filter((b) => b.id !== book.id);
        this.filteredBooks = [...this.books];

        alert(`The book "${book.title}" Are you Sure to Delete This Item!`); 
        console.log('Deleted book:', book); 
      },
      (error) => {
        console.error("Error deleting book:", error);
        alert("An error occurred while deleting the book. Please try again.");
      });
    } else {
      console.error("Error: Book ID is undefined");
    }
}
}
