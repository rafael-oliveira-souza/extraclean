import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../utils/DateUtils';
import { MomentInput } from 'moment';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'data',
  standalone: true
})
export class DataPipe implements PipeTransform {

  transform(value: MomentInput, format?: string): unknown {
    if (!value) {
      return null;
    }

    if (format) {
      return DateUtils.format(value, format);
    }

    return new DatePipe('pt').transform(value.toString(), 'dd/MM/yyyy');
  }

}
