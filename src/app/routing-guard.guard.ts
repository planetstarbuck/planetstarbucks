import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate,
  Route, Router, RouterStateSnapshot, UrlTree
} from '@angular/router';
import { TokenStorageService } from './token-storage.service';


@Injectable({
  providedIn: 'root'
})
export class RoutingGuardGuard 

implements CanActivate {
  constructor(private tokenStorage: TokenStorageService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): true|UrlTree {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  /* . . . */

  checkLogin(url: string): true|UrlTree {
    if (this.tokenStorage.getToken()) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.tokenStorage.redirectUrl = url;

    // Redirect to the login page
     return this.router.parseUrl('/login'); // <-- (PREVIOUS WAY OF WORKING, NOT SKIPPING LOCATION CHANGE)
    // this.router.navigateByUrl('/login', {skipLocationChange: true});
    // return true;
  }
}



