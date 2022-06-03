import { Component, OnInit ,Input,Output,EventEmitter, AfterViewInit, OnDestroy} from '@angular/core';
import { UserService } from '../Services/user.service';
import { UserInterface } from '../Interfaces/interface';
import { CartService } from '../Services/cart.service';
import { Route, Router } from '@angular/router';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{
  
  User:UserInterface ={} as any;
  UserSubcriber:any=null!;
  LoggedInSubscriber:any=null!;

  constructor(public userservice:UserService,public cartService:CartService,public router:Router,public Product:ProductService) { 
    this.UserSubcriber=this.userservice.UserDetails.subscribe((user)=>{
      this.User=user;
    })
    this.cartService.getProductFromCart();
    this.LoggedInSubscriber=this.userservice.isLoggedIn.subscribe((res)=>this.isLoggedIn=res);
  }
  ngOnDestroy(): void {
    this.LoggedInSubscriber.unsubscribe();
    this.UserSubcriber.unsubscribe();
  }
  count:number=0;
  ngOnInit(): void { 
    this.cartService.CartCounter.subscribe((data)=>{
      this.count=data;
    })
  }
  checkRole(){
    return localStorage.getItem('Role')=='Admin';
  }
  active:boolean[]=[false,false,false];
  isLoggedIn:boolean=false;
}
