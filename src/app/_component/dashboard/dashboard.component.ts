import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { NavItem } from '../../_models/nav-item';
import { NavService } from '../../_services/nav.service';
import { VERSION } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { EChartOption } from 'echarts';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ListaPrestamos } from '../../_models/ListaPrestamos';
import { fechasPago } from '../../_models/fechasPago';
import { PrestamosService } from '../../_services/prestamos/prestamos.service';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private navService: NavService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public prestamosService: PrestamosService,
    private router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
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
    'action',
  ];
  displayedColumnsFecPago: string[] = [
    'fecha_pago',
    'fecha_realpago',
    'valcuota',
    'valtotal',
    'action',
  ];

  dataSource = new MatTableDataSource([]);
  dataSourceFecPago = new MatTableDataSource([]);

  total_capital_prestado: string;
  total_prestado_hoy: string;
  total_interes_hoy: string;
  total_prestado: string;
  total_interes: string;
  contenidoCombinado = '';

  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  etiquetasGraficaAcumulada = {};
  valoresGraficaAcumulada = {};

  chartOption: EChartOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse(localStorage.getItem('menu_usuario'));

  permisos = JSON.parse(localStorage.getItem('permisos'));

  navItems: NavItem[] = this.menuUsuario;

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
    console.log(row);
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Desea eliminar el prestamo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!',
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

    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    // this.getSomePrivateStuff();
    this.getDatosPrestamo();
  }
  ngOnInit() {
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
        '//www.tinymce.com/css/codepen.min.css',
      ],
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
      this.plantillas_html = response;
      this.combinarContenido(response);
    });
  }

  pagarCuotaPrestamo(row) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Se va a realizar pago de la cuota?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!',
    }).then((result) => {
      if (result.value == true) {
        // var currency = row.valtotal;
        // var number = Number(currency.replace(/[^0-9.-]+/g,""));

        this.model.fecha_pago = row.fecha_pago;
        this.model.id_prestamo = row.id_prestamo;
        this.model.id_cliente = row.id_cliente;
        this.model.id = row.id;
        this.prestamosService
          .registrarPagoCuota(this.model)
          .subscribe((response) => {
            if (response) {
              Swal.fire('Listo!', 'El pago ha sido registrado.', 'success');
              this.listadoCuotas(row);
              this.refresh();
            }
          });

        //   Swal.fire({
        //     input: 'text',
        //     title: 'Valor a pagar',
        //     text: "Por favor ingrese el valor a cancelar:",
        //     showCancelButton: true,
        // confirmButtonColor: '#3085d6',
        // inputValue: row.valtotal,
        // cancelButtonColor: '#d33',
        // confirmButtonText: 'Aceptar!',
        // cancelButtonText: 'Cancelar!',
        //     inputAttributes: {
        //     autocapitalize: 'off',

        //       },
        //       preConfirm: (response) => {

        //         var currency = row.valtotal;
        //         var number = Number(currency.replace(/[^0-9.-]+/g,""));

        //        // alert (row.valtotal);
        //         if (isNaN(response)){
        //           Swal.fire ({
        //             title: 'Error!',
        //             text: 'El valor ingresado no es númerico!',
        //             cancelButtonColor: '#d33',
        //             type: 'error',
        //           })
        //           return false;
        //         }

        //         if (response <  number) {
        //           Swal.fire ({
        //             title: 'Error!',
        //             text: 'El valor ingresado debe ser mayor o igual al valor de la cuota!',
        //             cancelButtonColor: '#d33',
        //             type: 'error',
        //           })
        //           return false;
        //         }

        //         console.log (row);

        //       }
        //   })
      }
    });
  }

  combinarContenido(response: any): void {
    console.log('Response recibido:', response);

    if (!Array.isArray(response)) {
      console.error('Response no es un arreglo:', response);
      return;
    }

    this.contenidoCombinado = response
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

  logout() {
    this.authService.logout();
  }
}
