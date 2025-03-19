import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { response } from 'express';

@Component({
  standalone: true,
  selector: 'app-edit-book',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.css'
})
export class EditBookComponent implements OnInit {
  book: Book | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute, 
    private bookService: BookService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    
    if (bookId) {
      this.loadBook(parseInt(bookId)); 
    } else {
      this.errorMessage = 'No book ID found in the route!';
    }
  }

  loadBook(id: number) {
    this.bookService.getBookById(id).subscribe(
      (response) => {
        this.book = response;
      },
      (error) => {
        console.error('Error fetching book:', error);
        this.errorMessage = 'Failed to fetch book details. Please try again later.';
      }
    );
  }

  saveChanges() {
    if (this.book && this.book.id) { 
      this.bookService.updateBook(this.book.id, this.book).subscribe(
        (response) => {
          console.log('Book updated successfully!', response);

          alert(`The book "${this.book!.title}" has been updated successfully!`);

          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error updating book:', error);
          
          alert("Failed to update book. Please check your input and try again."); 
        }
      );
    } else {
      console.error("Error: Book object is null or missing an ID.");
      alert("Error: Cannot update the book because it is missing or not loaded properly.");
    }
}
  cancelEdit() {
    this.router.navigate(['/']);
  }
}