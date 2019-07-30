import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByTime'
})
export class FilterByTimePipe implements PipeTransform {

  transform(arr: any[], low: any,high:any): any[] {
    if(low==null){
      return arr;
    }
    if(high==null){
      return arr;
    }
    return arr.filter(x=>x.GroupedOriginDestinationOptions[0].GroupedOriginDestinations.every(x=>x.DepartureDate.split('T')[1] >= low && x.DepartureDate.split('T')[1] <= high));
  
  }

}
