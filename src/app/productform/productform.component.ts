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
  ngOnInit(): void {
    if(!this.blockRoute()) this.createFromGroup('','','','','','','');
    else {
        this.productservice.get(this.formCode).subscribe((data)=>{
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
      Image:new FormControl('',[Validators.required])
    })
  }

  blockRoute(){
    return !(this.router.url==='/products/create');
  }

  selectedFile:File=null!;
  onFileSelected(event:any){
    this.selectedFile=event.target.files[0];
  }

  formdata:FormData=null!;
  getFormData():FormData{
    const formdata=new FormData();
    formdata.append('Name',this.AddProductForm.value.Name);
    formdata.append('Code',this.AddProductForm.value.Code);
    formdata.append('Price',this.AddProductForm.value.Price);
    formdata.append('Origin',this.AddProductForm.value.Origin);
    formdata.append('Category',this.AddProductForm.value.Category);
    formdata.append('Description',this.AddProductForm.value.Description);
    if(this.selectedFile!=null)
    formdata.append('Image',this.selectedFile);
    return formdata;
  }

  onUpload(){
    this.formdata=this.getFormData();
    if(this.formdata.has('Image')){
      this.productservice.AddProduct(this.formdata).subscribe((data)=>{
        this.Errormessage=data.massage;
        this.errorShow=true;
        setTimeout(() => {
          this.errorShow=false;
        }, 5000);
      })
    }else{
      this.productservice.UpdateProduct(this.AddProductForm.value).subscribe((data)=>{
        if(data.Status){
          this.productservice.notifyProduct();
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
