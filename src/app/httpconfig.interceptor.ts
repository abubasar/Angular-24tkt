import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpHeaders}from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor( ) { }
 
  intercept(req,next){
    let tokenizedReq=req.clone({
      setHeaders:{
        authorization:`public whpPQCbEJk`,
        contentType:`application/json`
      }
    })
     return next.handle(tokenizedReq )
  }
}