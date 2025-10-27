import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  getCommentsForPost(idp: number): any[] {
    // LUEGO IMPLEMENTAR LLAMADA REAL

    const comments = this.getDummyComments();
    return comments.filter(comment => comment.idp === idp);
  }

  getDummyComments(): any[] {
    return [
      { idp: 1000, consec: 1, fechorCom: new Date(), likeNotLike: true, fechorAut: new Date(), ContenidoCom: 'Esto es un comentario positivo!', idu_hace: 1, idu_autoriza: 3 },
      { idp: 1000, consec: 2, fechorCom: new Date(), likeNotLike: false, fechorAut: new Date(), ContenidoCom: 'Esto es un comentario negativo!', idu_hace: 2, idu_autoriza: 3 },
      { idp: 1001, consec: 1, fechorCom: new Date(), likeNotLike: true, fechorAut: new Date(), ContenidoCom: 'Otro comentario positivo!', idu_hace: 2, idu_autoriza: 4 }
    ];
  }
}
