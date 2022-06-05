import { Component, Input, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../Services/product.service';
@Component({
  selector: 'app-productform',
  templateUrl: './productform.component.html',
  styleUrls: ['./productform.component.css']
})
export class ProductformComponent implements OnInit {

  @Input() formCode:string='';
  constructor(private productservice:ProductService,public router:Router) { 
  }
  

  AddProductForm:FormGroup={} as any;
  spinnerShow:boolean=true;
  spinner:boolean=false;
  ngOnInit(): void {
    if(!this.blockRoute()){
      this.spinnerShow=false;
      this.createFromGroup('','','','','','','');
    }
    else {
        this.productservice.get(this.formCode).subscribe((data)=>{
          this.spinnerShow=false;
          this.createFromGroup(data.Name,data.Code,data.Price,data.ImageUrl,data.Origin,data.Category,data.Description);
        })
        this.createFromGroup('','','','','','','');
    }
  }

  createFromGroup(Name:string,Code:string,Price:any,ImageUrl:string,Origin:string,Category:string,Description:string){
    this.AddProductForm=new FormGroup({
      Name : new FormControl(Name,[Validators.required]),
      Code : new FormControl(Code,[Validators.required]),
      Price : new FormControl(Price,[Validators.required,Validators.pattern(/^[0-9]\d*$/)]),
      Origin : new FormControl(Origin,[Validators.required]),
      Category : new FormControl(Category,[Validators.required]),
      Description : new FormControl(Description),
      ImageUrl:new FormControl(ImageUrl,[Validators.required])
    })
  }

  blockRoute(){
    return !(this.router.url==='/products/create');
  }

  add:boolean=false;

  onUpload(){
    this.spinner=true;
    if(this.add){
      this.AddProductForm.value.Code=this.AddProductForm.value.Code.replace(/\s+/g, '-');
      this.productservice.AddProduct(this.AddProductForm.value).subscribe((data)=>{
        this.spinner=false;
        this.Errormessage=data.massage;
        this.errorShow=true;
        setTimeout(() => {
          this.errorShow=false;
        }, 5000);
      })
    }else{
      this.productservice.UpdateProduct(this.AddProductForm.value).subscribe((data)=>{
        this.spinner=false;
        if(data.Status){
          this.productservice.notifyProduct();
          this.productservice.notice(this.AddProductForm.value.Code);
        }
        this.Errormessage=data.Message;
        this.errorShow=true;
        setTimeout(() => {
          this.errorShow=false;
        }, 5000);
      })
    }
  }

errorShow:boolean=true;
Errormessage:string='';

}
