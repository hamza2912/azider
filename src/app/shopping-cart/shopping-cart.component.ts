import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICart, ICartItem } from '../common/interfaces/product';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IUser } from '../common/interfaces/user';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cart: ICart;
  user: IUser;
  totalItems = 0;
  subscriptions: Subscription[] = [];
  cartId: string;
  cartItems: ICartItem[] = [];
  totalAmount = 0;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getCart();
    this.getLoggedInUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe);
  }

  getLoggedInUser() {
    this.user = this.authService.getLoggedInUser();
  }

  async getCart() {
    this.cartId = await this.shoppingCartService.getCartId();
    this.subscriptions.push(
      this.shoppingCartService
        .getCart(this.cartId)
        .subscribe((cart: ICart) => {
          this.cart = cart;
          if (cart && cart.items) {
            this.cartItems = Object.values(cart.items);
            this.totalItems = this.shoppingCartService.getTotalItems(cart);
            this.totalAmount = this.shoppingCartService.getTotalAmount(cart);
          } else {
            this.cartItems = [];
            this.totalAmount = 0;
            this.totalItems = 0;
          }
        })
        );
  }

  async addToCart(item: ICartItem) {
    item.quantity += 1;
    this.shoppingCartService.updateCart(item.product, this.cartId, item.quantity);
  }

  async subFromCart(item: ICartItem) {
    if (!item.quantity) {
      return;
    }
    item.quantity -= 1;
    this.shoppingCartService.updateCart(item.product, this.cartId, item.quantity);
  }

  clearShoppingCart() {
    if (confirm('Are you sure you want to clea shopping cart?')) {
      this.shoppingCartService.clearShoppingCart(this.cartId);
    }
  }

  checkout() {
    if (this.user) {
      this.router.navigate(['/check-out']);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/check-out '}});
    }
  }

}
