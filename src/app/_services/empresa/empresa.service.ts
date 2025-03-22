
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from '../../_services/auth.service'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
	
	private server: string = environment.API_URL;
	
	private services =
    {
      psempresa:this.server + '/psempresa',
      

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
  
  
  getEmpresa () : Observable<any> {
    
    let id_empresa = localStorage.getItem('id_empresa');
    return this.http.get<any>(`${this.services.psempresa  }`+'/'+id_empresa, this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  actualizarDatosEmpresa (data:any) : Observable<any> {
    
    let id_empresa = localStorage.getItem('id_empresa');
    return this.http.put<any>(`${this.services.psempresa  }`+'/'+id_empresa, data,this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }
}
