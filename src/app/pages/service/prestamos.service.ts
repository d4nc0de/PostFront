import { Injectable } from '@angular/core';
import { Prestamo } from '@/Models/prestamo.model';
import { CopyService } from './copies.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  constructor(private copyService: CopyService) { }

  getPrestamos(): Prestamo[] {
    return this.getDummyPrestamos();
  }

  getSinglePrestamo(user_id: number, numero_copia: number): any {
    const prestamos = this.getPrestamos();
    return prestamos.find(p => p.user_id === user_id && p.copia.numero === numero_copia);
  }

  getDummyPrestamos(): Prestamo[] {
    return [
      { user_id: 0, copia: this.copyService.getSingleCopy(0), fecha_prestamo: new Date('2025-06-01T09:00:00'), fecha_devolucion: new Date('2025-06-15T09:00:00') },
      { user_id: 1, copia: this.copyService.getSingleCopy(1), fecha_prestamo: new Date('2025-07-05T10:30:00'), fecha_devolucion: new Date('2025-07-20T10:30:00') }
    ];
  }
}
