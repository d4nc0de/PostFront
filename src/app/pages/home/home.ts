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
import { PostService } from '../service/posts.service';
import { UserService } from '../service/users.service';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmActionDialog } from '@/dialogs/confirm-dialom/confirm-action-dialog/confirm-action-dialog';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
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
    AvatarModule,
    TieredMenuModule
  ],
  providers: [DialogService],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  ref?: DynamicDialogRef;

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private postService: PostService
  ) { }

  users: User[] = [];
  posts: post[] = [];
  postActionsMap = new Map<number, MenuItem[]>();
  usersSelection: MenuItem[] = [
    {
      label: 'Sin filtro',
      icon: 'pi pi-users',
      command: () => {
        this.posts = this.postService.getPosts();
      }
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

  getPostActions(_post: post): MenuItem[] {
    return [
      {
        label: 'Edit Post',
        icon: 'pi pi-pencil',
        command: () => this.openEdit(_post)
      },
      {
        label: 'Delete Post',
        icon: 'pi pi-trash',
        command: () => this.openDelete(_post)
      }
    ];
  }

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

  ngOnInit() {
    this.posts = this.postService.getPosts();
    this.users = this.userService.getUsers();

    this.users.forEach(u => {
      this.usersSelection.push({
        label: u.userName,
        icon: 'pi pi-user',
        command: () => this.filterView(u)
      });
    });

    this.posts.forEach(p => {
      this.postActionsMap.set(p.id, this.getPostActions(p));
    });
  }

  openEdit(post: post) {
    // TODO: Hacerlo con API
    const postIndex = this.posts.findIndex(p => p.id === post.id);
    const selected = this.posts[postIndex];

    this.ref = this.dialogService.open(AddEditPostDialog, {
      header: 'Edit Post',
      width: '40rem',
      modal: true,
      closable: true,
      data: { mode: 'edit', post: selected, users: this.users }
    });

    this.ref.onClose.subscribe((result?: post) => {
      if (result) {
        this.posts = this.posts.map((p, i) => (i === postIndex ? result : p));
      }
    });
  }

  openDelete(post: post) {
    // TODO: Hacerlo con API
    const postIndex = this.posts.findIndex(p => p.id === post.id);

    this.ref = this.dialogService.open(ConfirmActionDialog, {
      modal: true,
      closable: false,
      data: { confirmation: "Are you sure you want to delete this post?" }
    });

    this.ref.onClose.subscribe((result?: boolean) => {
      if (result) this.posts.splice(postIndex, 1);
    });
  }

  filterView(user: User) {
    // TODO: Hacerlo con API
    this.posts = this.postService.getPosts().filter(p => p.CreatedBy.id === user.id);
  }

  ngOnDestroy() {
    this.ref?.close();
  }

  authorizedCommentsFromPost(post: post) {
    return post.comments?.filter(c => c.authorizedDate) || [];
  }
}
