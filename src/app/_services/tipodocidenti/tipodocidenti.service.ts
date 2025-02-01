import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from '../../_services/auth.service'
import { Observable, throwError } from 'rxjs';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class TipodocidentiService {
private server: string = environment.API_URL;

  private services =
    {
      pstipodocidenti: this.server + '/pstipodocidenti',
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
	
	getAllTipodocidenti(): Observable<any> {
    return this.http.get(`${this.services.pstipodocidenti}`, this.httpOpts)
  }
  
  getTipodocidenti(): Observable<any> { 
	
    return this.http.get(`${this.services.pstipodocidenti}`, this.httpOpts)
  }
}
