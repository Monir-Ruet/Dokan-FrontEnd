import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup ,FormBuilder,FormArray} from '@angular/forms';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  ngOnInit(): void {
    
  }
  form: FormGroup;
  products: Array<any> = ['Laptop','Desktop','Mobile','Printer','Router','Monitor'];

  constructor(fb: FormBuilder,private Product:ProductService) {
    this.form = fb.group({
     selectedCategory:  new FormArray([]),
     fromPrice:new FormControl(),
     toPrice:new FormControl()
    });
  }
  onChange(event:any){
    const selectedCategory = (this.form.controls['selectedCategory'] as FormArray);
    if (event.target.checked) {
      selectedCategory.push(new FormControl({Category:event.target.value}));
    } else {
      const index = selectedCategory.controls
      .findIndex((x) => {
        return x.value.Category === event.target.value
      });
      selectedCategory.removeAt(index);
    }
  }
  submit() {
    this.Product.filterObject=this.form.value;
    this.Product.filter.next(true)
  }
}

