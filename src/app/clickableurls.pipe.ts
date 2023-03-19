import { Pipe, PipeTransform } from '@angular/core';
import * as linkifyString from 'linkifyjs/string';

@Pipe({name: 'clickableurls'})
export class ClickableurlsPipe implements PipeTransform {
  transform(str: string): string {
    return str ? linkifyString(str, {target: '_system'}) : str;
  }
}


// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'clickableurls'
// })
// export class ClickableurlsPipe implements PipeTransform {

//   transform(text: any): any {
//     var urlRegex =  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

//     // OLD REGEX
//     // /(\b(https?|http?|www?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    

//     return text.replace(urlRegex, function(url) {
//       if(url.length > 35) 
//         return '<a href="//' + url + '" target="_blank">' + url.slice(0, 35) +  '... </a>';
//       return '<a href="//' + url + '" target="_blank">' + url.slice(0, 35) +  '</a>';
//     });
//   }
// }
