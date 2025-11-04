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
import { Prestamo } from '@/Models/prestamo.model';
import { PrestamoService } from '../service/prestamos.service';
import { UserService } from '../service/users.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-prestamos-crud',
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
  templateUrl: './prestamos-crud.html',
  styleUrl: './prestamos-crud.scss'
})
export class PrestamosCrud {

  prestamoDialog: boolean = false;
  isNew: boolean = false;

  prestamos = signal<Prestamo[]>([]);
  editions: Edition[] = [];
  copies: Copy[] = [];

  prestamo!: Prestamo;
  unchangedPrestamo!: Prestamo;

  selectedPrestamos!: Prestamo[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;
  cols!: Column[];

  constructor(
    private bookService: BookService,
    private userService: UserService,
    private prestamosService: PrestamoService,
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
    const prestamos = this.prestamosService.getPrestamos();
    const editions = this.editionsService.getEditions();
    const copies = this.copiesService.getCopies();

    this.prestamos.set(prestamos);
    this.editions = editions;
    this.copies = copies;
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
    this.prestamo = { user: this.userService.getSingleUser(0), copia: this.copiesService.getSingleCopy(1), fecha_prestamo: new Date(), fecha_devolucion: null };
    this.submitted = false;
    this.prestamoDialog = true;
    this.isNew = true;
  }

  editPrestamo(prestamo: Prestamo) {
    this.isNew = false;
    this.unchangedPrestamo = { ...prestamo }; // Store the original book for comparison
    this.prestamo = structuredClone(prestamo);
    this.prestamoDialog = true;
  }

  deleteSelectedPrestamos() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected loan?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.prestamos.set(this.prestamos().filter((val) => !this.selectedPrestamos?.includes(val)));
        this.selectedPrestamos = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Loans Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.prestamoDialog = false;
    this.submitted = false;
  }

  deletePrestamo(prestamo: Prestamo) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected loan?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.prestamos.set(this.prestamos().filter((val) => val !== prestamo));
        this.prestamo = { user: this.userService.getSingleUser(0), copia: this.copiesService.getSingleCopy(0), fecha_prestamo: new Date(), fecha_devolucion: new Date() };
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Loan Deleted',
          life: 3000
        });
      }
    });
  }

  savePrestamo() {
    this.submitted = true;
    let _prestamos = this.prestamos();

    if (this.prestamo.user.id.toString().trim().length === 0 || this.prestamo.copia.numero.toString().trim().length === 0 || this.prestamo.copia.edition.isbn.toString().trim().length === 0 || this.prestamo.fecha_prestamo.toString().trim().length === 0) return;

    if (this.isNew) {
      console.log(this.prestamo.user.id);
      let user = this.userService.getSingleUser(Number(this.prestamo.user.id));
      let copia = this.copiesService.getSingleCopy(Number(this.prestamo.copia.numero));

      if (!user) return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not found',
        life: 3000
      });

      if (!copia) return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Copy not found',
        life: 3000
      });

      // TODO: Implementar API
      this.prestamo.user = user;
      this.prestamo.copia = copia;
      this.prestamo.fecha_prestamo = this.prestamo.fecha_prestamo || new Date();
      this.prestamo.fecha_devolucion = this.prestamo.fecha_devolucion || null;

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Loan Created',
        life: 3000
      });
      this.prestamos.set([..._prestamos, this.prestamo]);
    } else {
      // TODO: Implementar API
      let i = _prestamos.findIndex(b => b.user.id === this.unchangedPrestamo.user.id && b.copia.numero === this.unchangedPrestamo.copia.numero);

      let user = this.userService.getSingleUser(Number(this.prestamo.user.id));
      let copia = this.copiesService.getSingleCopy(Number(this.prestamo.copia.numero));

      if (!user) return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not found',
        life: 3000
      });

      if (!copia) return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Copy not found',
        life: 3000
      });

      this.prestamo.user = user;
      this.prestamo.copia = copia;
      this.prestamo.fecha_prestamo = this.prestamo.fecha_prestamo || new Date();
      this.prestamo.fecha_devolucion = this.prestamo.fecha_devolucion || null;

      _prestamos[i] = this.prestamo;

      this.prestamos.set(_prestamos);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Loan Updated',
        life: 3000
      });
    }

    this.prestamoDialog = false;
    this.prestamo = { user: this.userService.getSingleUser(0), copia: this.copiesService.getSingleCopy(1), fecha_prestamo: new Date(), fecha_devolucion: null };
  }
}
