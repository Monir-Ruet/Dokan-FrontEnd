import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ProductApi,AddProductResponse, Products, UpdateResponse ,DeleteResponse} from '../Interfaces/interface';
import { SortDirection } from '@angular/material/sort';
import { Observable,BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private Http : HttpClient) {}
  private s=new BehaviorSubject<boolean>(false);
  isUpdated= this.s.asObservable();

  AddProduct(data:object){
    const httpOptions = {
      headers: new HttpHeaders().delete('Content-Type')
    };
    return this.Http.post<AddProductResponse>(`${environment.Api}/products/add`,data,httpOptions);
  }

  Fetch(sort: string, order: SortDirection, page: number): Observable<ProductApi> {
    const requestUrl = `${environment.Api}/products/get?sort=${sort}&order=${order}&page=${page + 1}`;
    return this.Http.get<ProductApi>(requestUrl);
  }
  get(name:string):Observable<Products>{
    return this.Http.get<Products>(`${environment.Api}/products/find/${name}`);
  }
  UpdateProduct(data:object){
    return this.Http.put<UpdateResponse>(`${environment.Api}/products/update`,data);
  }
  Delete(data:string){
    return this.Http.delete<DeleteResponse>(`${environment.Api}/products/delete/${data}`);
  }

  NotifyProduct=new BehaviorSubject<boolean>(false);
  notify=this.NotifyProduct.asObservable();
  notifyProduct(){
    this.NotifyProduct.next(true);
  }

  public filter=new BehaviorSubject<boolean>(false);
  isfiltered=this.filter.asObservable();
  filterObject:any={};
  keepfilter(ob:any){
    this.filterObject=ob;
    if(!(this.filterObject==[])) this.filter.next(true);
    else this.filter.next(false)
  }

  FetchFiltered(sort:string,order:SortDirection,page:number):Observable<ProductApi>{
    const requestUrl = `${environment.Api}/products/get?sort=${sort}&order=${order}&page=${page + 1}`;
    return this.Http.post<ProductApi>(requestUrl,this.filterObject);
  }
  resetFilter(){
    this.filterObject={};
  }
}
