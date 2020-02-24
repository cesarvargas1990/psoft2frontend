import { Component, OnInit, ViewChild,ElementRef,AfterViewInit,ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from '../../../_models/empresa';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditarEmpresaComponent } from '../listar-empresas/dialogs/editar-empresa/editar-empresa.component';
import { EliminarEmpresaComponent } from '../listar-empresas/dialogs/eliminar-empresa/eliminar-empresa.component';
import { AdicionarEmpresaComponent } from '../listar-empresas/dialogs/adicionar-empresa/adicionar-empresa.component';
import {NavItem} from '../../../_models/nav-item';
import {NavService} from '../../../_services/nav.service';
import {VERSION} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-crear-empresa',
  templateUrl: '../listar-empresas/listar-empresas.component.html',
  styleUrls: ['../listar-empresas/listar-empresas.component.scss']
})
export class CrearEmpresaComponent implements AfterViewInit {
  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;

  version = VERSION;

  mobileQuery: MediaQueryList;

  menuUsuario = JSON.parse (localStorage.getItem('menu_usuario')); 
  
  navItems: NavItem[] = this.menuUsuario; 

  model: any = {};
  datosEmpresa: any = [];

  displayedColumns: string[] = ['NIT', 'NOMBRE', 'DDIREC', 'TELEFONO','EMAIL', 'action'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;


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


  modalAdicionarEmpresa(): void {

    const dialogRef = this.dialog.open(AdicionarEmpresaComponent, {
      data: []
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.getDatosEmpresa();

    });


  }


  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  modalEditarEmpresa(row): void {
    const dialogRef = this.dialog.open(EditarEmpresaComponent, {
      
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.getDatosEmpresa();

    });
  }

  modalEliminarEmpresa(row: any[]) {

    const dialogRef = this.dialog.open(EliminarEmpresaComponent, {
      
      data: row
    });
    // Subscribirme al evento de cerrar el cuadro de dialogo
    dialogRef.afterClosed().subscribe(result => {
      
      this.getDatosEmpresa();

    });


  }

  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.getDatosEmpresa();
    this.modalAdicionarEmpresa();
  }


  getDatosEmpresa() {
    
    this.model.action = 'empresa/listarEmpresas';
    this.authService.getData(this.model).subscribe(response => {

      if (response) {


        this.datosEmpresa = response;
        let DATOS: Empresa[] = this.datosEmpresa;
        this.dataSource = new MatTableDataSource(DATOS);
        this.dataSource.sort = this.sort;
        

      }
    }, error => {
      this.authService.logout();
    });
  }

}