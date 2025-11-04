import { Book } from '@/Models/book.model';
import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { BookService } from '../service/books.service';
import { Edition } from '@/Models/edition.model';
import { EditionService } from '../service/editions.service';
import { CopyService } from '../service/copies.service';
import { Copy } from '@/Models/copy.model';
import { AuthorService } from '../service/authors.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-books-crud',
  imports: [CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule],
  providers: [MessageService, BookService, ConfirmationService],
  templateUrl: './books-crud.html',
  styleUrl: './books-crud.scss'
})
export class BooksCrud {

  bookDialog: boolean = false;
  isNew: boolean = false;

  books = signal<Book[]>([]);
  editions: Edition[] = [];
  copies: Copy[] = [];

  book!: Book;
  unchangedBook!: Book;

  selectedBooks!: Book[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private editionsService: EditionService,
    private copiesService: CopyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    const books = this.bookService.getBooks()
    const editions = this.editionsService.getEditions();
    const copies = this.copiesService.getCopies();

    this.books.set(books);
    this.editions = editions;
    this.copies = copies;

    console.log(this.editions, this.copies);

    this.cols = [
      { field: 'titulo', header: 'Título', customExportHeader: 'titulo' },
      { field: 'author.nombre', header: 'Autor' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  getEdition(book: Book | undefined): Edition | undefined {
    return this.editions.find(edition => edition.libro.titulo === book?.titulo);
  }

  getCopy(edition: Edition | undefined): Copy | undefined {
    return this.copies.find(copy => copy.edition.isbn === edition?.isbn);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.book = { titulo: '', author: { nombre: '' } };
    this.submitted = false;
    this.bookDialog = true;
    this.isNew = true;
  }

  editBook(book: Book) {
    this.isNew = false;
    this.unchangedBook = { ...book }; // Store the original book for comparison
    this.book = structuredClone(book);
    this.bookDialog = true;

    console.log("editing!");
  }

  deleteSelectedBooks() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected books?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.books.set(this.books().filter((val) => !this.selectedBooks?.includes(val)));
        this.selectedBooks = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Books Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.bookDialog = false;
    this.submitted = false;
  }

  deleteBook(book: Book) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + book.titulo + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.books.set(this.books().filter((val) => val.titulo !== book.titulo));
        this.book = { titulo: '', author: { nombre: '' } };
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Book Deleted',
          life: 3000
        });
      }
    });
  }

  findIndexByTitle(title: string): number {
    let index = -1;
    for (let i = 0; i < this.books().length; i++) {
      if (this.books()[i].titulo === title) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  saveBook() {
    this.submitted = true;
    let _books = this.books();

    if (this.book.titulo.trim().length === 0 || this.book.author?.nombre.trim().length === 0) return;

    if (this.isNew) {
      let author = this.authorService.getSingleAuthor(this.book.author?.nombre)
      if (!author) return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Author not found',
        life: 3000
      });

      // TODO: Implementar API
      this.book.titulo = this.book.titulo?.trim();
      this.book.author = author;

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Book Created',
        life: 3000
      });
      this.books.set([..._books, this.book]);
    } else {
      console.log("updating", this.book);
      // TODO: Implementar API
      let i = _books.findIndex(b => b.titulo === this.unchangedBook.titulo);

      if (!this.authorService.getSingleAuthor(this.book.author?.nombre)) {
        return this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Author not found',
          life: 3000
        });
      }

      _books[i] = this.book;

      this.books.set(_books);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Book Updated',
        life: 3000
      });
    }

    this.bookDialog = false;
    this.book = { titulo: '', author: { nombre: '' } };
  }
}
