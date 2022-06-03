import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { UserInterface,SignInResponse,SignUpResponse } from '../Interfaces/interface';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private UserService : HttpClient) {
    this.LoggedUser();
  }

  //Login 
  Login(data:object){
    return this.UserService.post<SignInResponse>(`${environment.Api}/login`,data);
  }

  // SignUp
  SignUp(data:object){
    return this.UserService.post<SignUpResponse>(`${environment.Api}/signup`,data);
  }

  // User Information
  private s=new BehaviorSubject<boolean>(false);
  isLoggedIn= this.s.asObservable();

  Role:string='user';

  public user=new BehaviorSubject<UserInterface>({
    Fullname:'',
    Username:'',
    Email:'',
    Gender:'',
    Phone:'',
    Role:''
  });

  UserDetails=this.user.asObservable();
  signedIn:boolean=false;

  LoggedUser(){
    this.UserService.get<UserInterface>(`${environment.Api}/loggedUser`).subscribe((result)=>{
      if(result.Fullname) {
        this.Role=result.Role;
        this.user.next(result);
        this.s.next(true);
      }
      else this.s.next(false);
    })
  }
  LogOut(){
    localStorage.removeItem('Token');
    localStorage.removeItem('Role');
    this.Role='user';
    this.s.next(false);
    this.user.next({Fullname:'',Username:'',Email:'',Gender:'',Phone:'',Role:''});
  }
  checkRole(){
    return this.Role==='Admin';
  }
}