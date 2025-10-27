import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  /* constructor(private http: HttpClient) {} */

  getPosts(): any[] {
    return this.getDummyPosts();
    /* return this.http.get<any[]>('https://api/posts'); */
  }

  getSinglePost(idp: number): any {
    const posts = this.getPosts();
    return posts.find(post => post.idp === idp);

    // LUEGO IMPLEMENTAR LLAMADA REAL
  }

  getDummyPosts(): any[] {
    return [
      {
        idp: 1000,
        contenido: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Quis est tam dissimile homini. Duo Reges: constructio interrete. Atque his de rebus et splendida est eorum et illustris oratio. ',
        idu_publica: 1
      },
      {
        idp: 1001,
        contenido: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Quis est tam dissimile homini. Duo Reges: constructio interrete. Atque his de rebus et splendida est eorum et illustris oratio. ',
        idu_publica: 2
      },
      {
        idp: 1002,
        contenido: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Quis est tam dissimile homini. Duo Reges: constructio interrete. Atque his de rebus et splendida est eorum et illustris oratio. ',
        idu_publica: 3
      },
      {
        idp: 1003,
        contenido: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Quis est tam dissimile homini. Duo Reges: constructio interrete. Atque his de rebus et splendida est eorum et illustris oratio. ',
        idu_publica: 4
      },
      {
        idp: 1004,
        contenido: 'Este es un post de prueba para verificar el funcionamiento de la aplicación. Contiene texto adicional para simular un post real en la plataforma. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Quis est tam dissimile homini. Duo Reges: constructio interrete. Atque his de rebus et splendida est eorum et illustris oratio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Quis est tam dissimile homini. Duo Reges: constructio interrete. Atque his de rebus et splendida est eorum et illustris oratio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Quis est tam dissimile homini. Duo Reges: constructio interrete. Atque his de rebus et splendida est eorum et illustris oratio.',
        idu_publica: 4
      }
    ];
  }
}
