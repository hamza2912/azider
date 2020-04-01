import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { HomeComponent } from './home/home/home.component';
import { ShopComponent } from './shop/shop/shop.component';
import { ProductViewComponent } from './product-view/product-view/product-view.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'product', component: ProductsComponent},
  {path: 'product/view/:id', component: ProductViewComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'login', component: LoginComponent},
  {path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard]},
  {path: 'my/orders', component: MyOrdersComponent, canActivate: [AuthGuard]},
  {path: 'order-success', component: OrderSuccessComponent, canActivate: [AuthGuard]},
  {path: 'admin/products/new', component: ProductFormComponent, canActivate: [AuthGuard]},
  {path: 'admin/products/:id', component: ProductFormComponent, canActivate: [AuthGuard]},
  {path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard]},
  {path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
