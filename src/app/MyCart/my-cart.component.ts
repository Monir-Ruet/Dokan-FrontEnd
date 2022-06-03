import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cart, Products } from '../Interfaces/interface';
import { CartService } from '../Services/cart.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css']
})
export class MyCartComponent implements OnInit ,OnDestroy {

  constructor(public cartService:CartService) { }
  ImageUrl:string=environment.Api+'/products/image/'
  CartProduct!:Cart[];
  counter:number=0;
  CartSubscriber:any=null!;
  ngOnInit(): void {
    this.CartSubscriber=this.cartService.CartCounter.subscribe((data)=>{
      this.counter=data;
    })
    this.CartProduct=this.cartService.getProductFromCart();
  }
  ngOnDestroy(): void {
    this.CartSubscriber.unsubscribe();
  }
  removeProduct(product:Products){
    this.CartProduct=this.cartService.removeACart(product);
  }
  showEmpty(){
    return this.CartProduct==null || this.CartProduct.length==0;
  }
  updateCart(Code:string,value:number){
    return this.CartProduct=this.cartService.updateAcart(Code,value);
  }
  parseNumber(x:string){
    return parseInt(x);
  }
  total(){
    let sum=0;
    for(var i=0;i<this.CartProduct.length;i++) sum+=this.CartProduct[i].Product.Price*this.CartProduct[i].Quantity;
    return sum;
  }
}
