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

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-editions-crud',
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
  templateUrl: './editions-crud.html',
  styleUrl: './editions-crud.scss'
})
export class EditionsCrud {
  editionDialog: boolean = false;
  isNew: boolean = false;

  editions = signal<Edition[]>([]);

  edition!: Edition;
  unchangedEdition!: Edition;

  selectedEditions!: Edition[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  constructor(
    private bookService: BookService,
    private editionsService: EditionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    const editions = this.editionsService.getEditions();

    this.editions.set(editions);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.edition = { isbn: 0, libro: { titulo: '', author: { nombre: '' } }, year: '', lang: '' };
    this.submitted = false;
    this.editionDialog = true;
    this.isNew = true;
  }

  editEdition(edition: Edition) {
    this.isNew = false;
    this.unchangedEdition = { ...edition }; // Store the original edition for comparison
    this.edition = structuredClone(edition);
    this.editionDialog = true;
  }

  deleteSelectedEditions() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected editions?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.editions.set(this.editions().filter((val) => !this.selectedEditions?.includes(val)));
        this.selectedEditions = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Editions Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.editionDialog = false;
    this.submitted = false;
  }

  deleteEdition(edition: Edition) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete edition ' + edition.isbn + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.editions.set(this.editions().filter((val) => val.isbn !== edition.isbn));
        this.edition = { isbn: 0, libro: { titulo: '', author: { nombre: '' } }, year: '', lang: '' };
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Edition Deleted',
          life: 3000
        });
      }
    });
  }

  saveEdition() {
    this.submitted = true;
    let _editions = this.editions();

    if (this.edition.isbn.toString().trim().length === 0 || this.edition.libro.titulo.trim().length === 0 || this.edition.year.trim().length === 0 || this.edition.lang.trim().length === 0) return;

    if (this.isNew) {
      // TODO: Implementar API
      const book = this.bookService.getSingleBook(this.edition.libro.titulo.trim());
      if (!book) return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Book not found',
        life: 3000
      });

      this.edition.libro = book;

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Edition Created',
        life: 3000
      });
      this.editions.set([..._editions, this.edition]);

    } else {
      // TODO: Implementar API
      let i = _editions.findIndex(b => b.isbn === this.unchangedEdition.isbn);
      _editions[i] = this.edition;

      this.editions.set(_editions);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Edition Updated',
        life: 3000
      });
    }

    this.editionDialog = false;
    this.edition = { isbn: 0, libro: { titulo: '', author: { nombre: '' } }, year: '', lang: '' };
  }
}
