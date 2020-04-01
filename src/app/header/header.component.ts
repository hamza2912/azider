import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ICart } from '../common/interfaces/product';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { IUser } from '../common/interfaces/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: IUser;
  subscriptions: Subscription[] = [];
  cart: ICart;
  totalItems = 0;
  isAdminUser = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getLoggedInUser();
    this.getFBLoggedInUser();
    this.getCart();
    this.getAdminUsers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getLoggedInUser() {
    this.user = this.authService.getLoggedInUser();

  }

  getFBLoggedInUser() {
    this.subscriptions.push(this.authService.getFireBaseLoggedInUser().subscribe(user => {
      this.getLoggedInUser();
    }));
  }

  getAdminUsers() {
    this.subscriptions.push(this.userService.getAdminUsers().subscribe(users => {
      const adminUsers = Object.values(users.payload.val());
      if( adminUsers){
      if (this.user && adminUsers.indexOf(this.user.id) > -1) {
        this.isAdminUser = true;
      }
    }
    }));
  }

  async getCart() {
    const cartId = await this.shoppingCartService.getCartId();
    this.subscriptions.push(
      this.shoppingCartService
        .getCart(cartId)
        .subscribe((cart: ICart) => {
          this.cart = cart;
          this.totalItems = this.shoppingCartService.getTotalItems(cart);
        })
    );
  }

  logout() {
    this.authService.logout();
    this.user = null;
    localStorage.removeItem('user');
    // localStorage.removeItem('cartId');
    this.router.navigate(['login']);
  }

}
