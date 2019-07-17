import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search-feed',
  templateUrl: './search-feed.component.html',
  styleUrls: ['./search-feed.component.css']
})
export class SearchFeedComponent implements OnInit {
state$: Observable<any>;
searchResult:any;
//private stateService:StateService
  constructor(public route:ActivatedRoute) { }

  ngOnInit() {
//this.searchResult=this.stateService.searchResult;
this.state$ = this.route.paramMap.pipe(
  map(() => window.history.state)
);
this.state$.subscribe(data=>{
this.searchResult=data.data.res;
console.log(this.searchResult);
})

  }
  selectedValue=2
  journeyTypes = [
    {JourneyType: 1, name: "One Way"},
    {JourneyType: 2, name: "Round Trip"},
    {JourneyType: 3, name: "Multi City"},
   
  ];
 
}
