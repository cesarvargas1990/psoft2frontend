import { Component, ViewChild, ElementRef, AfterViewInit,ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import {NavItem} from '../../_models/nav-item';
import {NavService} from '../../_services/nav.service';
import {VERSION} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']  
})
export class DashboardComponent implements AfterViewInit {

  options: any = {};
  options2: any = {};

  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;


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
  model: any = {};
 
  dataFromServer: any = [];
 
  constructor(
    public authService: AuthService,
    private navService: NavService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) { 

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
  } 

  private _mobileQueryListener: () => void;
 

  

  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.getSomePrivateStuff();

    this.model.action = 'facturacionElectronica/datosGraficoDocumentosFE';
    this.model.id_usuario = JSON.parse(localStorage.getItem('id_usuario'));
    if (localStorage.getItem('nit_empresa') != null) {
      this.model.NIT_EMPRESA = JSON.parse( localStorage.getItem('nit_empresa')  ); 
    } else {
      this.model.NIT_EMPRESA = '';
    }
    
    

    

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
