import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchByStop'
})
export class SearchByStopPipe implements PipeTransform {

  transform(arr: any[], filterBy: number): any[] {
    console.log(arr)
    console.log(filterBy)
    if(filterBy==null){
      return arr;
    }
    return arr.filter(x=>x.PricedIternaries.every(x=>x.Stops==filterBy));
  
  }
}
