import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class DataTablePaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    this.itemsPerPageLabel = 'Zeilen Pro Seite';
    this.nextPageLabel = 'Nächste Seite';
    this.previousPageLabel = 'Vorherige Seite';
    this.changes.next();
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 - ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} von ${length}`;
  };
}
