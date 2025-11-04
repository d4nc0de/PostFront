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
import { Author } from '@/Models/author.model';

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
  selector: 'app-copies-crud',
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
  templateUrl: './copies-crud.html',
  styleUrl: './copies-crud.scss'
})
export class CopiesCrud {
  copyDialog: boolean = false;
  isNew: boolean = false;

  copies = signal<Copy[]>([]);

  copy!: Copy;
  unchangedCopy!: Copy;

  selectedCopies!: Copy[] | null;

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
    const copies = this.copiesService.getCopies()

    this.copies.set(copies);

    this.cols = [
      { field: 'titulo', header: 'Título', customExportHeader: 'titulo' },
      { field: 'author.nombre', header: 'Autor' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.copy = { numero: 0, edition: { isbn: 0, libro: { titulo: '', author: { nombre: '' } }, year: '', lang: '' } };
    this.submitted = false;
    this.copyDialog = true;
    this.isNew = true;
  }

  editCopy(copy: Copy) {
    this.isNew = false;
    this.unchangedCopy = { ...copy }; // Store the original copy for comparison
    this.copy = structuredClone(copy);
    this.copyDialog = true;
  }

  deleteSelectedCopies() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected copies?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.copies.set(this.copies().filter((val) => !this.selectedCopies?.includes(val)));
        this.selectedCopies = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Copies Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.copyDialog = false;
    this.submitted = false;
  }

  deleteCopy(copy: Copy) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete copy for ' + copy.edition.libro.titulo + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.copies.set(this.copies().filter((val) => val.numero !== copy.numero));
        this.copy = { numero: 0, edition: { isbn: 0, libro: { titulo: '', author: { nombre: '' } }, year: '', lang: '' } };
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Copy Deleted',
          life: 3000
        });
      }
    });
  }

  saveCopy() {
    this.submitted = true;
    let _copies = this.copies();

    if(this.copy.numero.toString().trim().length === 0 || this.copy.edition.isbn.toString().trim().length === 0) return;

    if (this.isNew) {
      // TODO: Implementar API
      const edition = this.editionsService.getSingleEdition(Number(this.copy.edition.isbn));
      if (!edition) return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: '(ISBN) Edition not found',
        life: 3000
      });

      this.copy.edition = edition;

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Copy Created',
        life: 3000
      });
      this.copies.set([..._copies, this.copy]);

    } else {
      // TODO: Implementar API
      let i = _copies.findIndex(b => b.numero === this.unchangedCopy.numero);
      _copies[i] = this.copy;

      this.copies.set(_copies);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Copy Updated',
        life: 3000
      });
    }

    this.copyDialog = false;
    this.copy = { numero: 0, edition: { isbn: 0, libro: { titulo: '', author: { nombre: '' } }, year: '', lang: '' } };
  }
}
