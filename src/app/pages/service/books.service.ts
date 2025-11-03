import { Book } from '@/Models/book.model';
import { Injectable } from '@angular/core';
import { AuthorService } from './authors.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private authorService: AuthorService) { }

  getBooks(): Book[] {
    return this.getDummyBooks();
  }

  getSingleBook(titulo: string): any {
    const books = this.getBooks();
    return books.find(b => b.titulo === titulo);
  }

  getDummyBooks(): Book[] {
    return [
      { titulo: 'Cien años de soledad', author: this.authorService.getSingleAuthor('Gabriel García Márquez') },
      { titulo: 'La casa de los espíritus', author: this.authorService.getSingleAuthor('Isabel Allende') },
      { titulo: 'El señor de los anillos', author: this.authorService.getSingleAuthor('J. R. R. Tolkien') }
    ];
  }
}
