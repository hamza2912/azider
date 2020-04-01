import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md'
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { LoginComponent } from './login/login.component';
import { environment } from 'src/environments/environment';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { HomeComponent } from './home/home/home.component';
import { ShopComponent } from './shop/shop/shop.component';
import { ProductViewComponent } from './product-view/product-view/product-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductsComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    LoginComponent,
    ProductFormComponent,
    ProductCardComponent,
    HomeComponent,
    ShopComponent,
    ProductViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'Mediwod'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    MDBBootstrapModule.forRoot(),
    CarouselModule,
    WavesModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
