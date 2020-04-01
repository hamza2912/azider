import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { IProduct } from 'src/app/common/interfaces/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  subscriptions: Subscription[] = [];
 

  constructor(
    private productsService: ProductsService,
  ) { }

  ngOnInit() {
    this.getAllProducts();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe);
  }

  getAllProducts() {
    this.subscriptions.push(
      this.productsService.getAllProducts().subscribe(products => {
        this.filteredProducts = this.products = products;
      })
    );
  }

  
  filter(text) {
    this.filteredProducts = this.products.filter(x =>
      x.title.toLowerCase().indexOf(text.toLowerCase()) !== -1);
  }

  deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(id);
    }
  }
}
