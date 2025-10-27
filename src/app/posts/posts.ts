import { Component } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { PostsService } from '../services/posts-service';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.html',
    imports: [
      DataView,
      ButtonModule,
      CommonModule,
      FormsModule
    ]
})
export class Posts {
    layout: 'list' | 'grid' = 'grid';
    options = ['list', 'grid'];

    posts = signal<any>([]);

    constructor(private postsService: PostsService) {}

    ngOnInit() {
        this.posts.set(this.postsService.getPosts());
    }
}