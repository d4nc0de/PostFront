import { comment } from '@/Models/comments.model';
import { Injectable } from '@angular/core';
import { UserService } from './users.service';

@Injectable({
  providedIn: 'root'
})

export class CommentService {
  // TODO: No usar los servicios dentro de otros servicios, al usar la API
  constructor(private userService: UserService) { }
  getCommentsFromPost(post_id: number): any {
    // TODO: IMPLEMENTAR API

    const comments = this.getDummyComments();
    return comments.filter(comment => comment.idp === post_id);
  }

  getDummyComments(): comment[] {
    return [
      { id: 0, idp: 0, content: 'Prueba', createdBy: this.userService.getSingleUser(0), createdAt: new Date('2025-01-01T09:00:00'), liked: false, authorizedDate: new Date('2025-01-01T10:00:00'), authorizedBy: this.userService.getSingleUser(1) },
      { id: 1, idp: 0, content: 'Otro comentario', createdBy: this.userService.getSingleUser(1), createdAt: new Date('2025-01-02T11:00:00'), liked: true, authorizedDate: null, authorizedBy: null },
      { id: 2, idp: 1, content: 'Un comentario en otro post!', createdBy: this.userService.getSingleUser(1), createdAt: new Date('2025-01-03T12:00:00'), liked: false, authorizedDate: new Date('2025-01-03T12:30:00'), authorizedBy: this.userService.getSingleUser(0) },
      { id: 3, idp: 0, content: 'Me gusta este post', createdBy: this.userService.getSingleUser(0), createdAt: new Date('2025-02-01T08:30:00'), liked: true, authorizedDate: new Date('2025-02-01T09:00:00'), authorizedBy: this.userService.getSingleUser(1) },
      { id: 4, idp: 1, content: 'Gracias por compartir', createdBy: this.userService.getSingleUser(1), createdAt: new Date('2025-02-02T10:15:00'), liked: false, authorizedDate: null, authorizedBy: null },
      { id: 5, idp: 2, content: 'Interesante perspectiva', createdBy: this.userService.getSingleUser(0), createdAt: new Date('2025-03-05T14:00:00'), liked: false, authorizedDate: new Date('2025-03-05T15:00:00'), authorizedBy: this.userService.getSingleUser(1) },
      { id: 6, idp: 2, content: '¿Puedes ampliar esto?', createdBy: this.userService.getSingleUser(1), createdAt: new Date('2025-03-06T15:00:00'), liked: false, authorizedDate: null, authorizedBy: null },
      { id: 7, idp: 3, content: 'Buen trabajo!', createdBy: this.userService.getSingleUser(0), createdAt: new Date('2025-04-01T09:00:00'), liked: true, authorizedDate: null, authorizedBy: null },
      { id: 8, idp: 0, content: 'No estoy de acuerdo', createdBy: this.userService.getSingleUser(1), createdAt: new Date('2025-04-10T13:00:00'), liked: false, authorizedDate: null, authorizedBy: null },
      { id: 9, idp: 3, content: 'Súper útil, gracias', createdBy: this.userService.getSingleUser(0), createdAt: new Date('2025-05-01T16:45:00'), liked: true, authorizedDate: null, authorizedBy: null },
    ];
  }
}