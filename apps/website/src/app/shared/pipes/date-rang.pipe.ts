import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'dateRange',
  pure: true,
})
export class DateRangePipe implements PipeTransform {
  transform(date: string) {
    const start = dayjs(date, 'YYYY-MM-DD');
    const end = start.add(7, 'day');

    return `${start.format('DD.MM.YYYY')} - ${end.format('DD.MM.YYYY')} `;
  }
}
