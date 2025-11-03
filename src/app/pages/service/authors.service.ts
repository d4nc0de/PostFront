import { Author } from '@/Models/author.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor() { }

  getAuthors(): Author[] {
    return this.getDummyAuthors();
  }

  getSingleAuthor(nombre: string): any {
    const authors = this.getAuthors();
    return authors.find(a => a.nombre === nombre);
  }

  getDummyAuthors(): Author[] {
    return [
      { nombre: 'Gabriel García Márquez' },
      { nombre: 'Isabel Allende' },
      { nombre: 'J. R. R. Tolkien' }
    ];
  }
}
