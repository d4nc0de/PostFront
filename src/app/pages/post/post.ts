import { post } from '@/Models/post.model';
import { User } from '@/Models/user.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { SplitterModule } from 'primeng/splitter';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../service/posts.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddEditCommentDialog } from '@/dialogs/add-dialog/add-edit-comment-dialog/add-edit-comment-dialog';
import { UserService } from '../service/users.service';
import { comment } from '@/Models/comments.model';
import { ConfirmActionDialog } from '@/dialogs/confirm-dialom/confirm-action-dialog/confirm-action-dialog';

@Component({
  selector: 'app-post',
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
    AvatarModule
  ],
  providers: [DialogService],
  templateUrl: './post.html',
  styleUrl: './post.scss'
})
export class Post implements OnInit, OnDestroy {
  constructor(
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private postsService: PostService,
    private usersService: UserService
  ) { }

  comments: comment[] = [];
  post: post | undefined;
  ref?: DynamicDialogRef;
  showUnauthorizedComments = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postsService.getSinglePost(+id).subscribe(post => {
        if (post) {
          this.post = post;
          this.comments = post.comments || [];
        }
      });
    }
  }

  openCreateComment() {
    if (!this.post) {
      console.error('❌ No hay post disponible para crear comentario');
      return;
    }

    if (!this.post.id || this.post.id === 0) {
      console.error('❌ El post no tiene un ID válido:', this.post.id);
      alert('Error: El post no tiene un ID válido. Por favor, recarga la página.');
      return;
    }

    const postId = this.post.id;
    console.log('🔵 Abriendo diálogo de comentario para post ID:', postId);

    this.usersService.getUsers().subscribe((users: any[]) => {
      this.ref = this.dialogService.open(AddEditCommentDialog, {
        header: 'Add Comment',
        width: '40rem',
        modal: true,
        closable: true,
        data: { mode: 'create', users, postId: postId }
      });

      if (this.ref) {
        this.ref.onClose.subscribe((result?: comment) => {
          if (result) {
            // Recargar el post completo para obtener todos los comentarios actualizados
            this.postsService.getSinglePost(postId).subscribe(updatedPost => {
              if (updatedPost) {
                this.post = updatedPost;
                this.comments = updatedPost.comments || [];
              }
            });
          }
        });
      }
    });
  }

  openEditComment(commentItem: comment) {
    if (!this.post) {
      console.error('❌ No hay post disponible para editar comentario');
      return;
    }

    const postId = this.post.id || commentItem.idp;
    if (!postId || postId === 0) {
      console.error('❌ No se puede determinar el ID del post:', this.post.id, commentItem.idp);
      alert('Error: No se puede determinar el post asociado. Por favor, recarga la página.');
      return;
    }

    console.log('🔵 Abriendo diálogo de edición de comentario para post ID:', postId);

    this.usersService.getUsers().subscribe((users: any[]) => {
      this.ref = this.dialogService.open(AddEditCommentDialog, {
        header: 'Edit Comment',
        width: '40rem',
        modal: true,
        closable: true,
        data: { mode: 'edit', users, comment: commentItem, postId: postId }
      });

      if (this.ref) {
        this.ref.onClose.subscribe((result?: comment) => {
          if (result) {
            // Recargar el post completo para obtener todos los comentarios actualizados
            this.postsService.getSinglePost(this.post!.id).subscribe(updatedPost => {
              if (updatedPost) {
                this.post = updatedPost;
                this.comments = updatedPost.comments || [];
              }
            });
          }
        });
      }
    });
  }

  openDeleteComment(commentItem: comment) {
    this.ref = this.dialogService.open(ConfirmActionDialog, {
      modal: true,
      closable: false,
      data: { confirmation: "Are you sure you want to delete this comment?" }
    });

    if (this.ref) {
      this.ref.onClose.subscribe((result?: boolean) => {
        if (result) {
          const index = this.comments.findIndex((c: comment) => c.id === commentItem.id);
          if (index !== -1) {
            this.comments.splice(index, 1);
          }
        }
      });
    }
  }

  toggleUnauthorizedComments() {
    this.showUnauthorizedComments = !this.showUnauthorizedComments;
  }

  get authorizedComments(): comment[] {
    return this.showUnauthorizedComments ? this.comments : (this.comments?.filter((c: comment) => c.authorizedDate) || []);
  }

  getInitial(userName: string | undefined | null): string {
    if (!userName) return 'U';
    return userName.toString().slice(0, 1).toUpperCase();
  }

  getUserName(user: User | undefined | null): string {
    return user?.userName || 'Usuario';
  }

  ngOnDestroy() {
    this.ref?.close();
  }
}
