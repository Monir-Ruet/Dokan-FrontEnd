import { Injectable } from '@angular/core';
import io from 'socket.io-client'
import { Observable, observable, Subscriber } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  socket:any;
  readonly uri:string=environment.Api;
  constructor() {
    this.socket=io(this.uri);
  }
  listen(eventname:string){
    return new Observable((Subscriber)=>{
      this.socket.on(eventname,(data:any)=>{
        Subscriber.next(data);
      })
    });
  }
  emit(eventname:string,data:any){
    this.socket.emit(eventname,data);
  }
}