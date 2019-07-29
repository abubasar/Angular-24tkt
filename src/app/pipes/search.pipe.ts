import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'minimatch';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(arr: any[], filterBy: any): any[] {
    if(filterBy==null){
      return arr;
    }
    return arr.filter(x=>x.AirlineName.includes(filterBy));
  
  }

}
