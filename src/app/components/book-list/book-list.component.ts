import { Component,ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router'
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { NavigationEnd } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-book-list',
  imports: [CommonModule,RouterModule,],
  providers: [BookService],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'

})
export class BookListComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  selectedBook: Book | null = null;
  showEditForm = false;
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
      (response: any) => {
        console.log(" Raw API Response:", response);
  
        if (Array.isArray(response) && response.length > 0 && typeof response[0] === 'object') {
          const firstObject = response[0]; 
          
          this.books = Object.values(firstObject)
            .filter((item): item is Book => 
              item !== null && typeof item === 'object' && 
              'id' in item && 'title' in item && 'author' in item && 'genre' in item
            );
  
        } else {
          this.books = [];
        }
  
        this.filteredBooks = [...this.books];
  
        console.log(" Processed Books:", this.books);
      },
      (error) => console.error(' Error fetching books:', error)
    );
  }
  filterBooks() {
    const query = this.searchInput.nativeElement.value.toLowerCase();
    this.filteredBooks = this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }

  addBook() {
    const newBook: Book = {
      title: 'New Book',
      author: 'Unknown',
      genre: 'Fiction'
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
        console.log('Deleted book:', book);
      });
    } else {
      console.error("Error: Book ID is undefined");
    }
  }
  toggleEditForm() {
    this.showEditForm = !this.showEditForm;
  }
}
