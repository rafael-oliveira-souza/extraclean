import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../utils/DateUtils';
import { MomentInput } from 'moment';

@Pipe({
  name: 'data',
  standalone: true
})
export class DatePipe implements PipeTransform {

  transform(value: MomentInput, format?: string): unknown {
    if (format) {
      return DateUtils.format(value, format);
    }

    return DateUtils.format(value, DateUtils.BR);
  }

}
