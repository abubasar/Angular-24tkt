import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByPrice'
})
export class FilterByPricePipe implements PipeTransform {

  transform(arr: any[], low: any,high:any): any[] {
    if(low==null){
      return arr;
    }
    if(high==null){
      return arr;
    }
    return arr.filter((item: any) =>
    item.Price >= low && item.Price <= high);
  
  }
}
