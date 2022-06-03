import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './AddProduct/add-product.component';
import { DashboardComponent } from './DashBoard/dashboard.component';
import { LoginUserComponent } from './LoginUser/login-user.component';
import { MyCartComponent } from './MyCart/my-cart.component';
import { PageNotFoundComponent } from './PageNotFound/page-not-found.component';
import { ProductComponent } from './Product/product.component';


const routes: Routes = [
  { path : '', component : DashboardComponent},
  { path : 'dashboard', component:DashboardComponent},
  { path : 'products' ,component : ProductComponent},
  { path : 'products/create', component: AddProductComponent},
  { path : 'mycart',component : MyCartComponent },
  { path:'login',component:LoginUserComponent},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
