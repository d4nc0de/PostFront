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
        this.postService.getPosts().subscribe(posts => {
          this.posts = posts;
        });
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
      if (result) {
        // Recargar todos los posts para obtener los datos completos desde la API
        this.postService.getPosts().subscribe(posts => {
          this.posts = posts;
          // Actualizar el mapa de acciones
          this.posts.forEach(p => {
            this.postActionsMap.set(p.id, this.getPostActions(p));
          });
        });
      }
    });
  }

  ngOnInit() {
    // Suscribirse al Observable para obtener los posts de la API
    this.postService.getPosts().subscribe({
      next: (posts) => {
        console.log('✅ Posts obtenidos de la API:', posts);
        this.posts = posts;
        
        // Log para verificar comentarios
        posts.forEach(post => {
          const authorizedComments = this.authorizedCommentsFromPost(post);
          console.log(`📝 Post ${post.id} (${post.title}): ${post.comments?.length || 0} comentarios totales, ${authorizedComments.length} autorizados`);
        });
        
        // Crear el mapa de acciones para cada post
        this.posts.forEach(p => {
          this.postActionsMap.set(p.id, this.getPostActions(p));
        });
      },
      error: (error) => {
        console.error('❌ Error al obtener posts:', error);
      }
    });
    
    // Suscribirse al Observable para obtener los usuarios de la API
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('✅ Usuarios obtenidos:', users);
        console.log('✅ Cantidad de usuarios:', users.length);
        this.users = users;
        
        // Limpiar el menú antes de agregar nuevos usuarios
        this.usersSelection = [
          {
            label: 'Sin filtro',
            icon: 'pi pi-users',
            command: () => {
              this.postService.getPosts().subscribe(posts => {
                this.posts = posts;
              });
            }
          }
        ];
        
        // Una vez que tenemos los usuarios, los agregamos al menú
        this.users.forEach(u => {
          this.usersSelection.push({
            label: u.userName,
            icon: 'pi pi-user',
            command: () => this.filterView(u)
          });
        });
      },
      error: (error) => {
        console.error('❌ Error en la suscripción:', error);
      }
    });
  }

  openEdit(post: post) {
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
        // Recargar todos los posts para obtener los datos actualizados desde la API
        this.postService.getPosts().subscribe(posts => {
          this.posts = posts;
          // Actualizar el mapa de acciones
          this.posts.forEach(p => {
            this.postActionsMap.set(p.id, this.getPostActions(p));
          });
        });
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
    // Filtrar posts por usuario usando la API
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts.filter(p => p.CreatedBy.id === user.id);
    });
  }

  ngOnDestroy() {
    this.ref?.close();
  }

  authorizedCommentsFromPost(post: post) {
    return post.comments?.filter(c => c.authorizedDate) || [];
  }

  getInitial(userName: string | undefined | null): string {
    if (!userName) return 'U';
    return userName.toString().slice(0, 1).toUpperCase();
  }

  getUserName(user: User | undefined | null): string {
    return user?.userName || 'Usuario';
  }
}
