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
import { AuthorService } from '../service/authors.service';
import { Author } from '@/Models/author.model';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-authors-crud',
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
  templateUrl: './authors-crud.html',
  styleUrl: './authors-crud.scss'
})
export class AuthorsCrud {
  authorDialog: boolean = false;
  isNew: boolean = false;

  authors = signal<Author[]>([]);

  author!: Author;
  unchangedAuthor!: Author;

  selectedAuthors!: Author[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  constructor(
    private authorService: AuthorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    const authors = this.authorService.getAuthors()

    this.authors.set(authors);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.author = { nombre: '' };
    this.submitted = false;
    this.authorDialog = true;
    this.isNew = true;
  }

  editAuthor(author: Author) {
    this.isNew = false;
    this.unchangedAuthor = { ...author }; // Store the original author for comparison
    this.author = structuredClone(author);
    this.authorDialog = true;
  }

  deleteSelectedAuthors() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected authors?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authors.set(this.authors().filter((val) => !this.selectedAuthors?.includes(val)));
        this.selectedAuthors = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Authors Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.authorDialog = false;
    this.submitted = false;
  }

  deleteAuthor(author: Author) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + author.nombre + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authors.set(this.authors().filter((val) => val.nombre !== author.nombre));
        this.author = { nombre: '' };
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Author Deleted',
          life: 3000
        });
      }
    });
  }

  saveBook() {
    this.submitted = true;
    let _authors = this.authors();

    if (this.author.nombre.trim().length === 0) return;

    if (this.isNew) {
      // TODO: Implementar API
      this.author = { nombre: this.author.nombre?.trim() };

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Author Created',
        life: 3000
      });
      this.authors.set([..._authors, this.author]);
    } else {
      // TODO: Implementar API
      let i = _authors.findIndex(b => b.nombre === this.unchangedAuthor.nombre);
      _authors[i] = this.author;

      this.authors.set(_authors);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Author Updated',
        life: 3000
      });
    }

    this.authorDialog = false;
    this.author = { nombre: '' };
  }
}
