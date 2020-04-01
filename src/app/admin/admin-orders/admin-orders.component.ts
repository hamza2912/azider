import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { IOrder } from 'src/app/common/interfaces/product';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  orders: IOrder[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getOrders();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe);
  }

  getOrders() {
    this.subscriptions.push(
      this.orderService.getAllOrders().subscribe(orders => {
        this.orders = orders;
      })
    );
  }

  markOrderComplete(order: IOrder) {
    order.isComplete = true;
    this.orderService.updateProduct(order, order.id);
  }
}
