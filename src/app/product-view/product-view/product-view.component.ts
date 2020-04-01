import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../common/interfaces/product';
import { ProductsService } from '../../services/products.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Subscription } from '../../../../node_modules/rxjs';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  product: IProduct;
  prodId: string;
  productForm: FormGroup;
  subscriptions: Subscription[] = [];
  cartId: string;
  quantity = 0;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.prodId = this.activatedRoute.snapshot.params.id;
    if (this.prodId) {
      this.getProduct();
    }
   
  }

  getProduct(){
    this.subscriptions.push(
      this.productsService.getProduct(this.prodId)
        .subscribe((product: IProduct) => {
            this.product = product;
        })
      );
    }
    
    initializeForm() {
      this.productForm = new FormGroup({
        sizes: new FormControl(''),
        colors: new FormControl(''),
      });
    }

    async addToCart(product: IProduct) {
      this.quantity += 1;
      console.log( this.productForm.get('sizes').value);
      product.sizes = this.productForm.get('sizes').value;
      product.colors = this.productForm.get('colors').value;
      console.log(this.product.sizes);

      if (!this.cartId) {
        this.cartId = await this.shoppingCartService.getCartId();
      }
      this.shoppingCartService.updateCart(product, this.cartId, this.quantity);
    }
  

  }
