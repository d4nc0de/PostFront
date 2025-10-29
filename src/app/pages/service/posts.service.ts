import { post } from '@/Models/post.model';
import { Injectable } from '@angular/core';
import { UserService } from './users.service';
import { CommentService } from './comments.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // TODO: No usar los servicios dentro de otros servicios, al usar la API
  constructor(private userService: UserService, private commentService: CommentService) { }

  getPosts(): post[] {
    // TODO: IMPLEMENTAR API

    return this.getDummyPosts();
  }

  getSinglePost(id: number): any {
    // TODO: IMPLEMENTAR API

    const posts = this.getPosts();
    return posts.find(post => post.id === id);
  }

  getDummyPosts(): post[] {
    return [
      {
        id: 0,
        title: 'First Post',
        description: 'Hello world',
        category: 'Accessories',
        CreatedBy: this.userService.getSingleUser(0),
        comments: this.commentService.getCommentsFromPost(0)
      },
      {
        id: 1,
        title: 'Second Post',
        description: 'Hello world again',
        category: 'Accessories',
        CreatedBy: this.userService.getSingleUser(1),
        comments: this.commentService.getCommentsFromPost(1)
      }
      ,
      {
        id: 2,
        title: 'Third Post',
        description: 'Some more content to test listings',
        category: 'Gadgets',
        CreatedBy: this.userService.getSingleUser(0),
        comments: this.commentService.getCommentsFromPost(2)
      },
      {
        id: 3,
        title: 'Fourth Post',
        description: 'Another example post for UI testing',
        category: 'Tools',
        CreatedBy: this.userService.getSingleUser(1),
        comments: this.commentService.getCommentsFromPost(3)
      }
    ];
  }
}