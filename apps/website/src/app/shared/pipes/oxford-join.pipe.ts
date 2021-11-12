import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'oxfordJoin',
  pure: true,
})
export class OxfordJoinPipe implements PipeTransform {
  transform(list: string[], conjunction = '&') {
    if (list.length < 2) {
      return list[0];
    }

    if (list.length < 3) {
      return list.join(` ${conjunction} `);
    }

    list = list.slice();
    list[list.length - 1] = `${conjunction} ${list[list.length - 1]}`;

    return list.join(', ');
  }
}
