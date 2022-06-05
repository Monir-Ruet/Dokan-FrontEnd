import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { WebsocketService } from './Services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  constructor(public router:Router,private socket:WebsocketService){
    this.socket.listen('notify').subscribe((data)=>{
      alert(`Product with code ${data} has been changed.`)
    })
  }
  blockRoute(){
    return this.router.url=='/login'
  }
}