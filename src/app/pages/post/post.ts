import { post } from '@/Models/post.model';
import { Component } from '@angular/core';
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
export class Post {
  constructor(
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private postsService: PostService,
    private usersService: UserService
  ) { }

  comments: comment[] = [];
  post: post | undefined;
  ref?: DynamicDialogRef;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.post = this.postsService.getSinglePost(+id);
      this.comments = this.post?.comments || [];
    }
  }

  openCreateComment() {
    this.ref = this.dialogService.open(AddEditCommentDialog, {
      header: 'Add Comment',
      width: '40rem',
      modal: true,
      closable: true,
      data: { mode: 'create', users: this.usersService.getUsers() }
    });

    this.ref.onClose.subscribe((result?: comment) => {
      if (result) this.comments = [result, ...this.comments];
    });
  }

  openEditComment(comment: comment) {
    this.ref = this.dialogService.open(AddEditCommentDialog, {
      header: 'Edit Comment',
      width: '40rem',
      modal: true,
      closable: true,
      data: { mode: 'edit', users: this.usersService.getUsers(), comment }
    });

    this.ref.onClose.subscribe((result?: comment) => {
      if (result) this.comments[this.comments.findIndex(c => c.id === comment.id)] = result;
    });
  }

  openDeleteComment(comment: comment) {
    this.ref = this.dialogService.open(ConfirmActionDialog, {
      header: '',
      modal: true,
      closable: false,
      data: { confirmation: "Are you sure you want to delete this comment?", comment }
    });

    this.ref.onClose.subscribe((result?: boolean) => {
      if (result) this.comments.splice(this.comments.findIndex(c => c.id === comment.id), 1);
    });
  }

  get authorizedComments() {
    return this.comments?.filter(c => c.authorizedDate) || [];
  }
}
