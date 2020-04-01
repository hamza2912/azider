import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ICategory, IProduct } from '../common/interfaces/product';
import { DB_COLLECTIONS } from '../common/constants/db-collections';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private db: AngularFireDatabase) { }

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

  getAllProducts(): Observable<IProduct[]> {
    return this.db.list(DB_COLLECTIONS.products).snapshotChanges().pipe(
      map(items => {
        return items.map(x => {
          const product: IProduct = x.payload.val() as IProduct;
          product.id = x.key;
          return product;
        });
      }),
    );
  }

  getProduct(id: string) {
    const url = `${DB_COLLECTIONS.products}/${id}`;
    return this.db.object(url).valueChanges();
  }

  createProduct(product: IProduct) {
    return this.db.list(DB_COLLECTIONS.products).push(product);
  }

  addProductToCart(product: IProduct) {
    return this.db.list(DB_COLLECTIONS.products).push(product);
  }

  updateProduct(product: IProduct, id: string) {
    const url = `${DB_COLLECTIONS.products}/${id}`;
    return this.db.object(url).update(product);
  }

  deleteProduct(id: string) {
    const url = `${DB_COLLECTIONS.products}/${id}`;
    return this.db.object(url).remove();
  }
}
