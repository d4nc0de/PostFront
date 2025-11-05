import { User } from '@/Models/user.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  getUsers(): Observable<User[]> {
    // Hace la llamada a la API: GET http://localhost:44343/User
    const url = `${this.base}/User`;
    console.log('🔵 Intentando obtener usuarios de:', url);
    
    return this.http.get<any[]>(url).pipe(
      map((apiUsers) => {
        // Mapear los datos de la API al formato esperado
        console.log('📦 Datos recibidos de la API (sin mapear):', apiUsers);
        const mappedUsers = apiUsers.map((apiUser: any) => {
          // Si la API usa idu/nombre/mail, convertir a id/userName/email
          const user: User = {
            id: apiUser.idu ?? apiUser.id ?? 0,
            userName: apiUser.nombre ?? apiUser.userName ?? '',
            email: apiUser.mail ?? apiUser.email ?? '',
            password: apiUser.password ?? ''
          };
          return user;
        });
        console.log('✅ Usuarios obtenidos de la API:', mappedUsers);
        console.log('✅ Cantidad:', mappedUsers.length);
        return mappedUsers;
      }),
      catchError((error) => {
        // Si la API falla, NO retornar dummies - mostrar error y array vacío
        console.error('❌ ===== ERROR AL OBTENER USUARIOS DE LA API =====');
        console.error('❌ URL intentada:', url);
        console.error('❌ Status:', error.status || 'Sin status');
        console.error('❌ Mensaje:', error.message || 'Sin mensaje');
        if (error.error) {
          console.error('❌ Error details:', error.error);
        }
        console.error('❌ Error completo:', error);
        console.error('❌ ===== NO SE USARÁN DATOS DUMMY =====');
        // Retornar array vacío en lugar de dummies
        return of([]);
      })
    );
  }

  // Método síncrono para obtener usuarios dummy (usado en servicios de datos dummy)
  getSingleUser(id: number): User {
    // Busca en los dummies directamente
    const dummy = this.getDummyUsers().find(user => user.id === id);
    return dummy || { id: 0, userName: '', email: '', password: '' };
  }

  // Método asíncrono para obtener usuarios de la API
  getSingleUserFromApi(id: number): Observable<User> {
    // Hace la llamada a la API: GET http://localhost:44343/User/{id}
    const url = `${this.base}/User/${id}`;
    return this.http.get<any>(url).pipe(
      map((apiUser: any) => {
        // Mapear los datos de la API al formato esperado
        return {
          id: apiUser.idu ?? apiUser.id ?? 0,
          userName: apiUser.nombre ?? apiUser.userName ?? '',
          email: apiUser.mail ?? apiUser.email ?? '',
          password: apiUser.password ?? ''
        };
      }),
      catchError(() => {
        // Si falla, busca en los dummies
        const dummy = this.getDummyUsers().find(user => user.id === id);
        return dummy ? of(dummy) : of({ id: 0, userName: '', email: '', password: '' });
      })
    );
  }

  getDummyUsers(): User[] {
    return [
      { id: 0, userName: 'alice', email: 'alice@mail.com', password: '' },
      { id: 1, userName: 'bob', email: 'bob@mail.com', password: '' }
    ];
  }
}