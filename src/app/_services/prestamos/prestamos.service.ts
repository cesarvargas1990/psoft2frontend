import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from '../../_services/auth.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ListaPrestamos } from '../../_models/ListaPrestamos';
import { fechasPago } from '../../_models/fechasPago';
import {
  BackendMessageResponse,
  CuotaCalculada,
  DashboardTotalsResponse,
  DocumentoPlantilla,
  DocumentoTipoAdjunto,
  SelectOption,
  SistemaPrestamo,
  VariablePlantilla
} from '../../_models/api.types';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  private server: string = environment.API_URL;

  private services = {
    psformapago: this.server + '/psformapago',
    calcularCuotas: this.server + '/calcularCuotas',
    listaformaspago: this.server + '/listaformaspago',
    listaperiodospago: this.server + '/listaperiodopago',
    guardarPrestamo: this.server + '/guardarPrestamo',
    pstiposistemaprest: this.server + '/pstiposistemaprest',
    pstdocadjuntos: this.server + '/pstdocadjuntos',
    consultaTipoDocPlantilla: this.server + '/consultaTipoDocPlantilla',
    listadoPrestamos: this.server + '/listadoPrestamos',
    pstdocplant: this.server + '/pstdocplant',
    generarVariablesPlantillas: this.server + '/generarVariablesPlantillas',
    renderTemplates: this.server + '/renderTemplates',
    psdocadjuntos: this.server + '/psdocadjuntos',
    psfechaspago: this.server + '/psfechaspago',
    pspagos: this.server + '/pspagos',
    cuotasPendientesHoy: this.server + '/cuotas_pendientes_hoy',
    eliminarPrestamo: this.server + '/eliminarPrestamo',
    listatiposistemaprest: this.server + '/listatiposistemaprest',
    totales_dashboard: this.server + '/totales_dashboard'
  };

  httpOpts = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    })
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getStorageValue(key: string): string {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) {
      return '';
    }

    let parsedValue: unknown = rawValue;
    while (typeof parsedValue === 'string') {
      const trimmedValue = parsedValue.trim();
      if (!trimmedValue) {
        return '';
      }

      try {
        parsedValue = JSON.parse(trimmedValue);
      } catch (_error) {
        return trimmedValue;
      }
    }

    return String(parsedValue ?? '');
  }

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

  calcularCuotas(
    data: Record<string, unknown>
  ): Observable<CuotaCalculada[] | Record<string, unknown>> {
    data.id_empresa = this.getStorageValue('id_empresa');
    return this.http
      .post<
        CuotaCalculada[] | Record<string, unknown>
      >(`${this.services.calcularCuotas}`, data, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  getFormasPago(): Observable<
    Array<SelectOption | string | Record<string, unknown>>
  > {
    console.log('la data');

    const id_empresa = this.getStorageValue('id_empresa');
    return this.http
      .get<
        Array<SelectOption | string | Record<string, unknown>>
      >(`${this.services.listaformaspago}` + '/' + id_empresa, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  getPeriodosPago(): Observable<
    Array<SelectOption | string | Record<string, unknown>>
  > {
    return this.http
      .get<
        Array<SelectOption | string | Record<string, unknown>>
      >(`${this.services.listaperiodospago}`, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  getSistemaPrestamo(): Observable<
    Array<SelectOption | string | Record<string, unknown>>
  > {
    return this.http
      .get<
        Array<SelectOption | string | Record<string, unknown>>
      >(`${this.services.listatiposistemaprest}`, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteFormaPago(data: {
    id: number | string;
  }): Observable<BackendMessageResponse> {
    return this.http.delete<BackendMessageResponse>(
      `${this.services.psformapago}` + '/' + data.id,
      this.httpOpts
    );
  }

  deletePrestamo(data: {
    id_prestamo: number | string;
  }): Observable<BackendMessageResponse> {
    return this.http.delete<BackendMessageResponse>(
      `${this.services.eliminarPrestamo}` + '/' + data.id_prestamo,
      this.httpOpts
    );
  }

  deleteDocumentoPlantilla(data: {
    id: number | string;
  }): Observable<BackendMessageResponse> {
    return this.http.delete<BackendMessageResponse>(
      `${this.services.pstdocplant}` + '/' + data.id,
      this.httpOpts
    );
  }

  guardarFormaPago(
    data: Record<string, unknown>
  ): Observable<BackendMessageResponse> {
    const id_empresa = this.getStorageValue('id_empresa');
    const id_usureg = this.getStorageValue('id_usuario');
    data.id_empresa = id_empresa;
    data.id_usureg = id_usureg;
    return this.http
      .post<BackendMessageResponse>(
        `${this.services.psformapago}`,
        data,
        this.httpOpts
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  guardarDocumento(
    data: Partial<DocumentoPlantilla> & Record<string, unknown>
  ): Observable<DocumentoPlantilla | Record<string, unknown>> {
    const id_empresa = this.getStorageValue('id_empresa');
    const id_usureg = this.getStorageValue('id_usuario');
    data.id_empresa = id_empresa;
    data.id_usureg = id_usureg;
    return this.http
      .post<
        DocumentoPlantilla | Record<string, unknown>
      >(`${this.services.pstdocplant}`, data, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  listaTiposDocumento(): Observable<
    DocumentoTipoAdjunto[] | Record<string, unknown>
  > {
    return this.http
      .get<
        DocumentoTipoAdjunto[] | Record<string, unknown>
      >(`${this.services.pstdocadjuntos}`, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  listaVariablesPlantillas(): Observable<
    VariablePlantilla[] | Record<string, unknown>
  > {
    const id_empresa = this.getStorageValue('id_empresa');
    return this.http
      .get<
        VariablePlantilla[] | Record<string, unknown>
      >(`${this.services.generarVariablesPlantillas}` + '/' + id_empresa, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  listaFechasPago(id_prestamo: number | string): Observable<fechasPago[]> {
    return this.http
      .get<
        fechasPago[]
      >(`${this.services.psfechaspago}` + '/' + id_prestamo, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  prueba(): Observable<unknown> {
    return this.http
      .get<unknown>(
        `${this.services.generarVariablesPlantillas}`,
        this.httpOpts
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  consultaPlantillasDocumentos(): Observable<
    DocumentoPlantilla[] | Record<string, unknown>
  > {
    const data: any = {};
    const id_empresa = this.getStorageValue('id_empresa');
    data.id_empresa = id_empresa;

    return this.http
      .post<
        DocumentoPlantilla[] | Record<string, unknown>
      >(`${this.services.consultaTipoDocPlantilla}`, data, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  pstiposistemaprest(): Observable<SistemaPrestamo[] | boolean> {
    const data: any = {};
    const id_empresa = this.getStorageValue('id_empresa');
    data.id_empresa = id_empresa;

    return this.http
      .get<
        SistemaPrestamo[] | boolean
      >(`${this.services.pstiposistemaprest}`, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  guardarPrestamo(
    data: Record<string, unknown>
  ): Observable<BackendMessageResponse> {
    const id_empresa = this.getStorageValue('id_empresa');
    const id_usureg = this.getStorageValue('id_usuario');
    const fecha = this.obtenerFechaHoraCliente();
    data.id_empresa = id_empresa;
    data.id_usureg = id_usureg;
    data.fecha = fecha;
    return this.http
      .post<BackendMessageResponse>(
        `${this.services.guardarPrestamo}`,
        data,
        this.httpOpts
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  renderTemplates(data: {
    id_prestamo?: number | string;
    [key: string]: unknown;
  }): Observable<any> {
    const id_empresa = this.getStorageValue('id_empresa');
    const id_usureg = this.getStorageValue('id_usuario');
    data.id_empresa = id_empresa;
    data.id_usureg = id_usureg;
    return this.http
      .post<any>(`${this.services.renderTemplates}`, data, this.httpOpts)
      .pipe(retry(2), catchError(this.handleError));
  }

  listadoPrestamos(
    data: Record<string, unknown>
  ): Observable<ListaPrestamos[]> {
    data.id_empresa = this.getStorageValue('id_empresa');
    data.id_user = this.getStorageValue('id');
    return this.http.post<ListaPrestamos[]>(
      `${this.services.listadoPrestamos}`,
      data,
      this.httpOpts
    );
  }

  listadoArchivosCliente(
    id: number | string
  ): Observable<Record<string, unknown>[]> {
    const data: any = {};
    data.id_empresa = this.getStorageValue('id_empresa');
    data.id_user = this.getStorageValue('id');
    return this.http.get<Record<string, unknown>[]>(
      `${this.services.psdocadjuntos}` + '/' + id,
      this.httpOpts
    );
  }

  saveFormaPago(
    data: Record<string, unknown>
  ): Observable<BackendMessageResponse> {
    data.id_empresa = this.getStorageValue('id_empresa');
    data.id_user = this.getStorageValue('id');
    return this.http.post<BackendMessageResponse>(
      `${this.services.psformapago}`,
      data,
      this.httpOpts
    );
  }

  updateFormaPago(data: {
    id: number | string;
    [key: string]: unknown;
  }): Observable<BackendMessageResponse> {
    data.id_empresa = this.getStorageValue('id_empresa');

    return this.http.put<BackendMessageResponse>(
      `${this.services.psformapago}` + '/' + data.id,
      data,
      this.httpOpts
    );
  }

  updatePlantillaDocumento(data: {
    id: number | string;
    [key: string]: unknown;
  }): Observable<BackendMessageResponse> {
    data.id_empresa = this.getStorageValue('id_empresa');

    return this.http.put<BackendMessageResponse>(
      `${this.services.pstdocplant}` + '/' + data.id,
      data,
      this.httpOpts
    );
  }

  registrarPagoCuota(data: {
    id?: number | string;
    id_cliente?: number | string;
    id_prestamo?: number | string;
    [key: string]: unknown;
  }): Observable<BackendMessageResponse> {
    data.id_empresa = this.getStorageValue('id_empresa');
    data.id_user = this.getStorageValue('id');
    data.fecha = this.obtenerFechaHoraCliente();
    return this.http.post<BackendMessageResponse>(
      `${this.services.pspagos}`,
      data,
      this.httpOpts
    );
  }

  cuotasPendientesHoy(): Observable<fechasPago[]> {
    const data = {
      fecha: this.fechaActual(),
      id_empresa: this.getStorageValue('id_empresa')
    };
    return this.http.post<fechasPago[]>(
      `${this.services.cuotasPendientesHoy}`,
      data,
      this.httpOpts
    );
  }

  totales_dashboard(): Observable<DashboardTotalsResponse> {
    const data: any = {};
    data.fecha = this.fechaActual();
    data.id_empresa = this.getStorageValue('id_empresa');
    return this.http.post<DashboardTotalsResponse>(
      `${this.services.totales_dashboard}`,
      data,
      this.httpOpts
    );
  }

  fechaActual() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  obtenerFechaHoraCliente() {
    const fecha = new Date();
    const offset = -fecha.getTimezoneOffset();
    const signo = offset >= 0 ? '+' : '-';
    const horas = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
    const minutos = String(Math.abs(offset) % 60).padStart(2, '0');

    return (
      `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')} ` +
      `${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}:${String(fecha.getSeconds()).padStart(2, '0')} ` +
      `${signo}${horas}:${minutos}`
    );
  }
}
