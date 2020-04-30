import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { LoginResponse } from '../_models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  
  basePath = environment.API_URL;

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
      alert('An error occurred:'+error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.error}`);
console.log (error);
        if (error.error.message == 'Unauthorized') {
          Swal.fire({
            type: 'error',
            title: 'Error al iniciar',
            text: 'Verifique usuario o password', 
          })
        }
        
    }
    // return an observable with a user-facing error message
    return throwError(
      'Error en la respuesta del servidor (verifique conexion a internet).');
  }
 
 
  // Verify user credentials on server to get token
  loginForm(data): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.basePath +'/auth/login', data, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
 
  // After login save token and other values(if any) in localStorage
  setUser(resp: LoginResponse) {
    localStorage.setItem('name', resp.name);
    localStorage.setItem('access_token', resp.access_token);
    localStorage.setItem('menu_usuario', JSON.stringify(resp.menu_usuario));
    localStorage.setItem('id', JSON.stringify(resp.id));
    localStorage.setItem('id_usuario', JSON.stringify(resp.id));
    localStorage.setItem('nit_empresa', resp.nit_empresa);
    localStorage.setItem('ind_activo',JSON.stringify(resp.ind_activo))
    localStorage.setItem('is_admin', JSON.stringify(resp.is_admin));
    localStorage.setItem('id_user', JSON.stringify(resp.id_user)); // Corresponde al cobrador al cual pertenece este usuario
    this.router.navigate(['/dashboard']); 
  } 
  
  // Checking if token is set
  isLoggedIn() {
    return localStorage.getItem('access_token') != null;
  }
 
  // After clearing localStorage redirect to login screen
  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
 
 
  // Get data from server 
  getData(data): Observable<LoginResponse> {

      let httpOptionsAuth = { 
      headers: new HttpHeaders({
         'Content-Type': 'application/json', 
         'Authorization' : 'Bearer '+localStorage.getItem('access_token')

      })  
    };
    return this.http
      .post<LoginResponse>(this.basePath + data.action, data, httpOptionsAuth)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getDataAny(data): Observable<any> {

    let httpOptionsAuth = { 
    headers: new HttpHeaders({
       'Content-Type': 'application/json', 
       'Authorization' : 'Bearer '+localStorage.getItem('access_token')

    })  
  };
  return this.http
    .post<any>(this.basePath + data.action, data, httpOptionsAuth)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
}
 
}