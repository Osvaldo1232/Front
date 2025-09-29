import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, CanActivateChild } from '@angular/router';
import { LoginService } from '../services/login-service';

@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.checkAccess(route);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot): boolean {
    return this.checkAccess(childRoute);
  }

  private checkAccess(route: ActivatedRouteSnapshot): boolean {
    if (this.loginService.isTokenExpired()) {
      this.loginService.logout();
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.loginService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as string[];
    const userRoles = this.loginService.getUserRoles();

    if (requiredRoles && !requiredRoles.some(role => userRoles.includes(role))) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
