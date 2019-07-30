import { Component, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FlightService } from 'src/app/services/flight.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { Observable} from 'rxjs';
import {coerceNumberProperty} from '@angular/cdk/coercion';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Options, LabelType, ChangeContext } from 'ng5-slider';
import { CollapseComponent } from 'angular-bootstrap-md';

declare var $: any;
@Component({
  selector: 'app-search-feed',
  templateUrl: './search-feed.component.html',
  styleUrls: ['./search-feed.component.css']
})
export class SearchFeedComponent implements OnInit {
  //....collapse    AfterViewInit
  
  // @ViewChildren(CollapseComponent) collapses: CollapseComponent[];

  // ngAfterViewInit() {
  //   Promise.resolve().then(() => {
  //     this.collapses.forEach((collapse: CollapseComponent) => {
  //       collapse.toggle();
  //     });
  //   })
  // }


  //..collapse
 list4=[]
checked=false;
indeterminate = false;
state$: Observable<any>;
searchResult:any;
distinctAirlines=[
]
  journeyTypes = [
    {JourneyType: 1, name: "One Way"},
    {JourneyType: 2, name: "Round Trip"},
    {JourneyType: 3, name: "Multi City"},
   
  ];
 
  //................BS Datepicker.............
 
  displayMonths = 2;
  navigation = 'none';
  showWeekNumbers = false;
  outsideDays = 'hidden';
  //................BS Datepicker.............
  //  state$: Observable<object>;
  flightInfo = {
    OriginDestinationInformation: [
      {
        SequenceNumber: 0,
        OriginLocationCode: '',
        DestinationLocationCode: '',
        OriginLocation: '',
        DestinationLocation: '',
        DepartureDateTime: '',
        ReturnDateTime: '',
        OriginCity:'',
        DestinationCity: '',
        OriginAirport: '',
        DestinationAirport:''
      }
    ]
  }
  
  minJourneyDate:Date
  minReturnDate:Date
  searchForm:FormGroup
  constructor(private fb:FormBuilder,
    private datePipe: DatePipe,
    private flightService:FlightService,
    public router:Router,
    public route:ActivatedRoute)

