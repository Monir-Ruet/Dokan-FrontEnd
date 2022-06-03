import { Injectable } from '@angular/core';
import { Products } from '../Interfaces/interface';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  CartCount=new BehaviorSubject(0);
  CartCounter= this.CartCount.asObservable();

  getProductFromCart(){
    let data=JSON.parse(localStorage.getItem("Cart")!);
    if(data!=null) this.CartCount.next(data.length);
    else this.CartCount.next(0);
    return data;
  }
  removerAllCart(){
    return localStorage.removeItem('Cart');
  }
  updateAcart(code:string,value:number){
    let ProductAddedToCart=this.getProductFromCart();
    if(ProductAddedToCart!=null){
      let idx=ProductAddedToCart.findIndex((e:any)=>{
        return e.Product.Code==code;
      });
      if(idx!=-1){
        ProductAddedToCart[idx].Quantity=value;
        console.log(ProductAddedToCart)
        localStorage.setItem('Cart',JSON.stringify(ProductAddedToCart));
        return this.getProductFromCart();
      }
    }
  }
  addProductToCart(Products:any){
    this.CartCount.next(Products.length);
    return localStorage.setItem('Cart',JSON.stringify(Products));
  }
  removeACart(Product:Products){
    let ProductAddedToCart=this.getProductFromCart();
    if(ProductAddedToCart!=null){
      let idx=ProductAddedToCart.findIndex((e:any)=>{
        return e.Product.Code==Product.Code;
      });
      if(idx!=-1){
        ProductAddedToCart.splice(idx,1);
        localStorage.setItem('Cart',JSON.stringify(ProductAddedToCart));
        return this.getProductFromCart();
      }
    }
  }
}
