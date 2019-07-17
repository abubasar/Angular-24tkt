import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http:HttpClient) {


   }
  //  headers = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   'Authorization':'public whpPQCbEJk' });
  //    options = { headers: this.headers };

   getFlights():Observable<any>{
     return this.http.get('http://api.trip.xyz/common/airportslist');
   }
   
   getSearchKey(searchRequest:any):Observable<any>{
     searchRequest.JourneyType=parseInt(searchRequest.JourneyType);
     
return this.http.post<any>('http://api.trip.xyz/flights/searchkey',searchRequest);
   }

   searchFlights(searchRequest:any):Observable<any>{
    searchRequest.JourneyType=parseInt(searchRequest.JourneyType)
    return this.http.post<any>('http://api.trip.xyz/flights/search',searchRequest);
  }


}
