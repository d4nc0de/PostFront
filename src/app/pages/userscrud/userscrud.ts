import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
import { User } from '@/Models/user.model';
import { UserService } from '../service/users.service';

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
  templateUrl: './userscrud.html',
  styleUrl: './userscrud.scss'
})
export class Userscrud {
  userDialog: boolean = false;
  isNew: boolean = false;

  users: User[] = [];

  user!: User;
  unchangedUser!: User;

  selectedUsers!: User[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  constructor(
    private usersService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    // Suscribirse al Observable para obtener los posts de la API
    this.usersService.getUsers().subscribe({
      next: (users) => {
        console.log('✅ Usuarios obtenidos de la API:', users);
        this.users = users;
      },
      error: (error) => {
        console.error('❌ Error al obtener usuarios:', error);
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.user = { userName: '', id: 0, email: '', password: '' };
    this.submitted = false;
    this.userDialog = true;
    this.isNew = true;
  }

  editUser(user: User) {
    this.isNew = false;
    this.unchangedUser = { ...user }; // Store the original user for comparison
    this.user = structuredClone(user);
    this.userDialog = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO: Eliminacion de usuarios API
        this.selectedUsers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Users Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.userName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // TODO: Eliminacion de usuario API
        this.user = { userName: '', id: 0, email: '', password: '' };
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Deleted',
          life: 3000
        });
      }
    });
  }

  saveUser() {
    this.submitted = true;
    let _users = this.users;

    if (this.user.userName.trim().length === 0) return;

    if (this.isNew) {
      // TODO: Implementar API para nuevo usuario

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'User Created',
        life: 3000
      });
    } else {
      // TODO: Implementar API para actualizar usuario

      let i = _users.findIndex(b => b.userName === this.unchangedUser.userName);
      this.users[i] = this.user;

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'User Updated',
        life: 3000
      });
    }

    this.userDialog = false;
    this.user = { userName: '', id: 0, email: '', password: '' };
  }
}
