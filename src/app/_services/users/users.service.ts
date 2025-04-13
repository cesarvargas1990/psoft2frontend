import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from '../../_services/auth.service'

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class UsersService {

private server: string = environment.API_URL;

  private services =
    {
      cobradores: this.server + '/cobradores',
    };


  httpOpts: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json', 'Accept': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    })
  };
  
  constructor(
  private http: HttpClient,
    private authService: AuthService
	) { }
	
	getUsers() { 
	let id_user = localStorage.getItem('id');
    return this.http.get(`${this.services.cobradores}`+'/'+id_user, this.httpOpts)
  }
}