         { 
    this.minJourneyDate=new Date()
    this.minReturnDate=new Date()
    this.minReturnDate.setDate(this.minJourneyDate.getDate() + 2);
         }
  
  
  ngOnInit() {

    
    //...............search feed..........
    this.state$ = this.route.paramMap.pipe(
      map(() => window.history.state)
    );
    this.state$.subscribe(data=>{
    let items=data.data.res;
    localStorage.setItem('searchResult',JSON.stringify(items));
   
   if (localStorage.getItem('searchResult')) {
   this.searchResult =JSON.parse(localStorage.getItem('searchResult'));
             } else {
        this.searchResult = []
         }
       console.log(this.searchResult);
        })
        this.searchResult=JSON.parse(localStorage.getItem('searchResult'));
//.............search feed...............    
   

    
    this.searchForm=this.fb.group({
      JourneyType:this.searchResult.Results.SearchRequest.JourneyType,
      OriginDestinationInformation: this.fb.array([
        ]),
      Adults:[1],
      PeopleTxt: ['1 Travellers, Economy'],
      Children: 0,
      Infants: 0,
      TravelClass: ['Economy'],
      IsLocalSearch: false,
      SeatRequested: 0,
      ProviderId: 1,
      Currency: ['BDT']
    })
   this.setOriginDestinationInformation()
    this.getFlights();


    //slider start......................
    // for (let i=this.searchResult.Results.AllGroupedIternaries.length-1; i>=0; i--) {
    //   let tmp = this.searchResult.Results.AllGroupedIternaries[i].Price;
    //   if (tmp < this.options.floor) this.options.floor = tmp;
    //   if (tmp > this.options.ceil) this.options.ceil = tmp;
    // }
 let arrPrice= this.searchResult.Results.AllGroupedIternaries.map(x=>x.Price)
 this.options.floor=Math.min.apply(Math,arrPrice);
 this.options.ceil=Math.max.apply(Math,arrPrice);
  this.minValue=Math.min.apply(Math,arrPrice);
  this.maxValue=Math.max.apply(Math,arrPrice);

  
    //.............slider end.........................

    //..........filter...........
let arrAirlines=this.searchResult.Results.AllGroupedIternaries.map(x=>x.AirlineName);
console.log(arrAirlines);
this.distinctAirlines=[...new Set(arrAirlines)];
console.log(this.distinctAirlines)
    //..............filter..............
//stops filter......................
let list1= this.searchResult.Results.AllGroupedIternaries.map(group=>group.PricedIternaries.map(x=>x.Stops));
let list2:any[]=[...new Set(list1)];
let list3=[]

for ( let i = 0; i < list2.length; i++ ) {

for ( var x = 0; x < list2[i].length; x++ ) {
    list3.push(list2[i][x]);  
}
}
this.list4=[...new Set(list3)]  
console.log(this.list4);    

//...................Travellers Touchspin.....................
    $(document).ready(()=>{
    
      let InitSpinners=() =>{
        var mx = 9;
        var adt = parseInt($("#flt-people-adult").val());
    
        $("#flt-people-adult").TouchSpin({
            min: 1,
            max: mx,
            buttondown_class: "btn spinner-btn  flt-adt-spinner-btn",
            buttonup_class: "btn spinner-btn  flt-adt-spinner-btn"
        });
    
        mx = parseInt($("#flt-people-max-adults").val()) - adt;
        $("#flt-people-child").TouchSpin({
            min: 0,
            max: mx,
            buttondown_class: "btn spinner-btn flt-child-spinner-btn",
            buttonup_class: "btn spinner-btn flt-child-spinner-btn"
        });
    
        $("#flt-people-infant").TouchSpin({
            min: 0,
            max: adt,
            buttondown_class: "btn spinner-btn flt-child-spinner-btn",
            buttonup_class: "btn spinner-btn flt-child-spinner-btn"
        });
    }

      InitSpinners();

      $('body').on('click', 'input[name=TravelClass]',  (event)=> {
        SetDisplayText();
    });

      $('body').on('click', '.flt-adt-spinner-btn',  (event)=> {

        $("#flt-people-child").val("0")
        $("#flt-people-infant").val("0")
        ReInitSpinner();
    
        SetDisplayText();
    });

      $('body').on('click', '.flt-child-spinner-btn', (event)=> {
        SetDisplayText();
    });
    
    
    
    let ReInitSpinner=()=> {
        var adt = parseInt($("#flt-people-adult").val());
        var mx = 9 - adt;
    
        $("#flt-people-child").trigger("touchspin.updatesettings", { max: mx });
        $("#flt-people-infant").trigger("touchspin.updatesettings", { max: adt });
    }
    let SetDisplayText=()=> {
      var a = parseInt($("#flt-people-adult").val());
      var c = parseInt($("#flt-people-child").val());
      var i = parseInt($("#flt-people-infant").val());

       
       this.searchForm.get('Adults').setValue(a);
       this.searchForm.get('Children').setValue(c);
       this.searchForm.get('Infants').setValue(i);
       console.log(this.searchForm.value.Adults);
      
      var t = a + c + i;
      var txt = t + " Traveller";
      if (t > 1) {
          txt += "s"
      }
  
      var cType = $("input[name=TravelClass]:checked").val();
      txt += ", " + cType;
      this.searchForm.get('PeopleTxt').setValue(txt);
      $("#traveller-summary").html(txt);
  } 



  // Panel Dropdown
  let close_panel_dropdown=()=> {
		$('.panel-dropdown').removeClass("active");
    }
    $('.panel-dropdown a').on('click', function(e) {
		if ( $(this).parent().is(".active") ) {
            close_panel_dropdown();
        } else {
            close_panel_dropdown();
            $(this).parent().addClass('active');
        }
        e.preventDefault();
    });

    // Closes dropdown on click outside the conatainer
	var mouse_is_inside = false;

	$('.panel-dropdown').hover(()=>{
	    mouse_is_inside=true;
	}, function(){
	    mouse_is_inside=false;
	});

	$("body").mouseup(()=>{
	    if(! mouse_is_inside) close_panel_dropdown();
	});
	
	/* Dropdown user logged */
	$('.dropdown-user').hover( ()=> {
		$(this).find('.dropdown-menu').stop(true, true).delay(50).fadeIn(300);
	}, function () {
		$(this).find('.dropdown-menu').stop(true, true).delay(50).fadeOut(300);
	});
    
  });

  
}

//..................Travellers Touchspin end....................
  searchRequest;
  searchFlight(){
    this.searchRequest=Object.assign({},this.searchForm.value);
    for (let i = 0; i < this.searchRequest.OriginDestinationInformation.length; i++) {
      let ngbDate1= this.searchRequest.OriginDestinationInformation[i].DepartureDateTime;
      let ngbDate2= this.searchRequest.OriginDestinationInformation[i].ReturnDateTime;
      let fromDate =this.datePipe.transform( new Date(ngbDate1.year, ngbDate1.month-1, ngbDate1.day),"dd MMM yy"); 
      let toDate=this.datePipe.transform( new Date(ngbDate2.year, ngbDate2.month-1, ngbDate2.day),"dd MMM yy");
      this.searchRequest.OriginDestinationInformation[i].DepartureDateTime=fromDate;
      this.searchRequest.OriginDestinationInformation[i].ReturnDateTime=toDate;
    }
   
    this.flightService.getSearchKey(this.searchRequest).subscribe(res=>{
      this.searchRequest.SearchId=res.SearchKey;
      console.log('success');
   
     },error=>{
      console.log(error,'something went Wrong');
    },()=>{
      this.flightService.searchFlights(this.searchRequest).subscribe(res=>{
        localStorage.removeItem('searchResult');
        localStorage.setItem('searchResult',JSON.stringify(res));
     
        if(localStorage.getItem('searchResult')){
         this.searchResult = JSON.parse(localStorage.getItem('searchResult'))
      }else{
          this.searchResult=[];
      }
      //this.searchResult=res;
      // console.log(this.searchResult);


       },error=>{
         console.log(error,'error');
       })
      
    })
  }

 
  //......autocomplete...................
  data:any[]
  keyword='Value'
  getFlights(){
   return this.flightService.getFlights().subscribe(res=>{
     console.log(res.AirportList);
     this.data=res.AirportList;
   })
  }
  destinationFlight={
    Value:'Zia Intl Airport',
    City:'Dhaka',
    Code:'DAC',
    
  }
  arrivalFlight={
    Value:'Newyork Arpt',
    City:'Newyork',
    Code:'JFK',
    
  }
  onSelectDestination(event: TypeaheadMatch,i): void {
    this.destinationFlight = event.item;
    ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('OriginCity').setValue(this.destinationFlight.City);
    ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('OriginLocationCode').setValue(this.destinationFlight.Code);
    ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('OriginLocation').setValue(this.destinationFlight.City+' ('+this.destinationFlight.Code+')');
    ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('OriginAirport').setValue(this.destinationFlight.Value);
    console.log(this.destinationFlight);
  }

