import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import * as AOS from 'aos';
import { UserService } from '../../services/user.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { IHome } from '../../common/interfaces/user';
import { ICategory } from '../../common/interfaces/product';
import { ProductsService } from '../../services/products.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  subscriptions: Subscription[] = [];
  NewArrivals = 'New Arrivals';
  None = 'All Categories';
  Accessories = 'Accessories';
  frontCover: string;
  frontText1: string;
  frontText2: string;
  frontText3: string;
  frontText4: string;
  frontCover2: string;
  frontText5: string;
  frontText6: string;
  frontText7: string;
  frontText8: string;
  bottomCover: string;
  bottomText: string;
  categories: ICategory[];


  constructor(
    config: NgbCarouselConfig,
    private userService: UserService,
    private productsService: ProductsService,
    private router: Router,
  ) {
    config.interval = 2000;  
    config.wrap = true;  
    config.keyboard = false;  
    config.pauseOnHover = false;
   }

  ngOnInit() {
    AOS.init();
    this.getHomeConfig();
    this.getCategories();
    localStorage.removeItem('subcategory');
  }

  goToShop(subcategory){
    this.router.navigate(['shop']);
    localStorage.setItem('subcategory', JSON.stringify(subcategory));
  }

  getCategories() {
    this.subscriptions.push(
      this.productsService.getProductCategories().subscribe(categories => {
        this.categories = categories;
      })
    );
  }

  getHomeConfig() {
    this.subscriptions.push(this.userService.getHomePage().subscribe(values => {
        const object : IHome = values.payload.val() as IHome;
          this.frontCover = object.frontCover;
          this.frontCover2 = object.frontCover2;
          this.frontText1 = object.frontText1;
          this.frontText2 = object.frontText2;
          this.frontText3 = object.frontText3;
          this.frontText4 = object.frontText4;
          this.frontText5 = object.frontText5;
          this.frontText6 = object.frontText6;
          this.frontText7 = object.frontText7;
          this.frontText8 = object.frontText8;
          this.bottomCover = object.bottomCover;
          this.bottomText = object.bottomText;
    }));
  }


}
