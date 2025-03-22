import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { LoginResponse } from '../_models/user';
import { Router } from '@angular/router';
import {NavItem} from '../_models/nav-item';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  // API path
  basePath = 'https://my-site.com/server/';
 
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }
 
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
 
  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
 
 
  // Verify user credentials on server to get token
  loginForm(data): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.basePath , data, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
 
  // After login save token and other values(if any) in localStorage
  setUser(resp: LoginResponse) {
    localStorage.setItem('name', resp.name);
    localStorage.setItem('access_token', resp.access_token);
    localStorage.setItem('id_usuario', resp.id);
    //localStorage.setItem('menu_usuario', JSON.stringify(resp.menu_usuario));
    //localStorage.setItem('menu_usuario', JSON.parse(resp.menu_usuario));
    this.router.navigate(['/dashboard']);
    localStorage.setItem('id_empresa', JSON.stringify(resp.id_empresa));
    localStorage.setItem('is_admin', JSON.stringify(resp.is_admin));
  }
 
  // Checking if token is set
  isLoggedIn() {
    return localStorage.getItem('access_token') != null;
  }
 
  // After clearing localStorage redirect to login screen
  logout() {
    this.router.navigate(['/auth/login']);
  }
 
 
  // Get data from server for Dashboard
  getData(data): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.basePath , data, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
 
}