import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from '../../_services/auth.service'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {


  private server: string = 'https://mipropiedadhorizontal.com.co/api/api';
  //private server: string = 'http://localhost:8080/api';

  private services =
    {
      psformapago:this.server + '/psformapago',
      calcularCuotas: this.server + '/calcularCuotas',
      listaformaspago: this.server + '/listaformaspago',
      listaperiodospago: this.server + '/listaperiodopago',
      guardarPrestamo: this.server + '/guardarPrestamo',
      consultaFormasPago : this.server + '/consultaFormasPago',
      consultaFormaPago : this.server + '/consultaFormaPago',
      pstdocadjuntos : this.server + '/pstdocadjuntos',
      consultaTipoDocPlantilla : this.server + '/consultaTipoDocPlantilla',
      listadoPrestamos :this.server + '/listadoPrestamos',
      pstdocplant : this.server + '/pstdocplant',
      generarVariablesPlantillas : this.server + '/generarVariablesPlantillas',
      renderTemplates : this.server + '/renderTemplates',
      psdocadjuntos: this.server + '/psdocadjuntos'
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

 

  calcularCuotas(data): Observable<any> {
    console.log('la data');
    console.log(data);
    return this.http.post<any>(`${this.services.calcularCuotas}` , data, this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }


  getFormasPago(): Observable<any> {
    console.log('la data');
    
    let nitempresa = localStorage.getItem('nit_empresa');
    return this.http.get<any>(`${this.services.listaformaspago}`+'/'+nitempresa , this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  getPeriodosPago(): Observable<any> {
    
    
    
    return this.http.get<any>(`${this.services.listaperiodospago }` , this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  deleteFormaPago(data): Observable<any> {
    return this.http.delete(`${this.services.psformapago}` + '/' + data.id, this.httpOpts)
  }


  deleteDocumentoPlantilla(data): Observable<any> {
    return this.http.delete(`${this.services.pstdocplant}` + '/' + data.id, this.httpOpts)
  }


  guardarFormaPago(data): Observable<any> {
    
    let nitempresa = localStorage.getItem('nit_empresa');
    let id_usureg = localStorage.getItem('id_usuario');
    data.nitempresa = nitempresa;
    data.id_usureg = id_usureg;
    return this.http.post<any>(`${this.services.psformapago}` , data, this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  guardarDocumento(data): Observable<any> {
    
    let nitempresa = localStorage.getItem('nit_empresa');
    let id_usureg = localStorage.getItem('id_usuario');
    data.nitempresa = nitempresa;
    data.id_usureg = id_usureg;
    return this.http.post<any>(`${this.services.pstdocplant }` , data, this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  listaTiposDocumento () : Observable<any> {
    let data : any={};
    let nitempresa = localStorage.getItem('nit_empresa');
    return this.http.get<any>(`${this.services.pstdocadjuntos  }` , this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  listaVariablesPlantillas () : Observable<any> {
    
    let nitempresa = localStorage.getItem('nit_empresa');
    return this.http.get<any>(`${this.services.generarVariablesPlantillas  }`+'/'+nitempresa, this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  prueba () : Observable<any> {
    
    let data : any={};
    let nitempresa = localStorage.getItem('nit_empresa');
 
    return this.http.get<any>(`${this.services.generarVariablesPlantillas   }` , this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )

  
  }

  consultaFormasPago(): Observable<any> {
    
    let data: any = {};
    let nitempresa = localStorage.getItem('nit_empresa');
    data.nitempresa = nitempresa;
    
    return this.http.post<any>(`${this.services.consultaFormasPago }` + '/'+nitempresa , data, this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  consultaPlantillasDocumentos(): Observable<any> {
    
    let data: any = {};
    let nitempresa = localStorage.getItem('nit_empresa');
    data.nitempresa = nitempresa;
    
    return this.http.post<any>(`${this.services.consultaTipoDocPlantilla  }` , data, this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  consultaFormaPago(id): Observable<any> {
    
    let data: any = {};
    let nitempresa = localStorage.getItem('nit_empresa');
    data.nitempresa = nitempresa;
    
    return this.http.get<any>(`${this.services.consultaFormaPago }`+'/'+id , this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  guardarPrestamo(data): Observable<any> {
    
    let nitempresa = localStorage.getItem('nit_empresa');
    let id_usureg = localStorage.getItem('id_usuario');
    data.nitempresa = nitempresa;
    data.id_usureg = id_usureg;
    return this.http.post<any>(`${this.services.guardarPrestamo}` , data, this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  renderTemplates(data): Observable<any> {
    
    let nitempresa = localStorage.getItem('nit_empresa');
    let id_usureg = localStorage.getItem('id_usuario');
    data.nitempresa = nitempresa;
    data.id_usureg = id_usureg;
    return this.http.post<any>(`${this.services.renderTemplates}` , data, this.httpOpts).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  

  listadoPrestamos(data): Observable<any> {
    
    data.nitempresa = localStorage.getItem('nit_empresa');
    data.id_user = localStorage.getItem('id');
    return this.http.post(`${this.services.listadoPrestamos }`, data, this.httpOpts)
  }

  listadoArchivosCliente(id): Observable<any> {
    let data: any = {};
    data.nitempresa = localStorage.getItem('nit_empresa');
    data.id_user = localStorage.getItem('id');
    return this.http.get(`${this.services.psdocadjuntos  }`+'/'+id, this.httpOpts)
  }

  saveFormaPago(data): Observable<any> {
    data.nitempresa = localStorage.getItem('nit_empresa');
    data.id_user = localStorage.getItem('id');
    return this.http.post(`${this.services.psformapago }`, data, this.httpOpts)
  }

  updateFormaPago(data): Observable<any> {
    data.nitempresa = localStorage.getItem('nit_empresa');
    
    return this.http.put(`${this.services.psformapago }` + '/' + data.id, data, this.httpOpts)
  }

  updatePlantillaDocumento(data): Observable<any> {
    data.nitempresa = localStorage.getItem('nit_empresa');
    
    return this.http.put(`${this.services.pstdocplant }` + '/' + data.id, data, this.httpOpts)
  }
  

 
}
