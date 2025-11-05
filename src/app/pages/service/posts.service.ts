import { post } from '@/Models/post.model';
import { comment } from '@/Models/comments.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, catchError, of, map, forkJoin, switchMap, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './users.service';
import { CommentService } from './comments.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;
  
  constructor(private userService: UserService, private commentService: CommentService) { }

  getPosts(): Observable<post[]> {
    // Primero obtener usuarios, luego posts
    return this.userService.getUsers().pipe(
      switchMap((users) => {
        console.log('👥 Usuarios obtenidos para mapear posts:', users);
        
        // Hace la llamada a la API: GET https://localhost:44343/Post/ObtenerPosts
        const url = `${this.base}/Post/ObtenerPosts`;
        console.log('🔵 Intentando obtener posts de:', url);
        
        return this.http.get<any[]>(url).pipe(
          switchMap((apiPosts) => {
            console.log('📦 Datos recibidos de la API (sin mapear):', apiPosts);
            const mappedPosts = apiPosts.map((apiPost: any) => {
              // Buscar el usuario por idu
              const userId = apiPost.idu ?? 0;
              const user = users.find(u => u.id === userId) || {
                id: userId,
                userName: 'Usuario',
                email: '',
                password: ''
              };
              
              console.log(`👤 Post ${apiPost.idp}: Usuario encontrado - ${user.userName} (id: ${user.id})`);
              
              // Mapear los datos de la API al formato esperado
              const postComments = this.mapComments(apiPost.comments || apiPost.Comentarios || [], users);
              console.log(`📝 Post ${apiPost.idp ?? apiPost.id}: ${postComments.length} comentarios encontrados en la respuesta`);
              
              const post: post = {
                id: apiPost.idp ?? apiPost.id ?? 0,
                title: apiPost.tittle ?? apiPost.title ?? '',
                description: apiPost.contenido ?? apiPost.description ?? '',
                category: apiPost.category ?? '',
                CreatedBy: user,
                comments: postComments
              };
              return post;
            });

            // Si algún post no tiene comentarios, intentar cargarlos por separado
            const postsNeedingComments = mappedPosts.filter(p => !p.comments || p.comments.length === 0);
            
            if (postsNeedingComments.length > 0) {
              console.log(`🔄 Cargando comentarios por separado para ${postsNeedingComments.length} posts...`);
              const commentRequests = postsNeedingComments.map(post => 
                this.commentService.getCommentsFromPost(post.id).pipe(
                  catchError(() => {
                    console.warn(`⚠️ No se pudieron cargar comentarios para el post ${post.id}`);
                    return of([]);
                  })
                )
              );

              return forkJoin(commentRequests).pipe(
                map((commentsArrays) => {
                  // Asignar los comentarios cargados a los posts correspondientes
                  postsNeedingComments.forEach((post, index) => {
                    post.comments = commentsArrays[index] || [];
                    console.log(`✅ Post ${post.id}: ${post.comments.length} comentarios cargados por separado`);
                  });
                  return mappedPosts;
                })
              );
            }

            return of(mappedPosts);
          }),
          map((mappedPosts) => {
            console.log('✅ Posts obtenidos de la API:', mappedPosts);
            console.log(`📊 Total de posts: ${mappedPosts.length}, Total de comentarios: ${mappedPosts.reduce((sum, p) => sum + (p.comments?.length || 0), 0)}`);
            return mappedPosts;
          }),
          catchError((error) => {
            const errorUrl = `${this.base}/Post/ObtenerPosts`;
            console.error('❌ ===== ERROR AL OBTENER POSTS DE LA API =====');
            console.error('❌ URL intentada:', errorUrl);
            console.error('❌ Status:', error.status || 'Sin status');
            console.error('❌ Mensaje:', error.message || 'Sin mensaje');
            console.error('❌ ===== RETORNANDO ARRAY VACÍO =====');
            return of([]);
          })
        );
      })
    );
  }

  getSinglePost(id: number): Observable<post | undefined> {
    // Obtener posts de la API y buscar el que coincida con el id
    return this.getPosts().pipe(
      map(posts => posts.find(post => post.id === id))
    );
  }

  createPost(postData: post): Observable<post> {
    const url = `${this.base}/Post`;
    console.log('🔵 Creando post en:', url);
    
    // Validar datos antes de mapear
    if (!postData.title || !postData.description || !postData.category || !postData.CreatedBy?.id) {
      console.error('❌ Faltan campos requeridos en postData:', postData);
      return new Observable(observer => {
        observer.error(new Error('Faltan campos requeridos para crear el post'));
      });
    }
    
    // Mapear el post al formato de la API
    // Limpiar y validar los datos antes de enviar
    // Según la documentación de la API, se debe enviar idp: 0 para crear
    const apiPost: any = {
      idp: 0, // Para crear, siempre debe ser 0 según la API
      tittle: String(postData.title || '').trim(),
      contenido: String(postData.description || '').trim(),
      category: String(postData.category || '').trim(),
      idu: Number(postData.CreatedBy.id)
    };
    
    // Validación final después del mapeo
    if (!apiPost.tittle || !apiPost.contenido || !apiPost.category || !apiPost.idu || apiPost.idu === 0) {
      console.error('❌ Faltan campos requeridos después del mapeo:', apiPost);
      return new Observable(observer => {
        observer.error(new Error('Faltan campos requeridos para crear el post'));
      });
    }
    
    console.log('📤 Datos del post a crear (original):', postData);
    console.log('📤 Datos del post a crear (mapeado):', JSON.stringify(apiPost, null, 2));
    console.log('📤 Validación - idu:', apiPost.idu, 'título:', apiPost.tittle, 'category:', apiPost.category);
    console.log('📤 URL completa:', url);
    
    // Preparar headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    };
    
    console.log('📤 Headers:', headers);
    
    return this.http.post<any>(url, apiPost, { 
      headers: headers,
      observe: 'response' as const
    }).pipe(
      switchMap((httpResponse) => {
        // Verificar que el status sea 200
        if (httpResponse.status !== 200) {
          throw new Error(`Error del servidor: ${httpResponse.status} - ${httpResponse.statusText}`);
        }
        
        // La respuesta puede ser texto plano o JSON, no importa el contenido
        const responseBody = httpResponse.body;
        console.log('✅ Respuesta de creación de post (status):', httpResponse.status);
        console.log('✅ Respuesta de creación de post (body):', responseBody);
        
        // Esperar un poco para que la API procese el post antes de obtenerlo
        return timer(1500).pipe(
          switchMap(() => {
            // Después de crear, obtener todos los posts para obtener el post completo con su ID
            return this.getPosts().pipe(
              map((posts) => {
                // Buscar el post recién creado (el más reciente o por título y descripción)
                const newPost = posts.find(p => 
                  p.title === postData.title && 
                  p.CreatedBy.id === postData.CreatedBy.id &&
                  p.description === postData.description
                );
                
                if (newPost) {
                  console.log('✅ Post creado y obtenido:', newPost);
                  return newPost;
                } else if (posts.length > 0) {
                  // Si no se encuentra exacto, buscar el más reciente con el mismo autor
                  const recentPosts = posts
                    .filter(p => p.CreatedBy.id === postData.CreatedBy.id)
                    .sort((a, b) => b.id - a.id);
                  
                  if (recentPosts.length > 0) {
                    console.warn('⚠️ Post no encontrado exacto, retornando el más reciente del autor:', recentPosts[0]);
                    return recentPosts[0];
                  }
                  
                  console.warn('⚠️ Post no encontrado, retornando el primero de la lista');
                  return posts[0];
                } else {
                  throw new Error('No se pudo obtener el post creado - la lista está vacía');
                }
              })
            );
          })
        );
      }),
      catchError((error: HttpErrorResponse | Error) => {
        console.error('❌ ===== ERROR AL CREAR POST =====');
        console.error('❌ Error completo:', error);
        
        let errorDetails = '';
        
        if (error instanceof HttpErrorResponse) {
          console.error('❌ Error status:', error.status);
          console.error('❌ Error statusText:', error.statusText);
          console.error('❌ Error URL:', error.url);
          
          if (error.error) {
            console.error('❌ Error error:', error.error);
            console.error('❌ Error error tipo:', typeof error.error);
            
            // Intentar extraer el mensaje de error del servidor
            if (typeof error.error === 'string') {
              errorDetails = error.error;
              console.error('❌ Error como texto:', error.error);
            } else if (error.error && typeof error.error === 'object') {
              // Intentar extraer mensaje de error del objeto
              const errorObj = error.error;
              console.error('❌ Error como objeto completo:', errorObj);
              console.error('❌ Error como objeto (keys):', Object.keys(errorObj));
              console.error('❌ Error como objeto (JSON):', JSON.stringify(errorObj, null, 2));
              
              // Intentar diferentes propiedades comunes
              errorDetails = errorObj.message || 
                           errorObj.error || 
                           errorObj.Message ||
                           errorObj.Error ||
                           (Object.keys(errorObj).length === 0 ? '(objeto vacío - el servidor no devolvió detalles)' : JSON.stringify(errorObj));
            }
          }
          
          if (error.message) {
            console.error('❌ Error message:', error.message);
          }
        } else {
          console.error('❌ Error message:', error.message);
          errorDetails = error.message;
        }
        
        console.error('❌ Datos enviados:', apiPost);
        console.error('❌ Datos originales:', postData);
        console.error('❌ ===== FIN ERROR =====');
        
        // Crear un error más descriptivo
        let errorMessage = `Error al crear el post (${error instanceof HttpErrorResponse ? error.status : 'Desconocido'})`;
        if (errorDetails && errorDetails !== '(objeto vacío - el servidor no devolvió detalles)') {
          errorMessage += `: ${errorDetails}`;
        } else if (error instanceof HttpErrorResponse && error.status === 500) {
          errorMessage += `: Error interno del servidor (500). 

Posibles causas:
- El servidor tiene un problema interno
- Los datos enviados no cumplen con las validaciones del servidor
- Hay un problema con la base de datos

Por favor:
1. Verifica los logs del servidor para más detalles
2. Asegúrate de que el servidor esté funcionando correctamente
3. Verifica que el usuario (idu: ${apiPost.idu}) exista en la base de datos

Datos enviados:
${JSON.stringify(apiPost, null, 2)}`;
        }
        
        throw new Error(errorMessage);
      })
    );
  }

  updatePost(postData: post): Observable<post> {
    const url = `${this.base}/Post/post/${postData.id}`;
    console.log('🔵 Actualizando post en:', url);
    
    // Mapear el post al formato de la API
    const apiPost = {
      idp: postData.id,
      tittle: postData.title,
      contenido: postData.description,
      category: postData.category,
      idu: postData.CreatedBy.id
    };
    
    console.log('📤 Datos del post a actualizar:', apiPost);
    
    return this.http.put<any>(url, apiPost).pipe(
      switchMap((response) => {
        console.log('✅ Respuesta de actualización de post:', response);
        // Después de actualizar, obtener el post actualizado
        return this.getSinglePost(postData.id).pipe(
          map(updatedPost => {
            if (!updatedPost) {
              throw new Error('Post no encontrado después de actualizar');
            }
            console.log('✅ Post actualizado:', updatedPost);
            return updatedPost;
          })
        );
      }),
      catchError((error) => {
        console.error('❌ Error al actualizar post:', error);
        throw error;
      })
    );
  }

  private mapComments(apiComments: any[], users: any[] = []): comment[] {
    if (!apiComments || !Array.isArray(apiComments)) {
      return [];
    }
    
    return apiComments.map((apiComment: any) => {
      // Buscar usuario que creó el comentario
      const userId = apiComment.idu ?? 0;
      const createdByUser = users.find(u => u.id === userId) || {
        id: userId,
        userName: 'Usuario',
        email: '',
        password: ''
      };
      
      // Buscar usuario que autorizó el comentario
      const authorizedById = apiComment.iduAutorizador ?? null;
      const authorizedByUser = authorizedById ? (users.find(u => u.id === authorizedById) || {
        id: authorizedById,
        userName: 'Usuario',
        email: '',
        password: ''
      }) : null;
      
      const mappedComment: comment = {
        idp: apiComment.idp ?? 0,
        id: apiComment.consec ?? apiComment.id ?? 0,
        content: apiComment.contenidoCom ?? apiComment.content ?? '',
        createdBy: createdByUser,
        createdAt: apiComment.fechorCom ? new Date(apiComment.fechorCom) : (apiComment.createdAt ? new Date(apiComment.createdAt) : new Date()),
        liked: apiComment.likeNotLike ?? apiComment.liked ?? false,
        authorizedDate: apiComment.fechorAut ? new Date(apiComment.fechorAut) : (apiComment.authorizedDate ? new Date(apiComment.authorizedDate) : null),
        authorizedBy: authorizedByUser
      };
      return mappedComment;
    });
  }

  getDummyPosts(): post[] {
    // Obtener todos los comentarios dummy y filtrarlos por post
    const allDummyComments = this.commentService.getDummyComments();
    
    return [
      {
        id: 0,
        title: 'First Post',
        description: 'Hello world',
        category: 'Accessories',
        CreatedBy: this.userService.getSingleUser(0),
        comments: allDummyComments.filter(c => c.idp === 0)
      },
      {
        id: 1,
        title: 'Second Post',
        description: 'Hello world again',
        category: 'Accessories',
        CreatedBy: this.userService.getSingleUser(1),
        comments: allDummyComments.filter(c => c.idp === 1)
      },
      {
        id: 2,
        title: 'Third Post',
        description: 'Some more content to test listings',
        category: 'Gadgets',
        CreatedBy: this.userService.getSingleUser(0),
        comments: allDummyComments.filter(c => c.idp === 2)
      },
      {
        id: 3,
        title: 'Fourth Post',
        description: 'Another example post for UI testing',
        category: 'Tools',
        CreatedBy: this.userService.getSingleUser(1),
        comments: allDummyComments.filter(c => c.idp === 3)
      }
    ];
  }
}