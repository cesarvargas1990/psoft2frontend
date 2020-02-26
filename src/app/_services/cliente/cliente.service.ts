import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from '../../_services/auth.service'
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { map } from "rxjs/operators";
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
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

        if (error.error.error == 'Unauthorized') {
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

  private server: string = environment.API_URL;

  private services =
    {
      psclientes: this.server + '/psclientes',
      listadoclientes: this.server + '/listadoclientes',
      guardarArchivos : this.server+ '/guardarArchivoAdjunto'
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

  uploadFile(data): Observable<any> {
    data.nitempresa = localStorage.getItem('nit_empresa');
    data.id_usuario = localStorage.getItem('id');
    return this.http.post(`${this.services.guardarArchivos}`, data, this.httpOpts);
}

 dataURLtoFile(dataurl, filename) {
 
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, {type:mime});
}


}

