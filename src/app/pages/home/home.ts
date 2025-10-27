import { AddEditPostDialog } from '@/dialogs/add-dialog/add-edit-post-dialog';
import { post } from '@/Models/post.model';
import { User } from '@/Models/user.model';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { TabsModule } from 'primeng/tabs';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-home',
  imports: [     CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        RippleModule,
        SplitButtonModule,
        AccordionModule,
        FieldsetModule,
        MenuModule,
        InputTextModule,
        DividerModule,
        SplitterModule,
        PanelModule,
        TabsModule,
        IconFieldModule,
        InputIconModule,
        AvatarModule
  ],
  providers: [DialogService],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
   ref?: DynamicDialogRef;

  users: User[] = [
    { id: 0, userName: 'alice', email: 'alice@mail.com', password: '' },
    { id: 0, userName: 'bob', email: 'bob@mail.com', password: '' }
  ];

  posts: post[] = [
    {
      id: 0,
      title: 'First Post',
      description: 'Hello world',
      category: 'Accessories',
      CreatedBy: this.users[0],
      comments: [
        {
          id: 0,
          content: 'Prueba',
          createdBy: this.users[0]
        }
      ]
    }
  ];

    items: MenuItem[] = [
        {
            label: 'Save',
            icon: 'pi pi-check'
        },
        {
            label: 'Update',
            icon: 'pi pi-upload'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            label: 'Home Page',
            icon: 'pi pi-home'
        }
    ];

     constructor(private dialogService: DialogService) {}


     openCreate() {
    this.ref = this.dialogService.open(AddEditPostDialog, {
      header: 'New Post',
      width: '40rem',
      modal: true,
      closable: true,
      data: { mode: 'create', users: this.users }
    });

    this.ref.onClose.subscribe((result?: post) => {
      if (result) this.posts = [result, ...this.posts];
    });
  }

  openEdit(index: number) {
    const selected = this.posts[index];

    this.ref = this.dialogService.open(AddEditPostDialog, {
      header: 'Edit Post',
      width: '40rem',
      modal: true,
      closable: true,
      data: { mode: 'edit', post: selected, users: this.users }
    });

    this.ref.onClose.subscribe((result?: post) => {
      if (result) {
        this.posts = this.posts.map((p, i) => (i === index ? result : p));
      }
    });
  }

  ngOnDestroy() {
    this.ref?.close();
  }
}
