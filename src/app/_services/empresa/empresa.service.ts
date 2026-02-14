import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from '../../_services/auth.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private readonly server: string = environment.API_URL;

  private readonly services = {
    psempresa: this.server + '/psempresa',
    guardarArchivos: this.server + '/guardarArchivoAdjunto'
  };

  httpOpts: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    })
  };

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      alert('An error occurred:' + error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
          `body was: ${error.error.error}`
      );
      console.log(error);
      if (error.error.message == 'Unauthorized') {
        Swal.fire({
          type: 'error',
          title: 'Error al iniciar',
          text: 'Verifique usuario o password'
        });
      }
    }
    // return an observable with a user-facing error message
    return throwError(
      'Error en la respuesta del servidor (verifique conexion a internet).'
    );
  }

  getEmpresa(): Observable<any> {
    const id_empresa = localStorage.getItem('id_empresa');
    return this.http
      .get<any>(`${this.services.psempresa}` + '/' + id_empresa, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  actualizarDatosEmpresa(data: any): Observable<any> {
    const id_empresa = localStorage.getItem('id_empresa');
    return this.http
      .put<any>(
        `${this.services.psempresa}` + '/' + id_empresa,
        data,
        this.httpOpts
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  subirArchivoFirma(data: any): Observable<any> {
    data.id_empresa = localStorage.getItem('id_empresa');
    data.id_usuario = localStorage.getItem('id');
    return this.http
      .post<any>(`${this.services.guardarArchivos}`, data, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }
}
