import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from '../../_services/auth.service'
import { Observable, throwError } from 'rxjs';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class ClienteService {


  private server: string = environment.API_URL;

  private services =
    {
      psclientes: this.server + '/psclientes',
      listadoclientes: this.server + '/listadoclientes'
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

  getAllClientes(): Observable<any> {
    return this.http.get(`${this.services.psclientes}`, this.httpOpts)
  }

  getClientes(): Observable<any> {
    let nitempresa = localStorage.getItem('nit_empresa');
    return this.http.get(`${this.services.listadoclientes}`+'/'+nitempresa, this.httpOpts)
  }

  updateCliente(data): Observable<any> {
    return this.http.put(`${this.services.psclientes}` + '/' + data.id, data, this.httpOpts)
  }

  deleteCliente(data): Observable<any> {
    return this.http.delete(`${this.services.psclientes}` + '/' + data.id, this.httpOpts)
  }

  saveCliente(data): Observable<any> {
    data.nitempresa = localStorage.getItem('nit_empresa');
    data.id_user = localStorage.getItem('id');
    return this.http.post(`${this.services.psclientes}`, data, this.httpOpts)
  }
}
