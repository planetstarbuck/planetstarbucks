import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { TokenStorageService } from './token-storage.service';
import { Observable, catchError, throwError} from 'rxjs';
import {  Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.tokenStorageService.getToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authReq).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.tokenStorageService.signOut()
              this.router.navigate(['/login']);
            // redirect user to the login page
         }
         if (err.status === 402) {
          this.tokenStorageService.signOut()
          this.router.navigate(['/register', 'check-mail'])
;
        // redirect user to the login page
     }
      }
      return throwError(() => err);
    }))
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];


