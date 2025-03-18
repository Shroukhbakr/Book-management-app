import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';

export const routes: Routes = [
{ path: '', component: BookListComponent },
{ path: 'add-book', component: AddBookComponent },
{ path: 'edit-book/:id', component: EditBookComponent },

];
