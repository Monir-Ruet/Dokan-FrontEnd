import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css'],
})
export class LoginUserComponent implements OnInit,OnDestroy {

  validLogin:boolean=true;
  //SignIn

  SignInMessageShown:boolean=false;
  SignInMessage:String='';
  // SignUp 
  SignUpMessageShown:boolean=false;
  SignUpMessage:String='';
  SignUpSuccess:boolean=false;
  constructor(private loginService:UserService,private modalService: NgbModal,private router:Router) {}

  ngOnInit(): void {
  }
  // Database Model
  Credential=new FormGroup({
    username:new FormControl(''),
    password:new FormControl(''),
    remember:new FormControl(false)
  })

  NewUser=new FormGroup({
    fullname:new FormControl(''),
    username:new FormControl(''),
    password:new FormControl(''),
    phone:new FormControl(''),
    email:new FormControl(''),
    gender:new FormControl(''),

  })

  // SignIn

  // Show is login credentail valid or not
  isValidLogin():boolean{
    return this.validLogin;
  }

  spinnerShow:boolean=false;
  // Login to account
  subscription:any=null!;
  login(){
    this.spinnerShow=true;
    this.subscription=this.loginService.Login(this.Credential.value).subscribe(result=>{
      this.spinnerShow=false;
      if(!result.LoggedIn){
        this.SignInMessageShown=true;
        this.SignInMessage=result.Message;
      }
      else{
        this.SignInMessageShown=false;
        localStorage.setItem('Token',result.Token);
        localStorage.setItem('Role',result.Role);
        this.loginService.LoggedUser();
        this.router.navigate(['/dashboard']);
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  // Open Modal form
  open(content:any) {
    this.SignUpMessage='';
    this.SignUpMessageShown=false;
    this.SignUpSuccess=false;
    this.modalService.open(content, {centered:true});
  }

  // SignUp
  
  // Signup new user
  Signup(){
    this.loginService.SignUp(this.NewUser.value).subscribe((result:any)=>{
      this.SignUpMessageShown=true;
      this.SignUpSuccess=result.Success;
      this.SignUpMessage=result.Massage;
    })
  }

}
