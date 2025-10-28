import { User } from '@/Models/user.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  getUsers(): User[] {
    // TODO: IMPLEMENTAR API

    return this.getDummyUsers();
  }

  getSingleUser(id: number): any {
    // TODO: IMPLEMENTAR API

    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  getDummyUsers(): User[] {
    return [
      { id: 0, userName: 'alice', email: 'alice@mail.com', password: '' },
      { id: 1, userName: 'bob', email: 'bob@mail.com', password: '' }
    ];
  }
}