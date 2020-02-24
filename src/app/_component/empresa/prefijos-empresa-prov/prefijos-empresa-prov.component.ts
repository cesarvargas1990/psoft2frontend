import { Component, OnInit, ViewChild ,ElementRef,AfterViewInit,ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { Prefijo } from '../../../_models/prefijo';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {MatPaginator} from '@angular/material/paginator';
import { EliminarPrefijoComponent } from '../prefijos-empresa-prov/dialogs/eliminar-prefijo/eliminar-prefijo.component';
import { EditarPrefijoComponent } from '../prefijos-empresa-prov/dialogs/editar-prefijo/editar-prefijo.component';
import { AdicionarPrefijoComponent } from '../prefijos-empresa-prov/dialogs/adicionar-prefijo/adicionar-prefijo.component';
import {NavItem} from '../../../_models/nav-item';
import {NavService} from '../../../_services/nav.service';
import {VERSION} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-prefijos-empresa-prov',
  templateUrl: './prefijos-empresa-prov.component.html',
  styleUrls: ['./prefijos-empresa-prov.component.scss']
})
export class PrefijosEmpresaProvComponent implements AfterViewInit {
  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse (localStorage.getItem('menu_usuario')); 
  
  navItems: NavItem[] = this.menuUsuario; 

  model: any = {};
  datosPrefijo: any = [];
  comboEmpresa: any = {};
  comboProveedorFE : any = {};
  comboTiposDocumentoFE : any = {};

  displayedColumns: string[] = ['PREFIJO', 'NOMBRE', 'CONSEC', 'TIPODOCUMENTO' ,'RANGONUMERACION','TRANSA','IDESCN','RESOLUCION','action'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

 
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  constructor(

    public authService: AuthService,
    public dialog: MatDialog,
    private navService: NavService,
    public fb: FormBuilder,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher

  ) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  ConsultaForm : FormGroup;

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  modalAdicionarPrefijo(): void {

    const dialogRef = this.dialog.open(AdicionarPrefijoComponent, {
      height: '400px',
      width: '600px',
      data: { 
        titulo: "Adicionar nuevo prefijo",
        comboEmpresas : this.comboEmpresa,
        comboProveedoresFE:this.comboProveedorFE, 
        NIT_EMPRESA : this.model.NIT_EMPRESA,
        row : []
      }
        
      
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDatosPrefijo();

    });


  }
  modalEditarPrefijo(row): void {
    const dialogRef = this.dialog.open(EditarPrefijoComponent, {
      
      data: { 
        titulo: "Editar prefijo",
        comboEmpresas : {},
        comboProveedoresFE:{}, 
        comboTiposDocumentoFE:{},
        comboEscenario:{},
        row : row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDatosPrefijo();

    });
  }

  modalEliminarPrefijo(row: any[]) {

    const dialogRef = this.dialog.open(EliminarPrefijoComponent, {
      
      data: row
    });
    // Subscribirme al evento de cerrar el cuadro de dialogo
    dialogRef.afterClosed().subscribe(result => {
      this.getDatosPrefijo();

    });


  }

  obtenerDatosComboEmpresa () :void {
    this.model.action = 'empresa/listarEmpresas';
    this.authService.getData(this.model).subscribe(response => {
      
      if (response) {
          this.comboEmpresa = response;
     
      }
   }, error => {
     Swal.fire({
       type: 'error',
       title: 'Error',
       text: error,
     }) 
     
   });
  }

  obtenerDatosComboProveedorFE () :void {
    this.model.action = 'empresa/listarProveedorFE';
    this.authService.getData(this.model).subscribe(response => {
      
      if (response) {
            
      
          this.comboProveedorFE = response;
     
      }
   }, error => {
     Swal.fire({
       type: 'error',
       title: 'Error',
       text: error,
     })
     
   });
  }

  getConsultaPrefijosProvFE () {

    this.getDatosPrefijo();

  }

  obtenerDatosComboTiposDocumentoFE () :void {

    this.model.action = 'empresa/listarTiposDocumentoFE';
    
    this.authService.getData(this.model).subscribe(response => {
      
      if (response) {
            
      
          this.comboTiposDocumentoFE  = response;
     
      }
   }, error => {
     Swal.fire({
       type: 'error',
       title: 'Error',
       text: error,
     })
     
   });

  }

  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.reactiveForm();
    this.dataSource.paginator = this.paginator; 
    //this.getDatosPrefijo();
    this.obtenerDatosComboEmpresa();
    this.obtenerDatosComboProveedorFE();
    this.obtenerDatosComboTiposDocumentoFE();
    
  }

  /* Manejar Errores en Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.ConsultaForm.controls[control].hasError(error);
  }

  reactiveForm() {
    this.ConsultaForm = this.fb.group({
      NIT_EMPRESA: ['', Validators.required]
    })

    
  }


  getDatosPrefijo() {
    this.model.action = 'empresa/datosPrefijos';
    this.model.NIT_EMPRESA = this.ConsultaForm.controls.NIT_EMPRESA.value;
    this.authService.getData(this.model).subscribe(response => {

      if (response) {


        this.datosPrefijo = response;
        let DATOS: Prefijo[] = this.datosPrefijo;
        this.dataSource = new MatTableDataSource(DATOS);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;  

      }
    }, error => {
      this.authService.logout();
    });
  }

}
