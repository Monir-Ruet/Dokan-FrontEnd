import { Component,  OnDestroy,  OnInit } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { Cart, Products } from '../Interfaces/interface';
import { SortDirection } from '@angular/material/sort';
import { BehaviorSubject, map } from 'rxjs';
import { CartService } from '../Services/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit ,OnDestroy{
  constructor(public product:ProductService,public cartService:CartService) {
    this.Product=[];
    this.product.resetFilter();
    this.FetchFilter();
    let flag=false;
    this.subscription=this.product.isfiltered.subscribe((data)=>{
      if(data===true && flag){
        this.page=0;
        this.total=0;
        this.spinnerShow=true;
        this.totalProduct=0;
        this.Product=[];
        this.FetchFilter();
      }
      flag=true;
    })
  }
  Product:Products[]=[];
  total:number=0;
  page:number=0;
  sort:string='';
  order:SortDirection='desc';
  totalProduct:number=0;
  ImageSrc=environment.Api+'/products/image/';
  filtered:boolean=false;
  subscription:any=null!;
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    
    this.subscription.unsubscribe();
  }
  spinnerShow:boolean=true;
  FetchFilter(){
    this.product.FetchFiltered('CreatedDate','asc',this.page)
    .pipe(
      map((result)=>{
        if(result.total_count) this.totalProduct=result.total_count;
          let item=result.items;
          this.spinnerShow=false;
          if(item){
            for(var i=0;i<item.length;i++){
              this.Product.push(item[i]);
              this.total++;
          }
        }
      })
    )
    .subscribe();
  }
  LoadMore(){
    this.page++;
    this.FetchFilter();
  }

  ProductAddedToCart!:Cart[];

  AddToCart(P:Products){
    this.ProductAddedToCart=this.cartService.getProductFromCart();
    if(this.ProductAddedToCart==null){
      this.ProductAddedToCart=[];
      this.ProductAddedToCart.push({Product:P,Quantity:1});
      this.cartService.addProductToCart(this.ProductAddedToCart);
    }else{
      let idx=this.ProductAddedToCart.findIndex((e)=>{
        return e.Product.Code==P.Code;
      });
      if(idx==-1){
        this.ProductAddedToCart.push({Product:P,Quantity:1});
        this.cartService.addProductToCart(this.ProductAddedToCart);
      }
    }
  }
  checkRole(){
    return localStorage.getItem('Role')=='Admin';
  }
  panelOpenState = false;
}
