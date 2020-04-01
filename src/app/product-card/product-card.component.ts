import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IProduct, ICart } from '../common/interfaces/product';
import { ShoppingCartService } from '../services/shopping-cart.service';


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit,OnChanges {
  @Input() product: IProduct;
  @Input() cart: ICart;
  cartId: string;
  quantity = 0;
  IsSale: boolean = false;
  true : string = 'true';
  sale : string;

  constructor(
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(){
    if(this.sale = this.product.sale){
    this.IsSale = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.cart.currentValue !== changes.cart.previousValue &&
      this.cart && this.cart.items &&
      this.cart.items[this.product.id]
    ) {
      this.quantity = this.cart.items[this.product.id].quantity;
    }
  }

  async addToCart(product: IProduct) {
    this.quantity += 1;
    if (!this.cartId) {
      this.cartId = await this.shoppingCartService.getCartId();
    }
    this.shoppingCartService.updateCart(product, this.cartId, this.quantity);
  }

  async subFromCart(product: IProduct) {
    if (!this.quantity) {
      return;
    }
    this.quantity -= 1;
    if (!this.cartId) {
      this.cartId = await this.shoppingCartService.getCartId();
    }
    this.shoppingCartService.updateCart(product, this.cartId, this.quantity);
  }
}
