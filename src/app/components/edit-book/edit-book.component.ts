import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';


@Component({
  standalone: true,
  selector: 'app-edit-book',
  imports: [FormsModule,RouterModule,CommonModule],
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.css'
})
export class EditBookComponent implements OnInit {
  book: Book = { id: 0, title: '', author: '', genre: '' }; 

  constructor(private route: ActivatedRoute, private bookService: BookService) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    console.log('Book ID from route:', bookId); 
  
    if (bookId) {
      this.loadBook(parseInt(bookId)); 
    } else {
      console.error('No book ID found in the route!');
    }
  }

  loadBook(id: number) {
    this.bookService.getBookById(id).subscribe(
      (response) => {
        console.log('Fetched book:', response);
        setTimeout(() => {
          this.book = response;
        }, 100); 
      },
      (error) => console.error('Error fetching book:', error)
    );
  }
  saveChanges() {
    if (this.book.id) {
      this.bookService.updateBook(this.book.id, this.book).subscribe(
        () => console.log('Book updated successfully!'),
        (error) => console.error('Error updating book:', error)
      );
    }
  }
}