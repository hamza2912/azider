import { Component, OnInit, OnDestroy, Input, HostListener  } from '@angular/core';
import { IProduct, ICategory, ICart } from '../common/interfaces/product';
import { Subscription } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import * as AOS from 'aos';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  @Input() type: string;
  zero:number = 0;
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  subscriptions: Subscription[] = [];
  showCategory: boolean = true;
  allCategory: ICategory = {
    id: '', subCategories: ['All categories'], isActive: true,
  };
  categories: ICategory[] = [this.allCategory];
  cart: ICart;
  slides: any = [[]];
  CAROUSEL_BREAKPOINT = 768;
  carouselDisplayMode = 'multiple';

  constructor(
    private productsService: ProductsService,
    private shoppingCartService: ShoppingCartService,
    config: NgbCarouselConfig,
  ) { 
    config.interval = 2000;  
    config.wrap = true;  
    config.keyboard = false;  
    config.pauseOnHover = true;
    config.showNavigationArrows = false;
  }

  async ngOnInit() {
    this.getAllProducts(); 
    this.getCart();
    this.getCategories();
    AOS.init();
    if (window.innerWidth <= this.CAROUSEL_BREAKPOINT) {
      this.carouselDisplayMode = 'single';
    } else {
      this.carouselDisplayMode = 'multiple';
    }
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe);
  }


  getCategories() {
    this.subscriptions.push(
      this.productsService.getProductCategories().subscribe(categories => {
        this.categories = [this.allCategory, ...categories];
      })
    );
   }

  async getCart() {
    const cartId = await this.shoppingCartService.getCartId();
    this.subscriptions.push(
      this.shoppingCartService
        .getCart(cartId)
        .subscribe((cart: ICart) => {
          this.cart = cart;
        })
    );
  }

  getAllProducts() {
    if(this.type === 'All Categories'){
        this.subscriptions.push(
          this.productsService.getAllProducts().subscribe(products => {
            this.filteredProducts = this.products = products;
            this.showCategory = false;
            let R = [];
            for (let i = 0, len = this.filteredProducts.length; i < len; i += 3) {
              R.push(this.filteredProducts.slice(i, i + 3));
            }
            this.slides = R;
          })
        );
    }
    // else if(this.type === 'New Arrivals'){
    //   this.subscriptions.push(
    //     this.productsService.getAllProducts().subscribe(products => {
    //       this.filteredProducts = this.products = products.filter(x => x.category === "New Arrivals" );
    //       this.showCategory = false;
    //       let R = [];
    //       for (let i = 0, len = this.filteredProducts.length; i < len; i += 3) {
    //         R.push(this.filteredProducts.slice(i, i + 3));
    //       }
    //       this.slides = R;
    //     })
    //   );
    // }
    else{
      this.subscriptions.push(
        this.productsService.getAllProducts().subscribe(products => {
          this.filteredProducts = this.products = products.filter(x => x.category === this.type);
          this.showCategory = false;
          let R = [];
            for (let i = 0, len = this.filteredProducts.length; i < len; i += 3) {
              R.push(this.filteredProducts.slice(i, i + 3));
            }
            this.slides = R;
        })
      );
    }
  }


  filterCategory(category?: ICategory) {
    this.categories.map(x => {
      x.isActive = false;
      return x;
    });
    category.isActive = true;
    if (!category.id) {
      this.filteredProducts = this.products;
    } else {
      // this.filteredProducts = this.products.filter(x => x.category === category.name);
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (window.innerWidth <= this.CAROUSEL_BREAKPOINT) {
      this.carouselDisplayMode = 'single';
    } else {
      this.carouselDisplayMode = 'multiple';
    }
  }

}
