import { comment } from '@/Models/comments.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, catchError, of, map, switchMap, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './users.service';

@Injectable({
  providedIn: 'root'
})

export class CommentService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;
  
  constructor(private userService: UserService) { }
  
  getCommentsFromPost(post_id: number): Observable<comment[]> {
    // Usar el endpoint correcto según la documentación: /Comment/post/{idp}
    const url = `${this.base}/Comment/post/${post_id}`;
    console.log('🔵 Intentando obtener comentarios del post', post_id, 'de:', url);
    
    return this.userService.getUsers().pipe(
      switchMap((users) => {
        console.log('👥 Usuarios obtenidos para mapear comentarios:', users);
        
        return this.http.get<any[]>(url).pipe(
          map((apiComments) => {
            console.log('📦 Comentarios recibidos de la API (sin mapear):', apiComments);
            const mappedComments = this.mapComments(apiComments, users);
            console.log('✅ Comentarios mapeados:', mappedComments);
            return mappedComments;
          }),
          catchError((error) => {
            console.error('❌ Error al obtener comentarios de la API:', error);
            console.error('❌ Intentando con endpoint alternativo...');
            // Intentar con endpoint alternativo
            return this.getCommentsFromPostAlternative(post_id, users);
          })
        );
      })
    );
  }

  private getCommentsFromPostAlternative(post_id: number, users: any[]): Observable<comment[]> {
    // Intentar con /Comment/GetComentsAutByPost/{idp} que devuelve solo comentarios autorizados
    const url = `${this.base}/Comment/GetComentsAutByPost/${post_id}`;
    console.log('🔵 Intentando obtener comentarios autorizados con endpoint alternativo:', url);
    
    return this.http.get<any[]>(url).pipe(
      map((apiComments) => {
        console.log('📦 Comentarios recibidos (alternativo):', apiComments);
        return this.mapComments(apiComments, users);
      }),
      catchError((error) => {
        console.error('❌ Error también con endpoint alternativo:', error);
        console.warn('⚠️ Retornando array vacío - los comentarios no están disponibles desde la API');
        return of([]);
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

  createComment(commentData: comment): Observable<comment> {
    const url = `${this.base}/Comment/Crear`;
    console.log('🔵 Creando comentario en:', url);
    
    // Validar que tenemos el postId
    if (!commentData.idp || commentData.idp === 0) {
      console.error('❌ Error: idp no válido:', commentData.idp);
      return new Observable(observer => {
        observer.error(new Error('El comentario debe estar asociado a un post válido'));
      });
    }
    
    // Mapear el comentario al formato de la API
    const now = new Date();
    const apiComment: any = {
      idp: commentData.idp,
      consec: 0, // Para crear, siempre debe ser 0
      idu: commentData.createdBy.id,
      contenidoCom: commentData.content,
      fechorCom: now.toISOString(),
      likeNotLike: commentData.liked || false
    };
    
    // iduAutorizador es nullable - solo incluir si hay autorización
    if (commentData.authorizedBy && commentData.authorizedBy.id) {
      apiComment.iduAutorizador = commentData.authorizedBy.id;
      apiComment.fechorAut = (commentData.authorizedDate || now).toISOString();
    } else {
      // Si no hay autorización, no enviar estos campos o enviarlos como null
      apiComment.iduAutorizador = null;
      apiComment.fechorAut = null;
    }
    
    console.log('📤 Datos del comentario a crear:', apiComment);
    console.log('📤 Validación - idp:', apiComment.idp, 'idu:', apiComment.idu, 'contenido:', apiComment.contenidoCom);
    
    // Verificar que todos los campos requeridos estén presentes
    if (!apiComment.idp || !apiComment.idu || !apiComment.contenidoCom) {
      console.error('❌ Faltan campos requeridos:', apiComment);
      return new Observable(observer => {
        observer.error(new Error('Faltan campos requeridos para crear el comentario'));
      });
    }
    
    return this.http.post<any>(url, apiComment, { 
      headers: { 'Content-Type': 'application/json' },
      observe: 'response' as const
    }).pipe(
      switchMap((httpResponse) => {
        // Verificar que el status sea 200
        if (httpResponse.status !== 200) {
          throw new Error(`Error del servidor: ${httpResponse.status} - ${httpResponse.statusText}`);
        }
        
        // La respuesta puede ser texto plano o JSON, no importa el contenido
        const responseBody = httpResponse.body;
        console.log('✅ Respuesta de creación de comentario (status):', httpResponse.status);
        console.log('✅ Respuesta de creación de comentario (body):', responseBody);
        
        // Esperar un poco para que la API procese el comentario antes de obtenerlo
        return timer(1500).pipe(
          switchMap(() => {
            // Después de crear, obtener todos los comentarios del post para obtener el comentario completo
            return this.getCommentsFromPost(commentData.idp).pipe(
              map((comments) => {
                // Buscar el comentario recién creado (el más reciente o por contenido)
                const newComment = comments.find(c => 
                  c.content === commentData.content && 
                  c.createdBy.id === commentData.createdBy.id
                );
                
                if (newComment) {
                  console.log('✅ Comentario creado y obtenido:', newComment);
                  return newComment;
                } else if (comments.length > 0) {
                  console.warn('⚠️ Comentario no encontrado después de crear, retornando el más reciente');
                  // Ordenar por fecha de creación y tomar el más reciente
                  const sorted = [...comments].sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  );
                  return sorted[0];
                } else {
                  throw new Error('No se pudo obtener el comentario creado');
                }
              })
            );
          })
        );
      }),
      catchError((error: HttpErrorResponse | Error) => {
        console.error('❌ ===== ERROR AL CREAR COMENTARIO =====');
        console.error('❌ Error completo:', error);
        
        if (error instanceof HttpErrorResponse) {
          console.error('❌ Error status:', error.status);
          console.error('❌ Error statusText:', error.statusText);
          console.error('❌ Error URL:', error.url);
          if (error.error) {
            console.error('❌ Error error:', error.error);
            console.error('❌ Error error tipo:', typeof error.error);
            // Si el error es texto, intentar parsearlo
            if (typeof error.error === 'string') {
              console.error('❌ Error como texto:', error.error);
            }
          }
          if (error.message) {
            console.error('❌ Error message:', error.message);
          }
        } else {
          console.error('❌ Error message:', error.message);
        }
        
        console.error('❌ Datos enviados:', apiComment);
        console.error('❌ ===== FIN ERROR =====');
        
        // Crear un error más descriptivo
        const errorMessage = error instanceof HttpErrorResponse 
          ? `Error ${error.status}: ${error.statusText || 'Error del servidor'}`
          : error.message;
        throw new Error(errorMessage);
      })
    );
  }

  updateComment(commentData: comment): Observable<comment> {
    const url = `${this.base}/Comment/post/${commentData.idp}/COMENTARIO/${commentData.id}`;
    console.log('🔵 Actualizando comentario en:', url);
    
    // Mapear el comentario al formato de la API
    const apiComment = {
      idp: commentData.idp,
      consec: commentData.id,
      idu: commentData.createdBy.id,
      iduAutorizador: commentData.authorizedBy?.id || null,
      contenidoCom: commentData.content,
      fechorCom: commentData.createdAt.toISOString(),
      likeNotLike: commentData.liked,
      fechorAut: commentData.authorizedDate?.toISOString() || null
    };
    
    console.log('📤 Datos del comentario a actualizar:', apiComment);
    
    return this.http.put<any>(url, apiComment).pipe(
      switchMap((response) => {
        console.log('✅ Respuesta de actualización de comentario:', response);
        // Después de actualizar, obtener todos los comentarios del post
        return this.getCommentsFromPost(commentData.idp).pipe(
          map(comments => {
            // Buscar el comentario actualizado
            const updatedComment = comments.find(c => c.id === commentData.id);
            if (!updatedComment) {
              throw new Error('Comentario no encontrado después de actualizar');
            }
            console.log('✅ Comentario actualizado:', updatedComment);
            return updatedComment;
          })
        );
      }),
      catchError((error) => {
        console.error('❌ Error al actualizar comentario:', error);
        throw error;
      })
    );
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