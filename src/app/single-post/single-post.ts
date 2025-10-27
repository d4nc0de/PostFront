import { Component, OnInit, signal } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../services/posts-service';
import { UsersService } from '../services/users-service';
import { CommonModule } from '@angular/common';
import { CommentsService } from '../services/comments-service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.html',
  imports: [PanelModule, AvatarModule, ButtonModule, MenuModule, CardModule, CommonModule]
})
export class SinglePost implements OnInit {
  items: { label?: string; icon?: string; separator?: boolean }[] = [];
  post = signal<any | null>(null);
  author = signal<any | null>(null);
  comments = signal<any | null>(null);

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private userService: UsersService,
    private commentsService: CommentsService
  ) { }


  ngOnInit() {

    this.items = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil'
      },
      {
        separator: true
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-times'
      }
    ];

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const found = this.postsService.getSinglePost(Number(id));
      this.post.set(found || null);
      this.author.set(this.userService.getUser(found?.idu_publica) || "null");
      this.comments.set(this.commentsService.getCommentsForPost(Number(id)) || []);
    }
  }

  getUser(idu: number): any {
    return this.userService.getUser(idu) || null;
  }
}