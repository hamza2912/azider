import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICart, IOrder, ICartItem } from '../common/interfaces/product';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { IUser } from '../common/interfaces/user';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup;
  subscriptions: Subscription[] = [];
  cart: ICart;
  cartItems: ICartItem[] = [];
  user: IUser;
  cartId: string;
  totalAmount = 0;
  totalItems = 0;

  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getLoggedInUser();
    this.getCart();
    this.initializeForm();
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
          if (this.cart && this.cart.items) {
            this.cartItems = Object.values(this.cart.items);
            this.totalAmount = this.shoppingCartService.getTotalAmount(this.cart);
            this.totalItems = this.shoppingCartService.getTotalItems(this.cart);
          }
        })
    );
  }

  initializeForm() {
    this.checkoutForm = new FormGroup({
      name: new FormControl('', [ Validators.required ]),
      address: new FormControl('', [ Validators.required ]),
      city: new FormControl('', [ Validators.required ]),
      phone: new FormControl('', [ Validators.required ]),
    });
  }

  onSubmit() {
    if (!this.getLoggedInUser) {
      this.router.navigate(['/login'], { queryParams: {returnUrl: '/check-out'}});
      return;
    }
    const order: IOrder = this.checkoutForm.value;
    order.items = this.cartItems;
    order.amount = this.totalAmount;
    order.isComplete = false;
    order.userId = this.user.id;
    order.datePlaced = new Date().toISOString();
    this.orderService.createOrder(order).then(() => {
      this.shoppingCartService.clearShoppingCart(this.cartId);
      this.router.navigate(['']);
      alert('Order has been placed successfully!');
      
    });
  }

}
