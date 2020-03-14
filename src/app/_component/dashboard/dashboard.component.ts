import { Component, ViewChild, ElementRef, AfterViewInit,ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import {NavItem} from '../../_models/nav-item';
import {NavService} from '../../_services/nav.service';
import {VERSION} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import { EChartOption } from 'echarts';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ListaPrestamos } from '../../_models/ListaPrestamos';
import { fechasPago } from '../../_models/fechasPago'; 
import { PrestamosService } from '../../_services/prestamos/prestamos.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'; 
import { ListarDocumentosprestamoComponent} from '../../_component/dashboard/dialogs/listar-documentosprestamo/listar-documentosprestamo.component';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']  
})
export class DashboardComponent implements AfterViewInit {

  options: any = {};
  options2: any = {};

  model: any = {};
  data: any = {};
  config: any = {};
  datosEmpresa: any = [];
  datosPrestamos: any = [];
  datosFechasPago: any = [];
  fechasPago : any = [];

  panelOpenState = false;
  plantillas_html :any = {};
  visualizarDocumentos = false;
  visualizarListaCuotas = false;
  listadoPrestamos = true;

  displayedColumns: string[] = ['nomcliente','valorpres','nomfpago','celular','direcasa','action'];
  displayedColumnsFecPago: string[] = ['id_prestamo','fecha_pago','valcuota','action'];

  dataSource = new MatTableDataSource([]);
  dataSourceFecPago = new MatTableDataSource([]);

  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


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
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line'
    }]
  }


  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse (localStorage.getItem('menu_usuario')); 
  
  navItems: NavItem[] = this.menuUsuario; 
  

  getDatosPrestamo() {

    
    this.prestamosService.listadoPrestamos(this.data).subscribe(
      response => {

        if (response ){
          
          this.datosFechasPago = response;
          let DATOS: ListaPrestamos[] = this.datosFechasPago;
          this.dataSource = new MatTableDataSource(DATOS);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }

      }
    )

    
  }

  listadoCuotas (row) {
    

    
    this.prestamosService.listaFechasPago(row.id_prestamo).subscribe(
      response => {
        console.log (response);
        if (response ) {

          this.datosFechasPago = response;
          let DATOSFPAGO: fechasPago[] = this.datosFechasPago;
          this.dataSourceFecPago = new MatTableDataSource(DATOSFPAGO);
          this.dataSourceFecPago.sort = this.sort;
          this.dataSourceFecPago.paginator = this.paginator;
 
        }
      }
    )

  }
  
  
 
  dataFromServer: any = [];
 
  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private navService: NavService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public prestamosService: PrestamosService,
    private router: Router
  ) { 

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
  } 

  private _mobileQueryListener: () => void;
 

  eliminarPrestamo(row) {
  

console.log(row);
    Swal.fire({
      title: 'Esta seguro?',
      text: "Desea eliminar el prestamo?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!'
    }).then((result) => {

      if (result.value == true) {


        this.prestamosService.deletePrestamo (row).subscribe(
          response => {
              this.getDatosPrestamo();
          }
        )


      }

    })


  }

  ngOnInit() {

    this.config = {
      height: 500,
      theme: 'modern',
      // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
      plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern',
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
      image_advtab: true,
      imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
      init_instance_callback: function() {},
      content_css: [
        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        '//www.tinymce.com/css/codepen.min.css'
      ]
    }

    this.mobileQuery.removeListener(this._mobileQueryListener);
    //this.getSomePrivateStuff();
    this.getDatosPrestamo();

    
      

  }




  irPantallaCrearPrestamo () {
    this.router.navigate(['/clientes/crearPrestamo']);
  }

  modalListadoDocumentos(row): void {

    this.visualizarDocumentos = true;

   
    
    this.model.id_prestamo = row.id_prestamo;
                          this.prestamosService.renderTemplates(this.model).subscribe(
                            response => {
                              console.log (response);
                              this.plantillas_html = response;
                            }
                          )

    


  }

 
  pagarCuotaPrestamo (row){


    Swal.fire({
      title: 'Esta seguro?',
      text: "Se va a realizar pago de la cuota?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!'
    }).then((result) => {

      if (result.value == true) {

        console.log (row);
        this.model.fecha_pago = row.fecha_pago;
        this.model.id_prestamo = row.id_prestamo;
        this.model.id_cliente = row.id_cliente;
        this.model.id = row.id;
        this.prestamosService.registrarPagoCuota(this.model).subscribe(
          response => {
  
            
            if (response ){
              Swal.fire("Listo!", "El pago ha sido registrado.", "success");
              this.listadoCuotas(row);
            }
          }
        )

      }

    })
    
   
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
 
  logout(){
    this.authService.logout();
  }
 
}
