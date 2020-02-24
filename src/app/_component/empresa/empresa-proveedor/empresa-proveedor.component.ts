import { Component, OnInit ,ViewChild ,ElementRef,AfterViewInit,ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from '../../../_services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { EmpresaProvFE } from '../../../_models/EmpresaProvFE';
import { AdicionarEmpresaprovFeComponent } from '../empresa-proveedor/dialogs/adicionar-empresaprov-fe/adicionar-empresaprov-fe.component';
import { EditarEmpresaprovFeComponent } from '../empresa-proveedor/dialogs/editar-empresaprov-fe/editar-empresaprov-fe.component';
import { EliminarEmpresaprovFeComponent } from '../empresa-proveedor/dialogs/eliminar-empresaprov-fe/eliminar-empresaprov-fe.component';
import {NavItem} from '../../../_models/nav-item';
import {NavService} from '../../../_services/nav.service';
import {VERSION} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-empresa-proveedor',
  templateUrl: './empresa-proveedor.component.html',
  styleUrls: ['./empresa-proveedor.component.scss']
})
export class EmpresaProveedorComponent implements AfterViewInit {


  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse (localStorage.getItem('menu_usuario')); 
  
  navItems: NavItem[] = this.menuUsuario; 

  model: any = {};
  comboEmpresa: any = {};
  comboProveedorFE: any = {};



  datosEmpresaProvFE: any = [];

  displayedColumns: string[] = ['EMPRESA', 'PROVEEDOR','ESCENARIO', 'action'];

  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  
  constructor(

    public authService: AuthService,
    public dialog: MatDialog,
    private navService: NavService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher

  ) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

   }

   private _mobileQueryListener: () => void;


  modalAdicionarEmpresaProveedor(): void {

    const dialogRef = this.dialog.open(AdicionarEmpresaprovFeComponent, {

      data: {
        titulo: "Asociar empresa y proveedor",
        comboEmpresas: this.comboEmpresa,
        comboProveedoresFE: this.comboProveedorFE

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDatosEmpresaProvFE();
    });


  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  modalEditarEmpresaProveedor(row): void {

    const dialogRef = this.dialog.open(EditarEmpresaprovFeComponent, {
      
      data: {
        titulo: "Editar datos de config empresa y proveedor",
        comboEmpresas: this.comboEmpresa,
        comboProveedoresFE: this.comboProveedorFE,
        row:row

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDatosEmpresaProvFE();
    });


  }

  modalEliminarEmpresaProveedor(row: any[]): void {

    const dialogRef = this.dialog.open(EliminarEmpresaprovFeComponent, {
      
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDatosEmpresaProvFE();
    });


  }

  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.dataSource.paginator = this.paginator;
    this.getDatosEmpresaProvFE();
    this.obtenerDatosComboEmpresa();
    this.obtenerDatosComboProveedorFE();
  }

  getDatosEmpresaProvFE() {
    this.model.action = 'empresa/emprProveedor';
    this.authService.getData(this.model).subscribe(response => {

      if (response) {


        this.datosEmpresaProvFE = response;
        let DATOS: EmpresaProvFE[] = this.datosEmpresaProvFE;
        this.dataSource = new MatTableDataSource(DATOS);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      }
    }, error => {
      this.authService.logout();
    });
  }

  obtenerDatosComboEmpresa(): void {
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

  obtenerDatosComboProveedorFE(): void {
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

}
