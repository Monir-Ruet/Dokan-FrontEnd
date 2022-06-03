import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ProductApi,Products } from '../Interfaces/interface';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,FormControl,Validator, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ProductService } from '../Services/product.service';
import { UserService } from '../Services/user.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements AfterViewInit {

  displayedColumns: string[] = ['Name', 'Code','Category','Price','Description','Edit','Delete'];
  exampleDatabase !: ExampleHttpDatabase | null;
  data: Products[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _httpClient: HttpClient,public modalService: NgbModal,public productServie:ProductService,public userService:UserService) {
    this.userService.isLoggedIn.subscribe((data)=>{
      this.isAdmin=this.userService.checkRole();
    })
  }

  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
      this.Merge();
      this.productServie.isUpdated.subscribe((result)=>{
        if(this.isAdmin) this.Merge();
      })
      this.productServie.notify.subscribe((data)=>{
        if(this.isAdmin) this.Merge();
      })
  }
  Merge(){
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }
          this.resultsLength = data.total_count;
          return data.items;
        }),
      )
      .subscribe(data => {
        this.data=data;
      });
  }
  isAdmin:boolean=false;
  AddProductForm=new FormGroup({
    Name : new FormControl('',[Validators.required]),
    Code : new FormControl('',[Validators.required]),
    Price : new FormControl('',[Validators.required]),
    ImageUrl : new FormControl('',[Validators.required]),
    Origin : new FormControl('',[Validators.required]),
    Category : new FormControl('',[Validators.required]),
    Description : new FormControl(''),
  })
  
  formCode:string='';
  edit(a:string){
    this.formCode=a;
  }
  checkRole(){
    return localStorage.getItem('Role')==='Admin';
  }
  delete(a:string){
    if(confirm(`Confirm Delete Product code ${a}?`)){
      this.productServie.Delete(a).subscribe((result)=>{
        if(result.Status) this.Merge();
      })
    }
  }
}



/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getRepoIssues(sort: string, order: SortDirection, page: number): Observable<ProductApi> {
    const requestUrl = `${environment.Api}/products/get?sort=${sort}&order=${order}&page=${page + 1}`;
    return this._httpClient.get<ProductApi>(requestUrl);
  }
}