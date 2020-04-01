import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory, IProduct, ICartItem, ICart } from '../common/interfaces/product';
import { AngularFireDatabase } from '@angular/fire/database';
import { DB_COLLECTIONS } from '../common/constants/db-collections';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCartId() {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      const result = await this.createCart();
      cartId = result.key;
      localStorage.setItem('cartId', result.key);
    }
    return cartId;
  }

  createCart() {
    return this.db.list(DB_COLLECTIONS.shoppingCarts).push({
      createdDate: new Date().getTime(),
    });
  }

  getCart(id: string) {
    const url = `${DB_COLLECTIONS.shoppingCarts}/${id}`;
    return this.db.object(url).valueChanges();
  }

  getCartItem(cartId: string, productId: string) {
    const url = `${DB_COLLECTIONS.shoppingCarts}/${cartId}/items/${productId}`;
    return this.db.object(url);
  }

  updateCart(product: IProduct, cartId: string, quantity) {
    const productCart = this.getCartItem(cartId, product.id);
    let cartItem: ICartItem = null;
    if (quantity) {
      cartItem = { product, quantity };
    }
    productCart.set(cartItem);
  }

  clearShoppingCart(cartId: string) {
    const url = `${DB_COLLECTIONS.shoppingCarts}/${cartId}`;
    this.db.object(url).set({ items: null });
  }

  getProductCategories(): Observable<ICategory[]> {
    return this.db.list(DB_COLLECTIONS.productCategories).snapshotChanges().pipe(
      map(items => {
        return items.map(x => {
          return {
            id: x.key,
            subCategories: x.payload.val(),
          } as ICategory;
        });
      }),
    );
  }

  getTotalItems(cart: ICart) {
    let totalItems = 0;
    if (!cart || !cart.items) {
      return totalItems;
    }
    const products = Object.values(cart.items);
    products.map(x => {
      totalItems += x.quantity;
    });
    return totalItems;
  }

  getTotalAmount(cart: ICart) {
    let totalAmount = 0;
    if (!cart || !cart.items) {
      return totalAmount;
    }
    const products = Object.values(cart.items);
    products.map(x => {
      totalAmount += (x.quantity * x.product.price);
    });
    return totalAmount;
  }
}
