import { Edition } from '@/Models/edition.model';
import { Injectable } from '@angular/core';
import { BookService } from './books.service';

@Injectable({
  providedIn: 'root'
})
export class EditionService {
  constructor(private bookService: BookService) { }

  getEditions(): Edition[] {
    return this.getDummyEditions();
  }

  getSingleEdition(isbn: number): any {
    const editions = this.getEditions();
    return editions.find(e => e.isbn === isbn);
  }

  getDummyEditions(): Edition[] {
    return [
      { isbn: 9780307389732, year: '2006', lang: 'es', libro: this.bookService.getSingleBook('Cien años de soledad') },
      { isbn: 9788420400590, year: '1982', lang: 'es', libro: this.bookService.getSingleBook('La casa de los espíritus') },
      { isbn: 9780544003415, year: '1954', lang: 'en', libro: this.bookService.getSingleBook('El señor de los anillos') }
    ];
  }
}
