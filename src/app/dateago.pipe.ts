import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from "@angular/common";
import {Component,
  Inject,
  LOCALE_ID }
  from '@angular/core';


@Pipe({
  name: 'dateago',
})
export class DateagoPipe implements PipeTransform {

 

  transform(value: any, args?: any): any {
    if (value) {
        const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
        if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
            return 'Just now';
        if (seconds > 604800) // more than a week returns just the timestamp again
            return formatDate(value, 'mediumDate', this.locale) 
        const intervals: { [key: string]: number } = {
            'year': 31536000,
            'month': 2592000,
            'w': 604800,
            'd': 86400,
            'h': 3600,
            'm': 60,
            's': 1
        };
        let counter;
        for (const i in intervals) {
            counter = Math.floor(seconds / intervals[i]);
            if (counter > 0)
                if (counter === 1) {
                    return counter + ' ' + i // + ' ago'; // singular (1 day ago)
                } else {
                    return counter + ' ' + i // + 's ago'; // plural (2 days ago)
                }
        }
    }
    return value;
}
constructor(
  @Inject(LOCALE_ID) public locale: string,){}
}
