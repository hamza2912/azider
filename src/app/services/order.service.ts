import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { IOrder } from '../common/interfaces/product';
import { DB_COLLECTIONS } from '../common/constants/db-collections';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private db: AngularFireDatabase) { }

  getAllOrders(): Observable<IOrder[]> {
    return this.db.list(DB_COLLECTIONS.orders).snapshotChanges().pipe(
      map(items => {
        return items.map(x => {
          const order: IOrder = x.payload.val() as IOrder;
          order.id = x.key;
          return order;
        });
      }),
    );
  }

  getOrder(id: string) {
    const url = `${DB_COLLECTIONS.orders}/${id}`;
    return this.db.object(url).valueChanges();
  }

  createOrder(order: IOrder) {
    return this.db.list(DB_COLLECTIONS.orders).push(order);
  }

  updateProduct(order: IOrder, id: string) {
    const url = `${DB_COLLECTIONS.orders}/${id}`;
    return this.db.object(url).update(order);
  }
}
