import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { Subscription } from 'rxjs';
import { ICart, IOrder, ICartItem } from '../common/interfaces/product';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { IUser } from '../common/interfaces/user';


@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, OnDestroy {

  checkoutForm: FormGroup;
  subscriptions: Subscription[] = [];
  cart: ICart;
  cartItems: ICartItem[] = [];
  user: IUser;
  cartId: string;
  totalAmount = 0;
  totalItems = 0;
  pay:boolean;

  elements: Elements;
  card: StripeElement;
 
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'es'
  };
 
  stripeTest: FormGroup;

  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private authService: AuthService,
    private fb: FormBuilder,
    private stripeService: StripeService,
  ) { }

  ngOnInit() {
    this.getLoggedInUser();
    this.getCart();
    this.initializeForm();
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#CFD7E0'
                }
              }
            }
          });
          this.card.mount('#card-element');
        }
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe);
  }

  getLoggedInUser() {
    this.user = this.authService.getLoggedInUser();
  }

  async getCart() {
    this.cartId = await this.shoppingCartService.getCartId();
    this.subscriptions.push(
      this.shoppingCartService
        .getCart(this.cartId)
        .subscribe((cart: ICart) => {
          this.cart = cart;
          if (this.cart && this.cart.items) {
            this.cartItems = Object.values(this.cart.items);
            this.totalAmount = this.shoppingCartService.getTotalAmount(this.cart);
            this.totalItems = this.shoppingCartService.getTotalItems(this.cart);
          }
        })
    );
  }

  initializeForm() {
    this.checkoutForm = new FormGroup({
      name: new FormControl('', [ Validators.required ]),
      address: new FormControl('', [ Validators.required ]),
      city: new FormControl('', [ Validators.required ]),
      phone: new FormControl('', [ Validators.required ]),
    });
  }

  onSubmit() {
    if (!this.getLoggedInUser) {
      this.router.navigate(['/login'], { queryParams: {returnUrl: '/check-out'}});
      return;
    }
    const order: IOrder = this.checkoutForm.value;
    order.items = this.cartItems;
    order.amount = this.totalAmount;
    order.isComplete = false;
    order.userId = this.user.id;
    order.datePlaced = new Date().toISOString();
    if(this.pay === true){
      order.payOnDelievery = true;
    }
    else{
      order.payOnDelievery = false;
    }
    this.orderService.createOrder(order).then(() => {
      this.shoppingCartService.clearShoppingCart(this.cartId);
      this.router.navigate(['']);
      alert('Order has been placed successfully!');
      
    });
  }

  buy() {
    const name = this.checkoutForm.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          this.authService.processPayment(result.token,this.totalAmount);
          alert('Payment has been made successfully!');
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  toggleVisibility(e){
    if(e.target.checked){
      this.pay = true;
    }
    else{
      this.pay = false;
    }
  }




  // Floating labels
  // inputs = document.querySelectorAll('.cell.example.example2 .input');
  // inputs.prototype.forEach.call(function(input) {
  //   input.addEventListener('focus', function() {
  //     input.classList.add('focused');
  //   });
  //   input.addEventListener('blur', function() {
  //     input.classList.remove('focused');
  //   });
  //   input.addEventListener('keyup', function() {
  //     if (input.value.length === 0) {
  //       input.classList.add('empty');
  //     } else {
  //       input.classList.remove('empty');
  //     }
  //   });
  // });

  //  elementStyles = {
  //   base: {
  //     color: '#32325D',
  //     fontWeight: 500,
  //     fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
  //     fontSize: '16px',
  //     fontSmoothing: 'antialiased',

  //     '::placeholder': {
  //       color: '#CFD7DF',
  //     },
  //     ':-webkit-autofill': {
  //       color: '#e39f48',
  //     },
  //   },
  //   invalid: {
  //     color: '#E25950',

  //     '::placeholder': {
  //       color: '#FFCCA5',
  //     },
  //   },
  // };

  // elementClasses = {
  //   focus: 'focused',
  //   empty: 'empty',
  //   invalid: 'invalid',
  // };

  // cardNumber = this.elements.create('cardNumber', {
  //   style: this.elementStyles,
  //   // classes: elementClasses,
  // });
  // // cardNumber.mount('#example2-card-number');

  // cardExpiry = this.elements.create('cardExpiry', {
  //   style: this.elementStyles,
  //   // classes: elementClasses,
  // });
  // // cardExpiry.mount('#example2-card-expiry');

  // cardCvc = this.elements.create('cardCvc', {
  //   style: this.elementStyles,
  //   // classes: elementClasses,
  // });
  // // cardCvc.mount('#example2-card-cvc');



}
