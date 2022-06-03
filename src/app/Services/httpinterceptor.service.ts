import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor() { }
  intercept(req:any, next:any) {
    let tokenizedReq= req.clone({
      setHeaders:{
        Authorization:'Bearer '+localStorage.getItem('Token')
      }
    })
    return next.handle(tokenizedReq)
  }
}
