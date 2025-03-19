import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent {
  newBook: Book = {
    id: 0,
    title: '',
    description: '',
    excerpt: '',
    pageCount: 1,  
    publishDate: new Date().toISOString().split('T')[0]
  };

  constructor(private bookService: BookService, private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault(); 

    this.bookService.addBook(this.newBook).subscribe(
      (response: any) => {
        console.log('Book added successfully!', response);
        alert(`The book "${this.newBook.title}" has been added successfully!`);
        this.router.navigate(['/']); 
      }, 
      (error) => {
        console.error('Error adding book:', error);
        alert("An error occurred while adding the book. Please try again.");
      }
    );
  }
}


