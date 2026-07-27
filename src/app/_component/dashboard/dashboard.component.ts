import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { NavItem } from '../../_models/nav-item';
import { NavService } from '../../_services/nav.service';
import { VERSION } from '@angular/material/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { EChartOption } from 'echarts';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import { ListaPrestamos } from '../../_models/ListaPrestamos';
import { fechasPago } from '../../_models/fechasPago';
import { PrestamosService } from '../../_services/prestamos/prestamos.service';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { SessionStateService } from '../../core/session/session-state.service';
import { MapaUbicacionDialogComponent } from '../shared/mapa-ubicacion-dialog/mapa-ubicacion-dialog.component';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private navService: NavService,
    private readonly sessionState: SessionStateService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public prestamosService: PrestamosService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    } else {
      const legacyAddListener = (this.mobileQuery as any).addListener as
        | ((listener: () => void) => void)
        | undefined;
      legacyAddListener?.(this._mobileQueryListener);
    }
  }

  options: any = {};

  codPrestaSeleccionado: any = {};
  clienteSeleccionado: any = {};

  options2: any = {};

  model: any = {};
  data: any = {};
  config: any = {};
  datosEmpresa: any = [];
  datosPrestamos: any = [];
  datosFechasPago: any = [];
  cuotasPendientesHoy: fechasPago[] = [];
  fechasPago: any = [];

  panelOpenState = false;
  plantillas_html: any = {};
  visualizarDocumentos = false;
  visualizarListaCuotas = false;
  listadoPrestamos = true;
  totales = true;

  displayedColumns: string[] = [
    'id_prestamo',
    'nomcliente',
    'valorpres',
    'valcuota',
    'nomfpago',
    'celular',
    'direcasa',
    'action'
  ];
  displayedColumnsFecPago: string[] = [
    'fecha_pago',
    'fecha_realpago',
    'valcuota',
    'valtotal',
    'action'
  ];

  dataSource = new MatTableDataSource([]);
  dataSourceFecPago = new MatTableDataSource([]);

  total_capital_prestado: string;
  total_prestado_hoy: string;
  total_interes_hoy: string;
  total_prestado: string;
  total_interes: string;
  contenidoCombinado = '';
  cuotaEnProceso: number | string | null = null;

  @ViewChild('appDrawer') appDrawer: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  etiquetasGraficaAcumulada = {};
  valoresGraficaAcumulada = {};

  chartOption: EChartOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
      }
    ]
  };

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario: unknown = [];

  permisos: string[] = [];

  navItems: NavItem[] = [];

  dataFromServer: any = [];

  private _mobileQueryListener: () => void;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDatosPrestamo() {
    this.prestamosService.listadoPrestamos(this.data).subscribe((response) => {
      if (response) {
        this.datosFechasPago = response;
        const DATOS: ListaPrestamos[] = this.datosFechasPago;
        this.dataSource = new MatTableDataSource(DATOS);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  listadoCuotas(row) {
    this.codPrestaSeleccionado = row.id_prestamo;
    this.clienteSeleccionado = row.nomcliente;

    this.prestamosService
      .listaFechasPago(row.id_prestamo)
      .subscribe((response) => {
        console.log(response);
        if (response) {
          this.datosFechasPago = response;
          const DATOSFPAGO: fechasPago[] = this.datosFechasPago;
          this.dataSourceFecPago = new MatTableDataSource(DATOSFPAGO);
          this.dataSourceFecPago.sort = this.sort;
          this.dataSourceFecPago.paginator = this.paginator;
        }
      });
  }

  eliminarPrestamo(row) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Desea eliminar el prestamo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!'
    }).then((result) => {
      if (result.value == true) {
        this.prestamosService.deletePrestamo(row).subscribe((response) => {
          this.getDatosPrestamo();
          this.refresh();
        });
      }
    });
  }

  refresh() {
    this.prestamosService.totales_dashboard().subscribe((response) => {
      this.total_capital_prestado = response.total_capital_prestado;
      this.total_prestado_hoy = response.total_prestado_hoy;
      this.total_interes_hoy = response.total_interes_hoy;
      this.total_interes = response.total_interes;
      this.total_prestado = response.total_prestado;
    });
    this.cargarCuotasPendientesHoy();
    this.getDatosPrestamo();
  }

  cargarCuotasPendientesHoy(): void {
    this.prestamosService.cuotasPendientesHoy().subscribe({
      next: (response) => {
        this.cuotasPendientesHoy = response || [];
      },
      error: () => {
        this.cuotasPendientesHoy = [];
      }
    });
  }

  verUbicacionCuota(cuota: fechasPago): void {
    this.dialog.open(MapaUbicacionDialogComponent, {
      data: {
        ubicacion: cuota.ubicasa,
        direccion: cuota.direcasa,
        titulo: `Ubicación de ${cuota.nomcliente || 'cliente'}`
      },
      maxWidth: '94vw'
    });
  }

  ngOnInit() {
    this.menuUsuario = this.sessionState.parseStoredJson('menu_usuario', []);
    this.permisos = this.sessionState.getPermissions();
    this.navItems = this.sessionState.getMenuItems();

    this.config = {
      height: 500,
      theme: 'modern',
      // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
      plugins:
        'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern',
      toolbar:
        'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
      image_advtab: true,
      imagetools_toolbar:
        'rotateleft rotateright | flipv fliph | editimage imageoptions',
      init_instance_callback() {},
      content_css: [
        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        '//www.tinymce.com/css/codepen.min.css'
      ]
    };
    this.refresh();
  }

  irPantallaCrearPrestamo() {
    this.router.navigate(['/clientes/crearPrestamo']);
  }

  modalListadoDocumentos(row): void {
    this.visualizarDocumentos = true;

    this.model.id_prestamo = row.id_prestamo;
    this.prestamosService.renderTemplates(this.model).subscribe((response) => {
      console.log(response);
      this.plantillas_html = this.extractRenderedTemplates(response);
      this.combinarContenido(this.plantillas_html);
    });
  }

  pagarCuotaPrestamo(row: Partial<fechasPago> & { fecha_pago: string }): void {
    if (this.cuotaEnProceso !== null || row.id_fecha_pago) {
      return;
    }

    Swal.fire({
      title: '¿Confirmar pago?',
      text: 'Esta acción registrará la cuota como pagada.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, pagar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => {
      const confirmado =
        result.value === true ||
        (result as { isConfirmed?: boolean }).isConfirmed;

      if (confirmado) {
        this.cuotaEnProceso = row.id ?? row.id_prestamo ?? 'cuota';
        const pago = {
          fecha_pago: row.fecha_pago,
          id_prestamo: row.id_prestamo,
          id_cliente: row.id_cliente,
          id: row.id
        };

        this.prestamosService.registrarPagoCuota(pago).subscribe({
          next: (response) => {
            if (response) {
              Swal.fire('¡Listo!', 'El pago ha sido registrado.', 'success');
              this.listadoCuotas(row);
              this.refresh();
            } else {
              Swal.fire(
                'No se pudo registrar',
                'El servidor no confirmó el pago. Intenta nuevamente.',
                'error'
              );
            }
            this.cuotaEnProceso = null;
          },
          error: () => {
            this.cuotaEnProceso = null;
            Swal.fire(
              'Error',
              'No fue posible registrar el pago. Verifica la conexión e intenta nuevamente.',
              'error'
            );
          }
        });
      }
    });
  }

  combinarContenido(response: any): void {
    console.log('Response recibido:', response);

    const templates = this.extractRenderedTemplates(response);
    if (!Array.isArray(response) && templates.length === 0) {
      console.error('Response no es un arreglo:', response);
      return;
    }

    this.contenidoCombinado = templates
      .map((item) => {
        // Limpia etiquetas <html>, <head>, <body>
        const contenidoLimpio = this.limpiarHTML(item.plantilla_html);
        return `
          <div>

            ${contenidoLimpio}
            <hr style="page-break-after: always;">
          </div>
        `;
      })
      .join('');

    console.log('Contenido combinado:', this.contenidoCombinado);
  }

  private extractRenderedTemplates(
    response: unknown
  ): Array<{ plantilla_html: string }> {
    if (Array.isArray(response)) {
      return response as Array<{ plantilla_html: string }>;
    }

    if (typeof response === 'string') {
      try {
        return this.extractRenderedTemplates(JSON.parse(response));
      } catch (_error) {
        return [];
      }
    }

    if (response && typeof response === 'object') {
      const record = response as Record<string, unknown>;
      const nestedCandidates = [
        record.data,
        record.documentos,
        record.templates,
        record.plantillas_html,
        record.result
      ];
      for (const candidate of nestedCandidates) {
        if (Array.isArray(candidate)) {
          return candidate as Array<{ plantilla_html: string }>;
        }
      }
    }

    return [];
  }

  limpiarHTML(html: string): string {
    // Remueve etiquetas <html>, <head>, y <body>
    return html
      .replace(/<html[^>]*>/gi, '')
      .replace(/<\/html>/gi, '')
      .replace(/<head[^>]*>.*?<\/head>/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '');
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  ngOnDestroy(): void {
    if (this.mobileQuery.removeEventListener) {
      this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    } else {
      const legacyRemoveListener = (this.mobileQuery as any).removeListener as
        | ((listener: () => void) => void)
        | undefined;
      legacyRemoveListener?.(this._mobileQueryListener);
    }
  }

  logout() {
    this.authService.logout();
  }
}
