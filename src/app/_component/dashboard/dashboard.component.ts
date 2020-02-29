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
import { PrestamosService } from '../../_services/prestamos/prestamos.service';
import { MatPaginator } from '@angular/material/paginator';
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
  datosEmpresa: any = [];
  datosPrestamos: any = [];

  displayedColumns: string[] = ['nomcliente','valorpres','nomfpago','celular','direcasa'];

  dataSource = new MatTableDataSource([]);

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
          console.log('datasa prestamos');
          console.log(response);
          this.datosPrestamos = response;
          let DATOS: ListaPrestamos[] = this.datosPrestamos;
          this.dataSource = new MatTableDataSource(DATOS);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }

      }
    )

    
  }
  
 
  dataFromServer: any = [];
 
  constructor(
    public authService: AuthService,
    private navService: NavService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public prestamosService: PrestamosService
  ) { 

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
  } 

  private _mobileQueryListener: () => void;
 

  

  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    //this.getSomePrivateStuff();
    this.getDatosPrestamo();

    
    
    

    

  }
 
  getSomePrivateStuff() {
    
    
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
 
  logout(){
    this.authService.logout();
  }
 
}
