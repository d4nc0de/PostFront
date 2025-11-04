import { Copy } from '@/Models/copy.model';
import { Injectable } from '@angular/core';
import { EditionService } from './editions.service';

@Injectable({
  providedIn: 'root'
})
export class CopyService {
  constructor(private editionService: EditionService) { }

  getCopies(): Copy[] {
    return this.getDummyCopies();
  }

  getSingleCopy(numero: number): any {
    const copies = this.getCopies();
    return copies.find(c => c.numero === numero);
  }

  getDummyCopies(): Copy[] {
    return [
      { numero: 1, edition: this.editionService.getSingleEdition(9780307389732) },
      { numero: 2, edition: this.editionService.getSingleEdition(9788420400590) },
      { numero: 3, edition: this.editionService.getSingleEdition(9780544003415) }
    ];
  }
}
