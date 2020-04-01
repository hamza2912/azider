import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { IProduct, ICategory, ICart } from 'src/app/common/interfaces/product';
import { Subscription } from 'rxjs';
import * as AOS from 'aos';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {


  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  searchProducts: IProduct[] = [];
  subscriptions: Subscription[] = [];
  allCategory: ICategory = {
    id: 'All categories', isActive: false,
  };
  categories: ICategory[] = [this.allCategory];
  cart: ICart;
  zero:number = 0;


  constructor(private productsService: ProductsService,) { }

  ngOnInit() {
    this.getAllProducts();
    this.getCategories();
    AOS.init();
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe);
  }

  getAllProducts() {
    this.subscriptions.push(
      this.productsService.getAllProducts().subscribe(products => {
        this.filteredProducts = this.products = products;
        let subcategory = localStorage.getItem('subcategory');
        if(subcategory){
        this.filteredProducts = this.products.filter(x => JSON.stringify(x.subcategory) === subcategory);
       }
        else {
          this.filteredProducts = this.products;
        }
      })
    );
  }

  getCategories() {
    this.subscriptions.push(
      this.productsService.getProductCategories().subscribe(categories => {
        this.categories = [this.allCategory, ...categories];
        // this.categories = categories;
      })
    );
  }


  filter(text) {
    this.filteredProducts = this.products.filter(x =>
      x.title.toLowerCase().indexOf(text.toLowerCase()) !== -1);
  }

  filterCategory(category?: ICategory, subcategory?:string) {
    this.categories.map(x => {
      x.isActive = false;
      return x;
    });
    category.isActive = true;
    if (category.id==='All categories') {
      this.filteredProducts = this.products;
    } else if(subcategory) {
      this.filteredProducts = this.products.filter(x => x.category === category.id && x.subcategory === subcategory);
    }
    else {
      this.filteredProducts = this.products.filter(x => x.category === category.id);
    }
  }

}
