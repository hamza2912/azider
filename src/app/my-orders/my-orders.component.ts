import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IOrder } from '../common/interfaces/product';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { IUser } from '../common/interfaces/user';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  orders: IOrder[];
  user: IUser;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getLoggedInUser();
    this.getOrders();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe);
  }

  getLoggedInUser() {
    this.user = this.authService.getLoggedInUser();
  }

  getOrders() {
    this.subscriptions.push(
      this.orderService.getAllOrders().subscribe(orders => {
        this.orders = orders.filter(x => x.userId === this.user.id);
      })
    );
  }

  markOrderComplete(order: IOrder) {
    order.isComplete = true;
    this.orderService.updateProduct(order, order.id);
  }
}
