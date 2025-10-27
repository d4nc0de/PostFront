import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  getUsers(): any[] {
    return this.getDummyUsers();
  }

  getUser(idu: number): any {
    const users = this.getUsers();
    return users.find(user => user.idu === idu);

    // LUEGO IMPLEMENTAR LLAMADA REAL
  }

  getDummyUsers(): any[] {
    return [
      {
        idu: 1,
        nombre: 'Carlos'
      },
      {
        idu: 2,
        nombre: 'Luis'
      },
      {
        idu: 3,
        nombre: 'Maria'
      },
      {
        idu: 4,
        nombre: 'Jose'
      },
      {
        idu: 5,
        nombre: 'Ana'
      },
      {
        idu: 6,
        nombre: 'Marta'
      }
    ];
  }
}