
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'https://api.listdropper.com/authentication/';
 //const AUTH_API = 'http://192.168.86.28:5050/authentication/';

const pushtoken = "testvalue" 

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string, pushtoken: string): Observable<any> {
    return this.http.post(AUTH_API + 'login/', {
      username,
      password,
      pushtoken
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup/', {
      username,
      email,
      password
    }, httpOptions);
  }
}