  onSelectArrival(event: TypeaheadMatch,i): void {
    this.arrivalFlight = event.item;
    ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('DestinationCity').setValue(this.arrivalFlight.City);
    ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('DestinationLocationCode').setValue(this.arrivalFlight.Code);
    ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('DestinationLocation').setValue(this.arrivalFlight.City+' ('+this.arrivalFlight.Code+')');
    ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('DestinationAirport').setValue(this.arrivalFlight.Value);
    console.log(this.arrivalFlight);
  }
  
validateOriginCity(i){
  return (<FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('OriginCity').hasError('required') &&
  (<FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('originCity').touched
  
}
validateDestinationCity(i){
  return (<FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('DestinationCity').hasError('required') &&
  (<FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('DestinationCity').touched
}

addNewFlight() {
  let control = <FormArray>this.searchForm.controls.OriginDestinationInformation;
      this.flightInfo.OriginDestinationInformation.forEach(x =>{
          control.push(this.fb.group({
            OriginLocationCode: this.destinationFlight.Code,
            DestinationLocationCode: this.arrivalFlight.Code,
            OriginLocation: this.destinationFlight.City+' ('+this.destinationFlight.Code+')',
            DestinationLocation: this.arrivalFlight.City+' ('+this.arrivalFlight.Code+')',
            DepartureDateTime:[''],
            ReturnDateTime:[''],
            OriginCity:[this.destinationFlight.City,Validators.required],
            DestinationCity: [this.arrivalFlight.City,Validators.required],
            OriginAirport: this.destinationFlight.Value,
            DestinationAirport:this.arrivalFlight.Value
          }))
        })
}

//.....................
  swap(from,to,i){
  this.destinationFlight=from;
  this.arrivalFlight=to;
  let temp=this.destinationFlight;
  this.destinationFlight=this.arrivalFlight;
  this.arrivalFlight=temp;
  ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('OriginCity').setValue(this.destinationFlight.City);
  ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('DestinationCity').setValue(this.arrivalFlight.City);

  }
FromToNotSame(i){
 
 return ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('OriginCity').value== ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('DestinationCity').value &&
   ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('OriginCity').value!='' &&
   ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('DestinationCity').value!='';
}
  setDestinationNull(i){
   ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('OriginCity').setValue('');
    }
    setArrivalNull(i){
      ( <FormArray>this.searchForm.get('OriginDestinationInformation')).at(i).get('DestinationCity').setValue('');
    }

    switchToReturn(){
      this.searchForm.get('JourneyType').setValue('2');
    }
    baktToOneWay(){
      this.searchForm.get('JourneyType').setValue('1');
    }

    setOriginDestinationInformation() {
      let control = <FormArray>this.searchForm.controls.OriginDestinationInformation;
      this.flightInfo.OriginDestinationInformation.forEach(x =>{
          control.push(this.fb.group({
            SequenceNumber: 0,
            OriginLocationCode: this.destinationFlight.Code,
            DestinationLocationCode: this.arrivalFlight.Code,
            OriginLocation: this.destinationFlight.City+' ('+this.destinationFlight.Code+')',
            DestinationLocation: this.arrivalFlight.City+' ('+this.arrivalFlight.Code+')',
            DepartureDateTime:[''],
            ReturnDateTime: [{year:2019,month:7,day:21}],
            OriginCity:[this.destinationFlight.City,Validators.required],
            DestinationCity: [this.arrivalFlight.City,Validators.required],
            OriginAirport: this.destinationFlight.Value,
            DestinationAirport:this.arrivalFlight.Value
          }))
        })
      }
      
     
    
     removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
   
    selectedDestinationId:any
    selectedReturnId:any
    radioChangeHandler1(e:any){
    this.selectedDestinationId=e.target.value;
    console.log(this.selectedDestinationId);
  
    }
  
    radioChangeHandler2(e:any){
      this.selectedReturnId=e.target.value;
      console.log(this.selectedReturnId);
    
      }

      pricedItinerary?:any
      selectPricedItinerary(i){
     this.pricedItinerary=this.searchResult.Results.AllGroupedIternaries[i].PricedIternaries.filter(x=>x.Id==this.selectedDestinationId+','+this.selectedReturnId)[0];
      console.log(this.pricedItinerary);
    }
      show;
      loadMore(key):boolean{
        this.show=key;
        
        return !!this.show;
        
      }
      
    

    //.....................Slider.................
  minValue: number = 100;
  maxValue: number = 400;
  options: Options = {
    floor:0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '\u09F3' +' '+ value;
        case LabelType.High:
          return '\u09F3' +' '+ value;
        default:
          return "\u09F3" + ' '+ value;
      }
    }
  };


 
  lower;
  higher;
  onUserChange(changeContext: ChangeContext): void {
    this.lower=changeContext.value;
    this.higher=changeContext.highValue;
  }
    //.....................Slider................
    airlineName;
    myFunc($event) {
      console.log($event.source.value);
      this.airlineName=$event.source.value;
    }
     stop;
    searchByStop(stop:number){
      this.stop=stop;
      }
      startTime;
      endTime;
      filterByTime(str:string){
         let arr=str.split('-');
         this.startTime=arr[0];
         this.endTime=arr[1];
      }   
    
    expanded(){
        alert('ok');
     }

     showBsCollapse(){
       alert('ok');
     }
}
