import { Injectable } from '@angular/core';
import { Prestamo } from '@/Models/prestamo.model';
import { CopyService } from './copies.service';
import { UserService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  constructor(private copyService: CopyService, private userService: UserService) { }

  getPrestamos(): Prestamo[] {
    return this.getDummyPrestamos();
  }

  getSinglePrestamo(user_id: number, numero_copia: number): any {
    const prestamos = this.getPrestamos();
    return prestamos.find(p => p.user.id === user_id && p.copia.numero === numero_copia);
  }

  getDummyPrestamos(): Prestamo[] {
    return [
      { user: this.userService.getSingleUser(0), copia: this.copyService.getSingleCopy(1), fecha_prestamo: new Date('2025-06-01T09:00:00'), fecha_devolucion: new Date('2025-06-15T09:00:00') },
      { user: this.userService.getSingleUser(1), copia: this.copyService.getSingleCopy(2), fecha_prestamo: new Date('2025-07-05T10:30:00'), fecha_devolucion: new Date('2025-07-20T10:30:00') }
    ];
  }
}
