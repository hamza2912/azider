import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from '../common/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  loggedInUser: IUser;
  loading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loggedInUser = this.authService.getLoggedInUser();
    if (!this.loggedInUser) {
      this.afterLogin();
    } else {
      this.router.navigate(['']);
    }
  }

  afterLogin() {
    this.authService.afterLogin().then(response => {
      if (response.user) {
        const user: IUser = {
          id: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
        };
        localStorage.setItem('user', JSON.stringify(user));
        this.loggedInUser = user;
        this.router.navigate(['']);
        window.location.reload();
      }
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  loginWithGoogle() {
    this.authService.login();
  }

}
