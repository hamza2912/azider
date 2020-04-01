import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(route, state: RouterStateSnapshot) {
    const user = this.authService.getLoggedInUser();
    if (user) {
      return true;
    }
    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
