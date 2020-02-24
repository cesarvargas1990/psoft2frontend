import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../_services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNull } from 'util';
import { MatPaginator } from '@angular/material/paginator';
import { AppService } from '../../../_services/app.service';
import { NavItem } from '../../../_models/nav-item';
import { NavService } from '../../../_services/nav.service';
import { VERSION } from '@angular/material';
import { VisualizarLogComponent } from '../consulta-factura-fe/dialogs/visualizar-log/visualizar-log.component';
import { VisualizarEstadoDocumentoComponent } from '../consulta-factura-fe/dialogs/visualizar-estado-documento/visualizar-estado-documento.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-consulta-factura-fe',
  templateUrl: './consulta-factura-fe.component.html',
  styleUrls: ['./consulta-factura-fe.component.scss'],
})
export class ConsultaFacturaFEComponent implements AfterViewInit {


  sicufe = true;
  nocufe = false;

  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;


  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse(localStorage.getItem('menu_usuario'));

  navItems: NavItem[] = this.menuUsuario;

  constructor(public authService: AuthService,
    public fb: FormBuilder,
    private appService: AppService,
    private navService: NavService,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

   }

   private _mobileQueryListener: () => void;

  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayedColumns: string[] = ['NOMBRE_EMPRESA', 'PREFIJO','DOCUM', 'TIPODOCUMENTO', 'FECHA_CREACION', 'FECHA', 'TOTAL', 'NITNOM', 'ESCENARIO', 'CUFE', 'action'];
  model: any = {};
  comboEmpresa: any = {};
  consultaFactura: any = {};
  ConsultaForm: FormGroup;

  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.dataSource.paginator = this.paginator;
    this.getDatosComboEmpresa()
    this.reactiveForm()
    this.getConsultaFE()
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  getDatosComboEmpresa() {
    this.model.action = 'empresa/getDatosComboEmpresa';
    this.model.id_usuario = JSON.parse(localStorage.id_usuario);
    this.authService.getData(this.model).subscribe(response => {

      if (response) {


        this.comboEmpresa = response;

      }
    }, error => {
      this.authService.logout();
    });
  }


  eliminarDocumento(row): void {
    Swal.fire({
      title: 'Esta seguro?',
      text: "Desea eliminar el registro?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!'
    }).then((result) => {

      if (result.value == true) {

        this.model.action = 'empresa/eliminarLog';
        this.model.data = row;
        this.model.id_usuario = JSON.parse(localStorage.id_usuario);

        this.authService.getDataAny(this.model).subscribe(response => {

          if (response) {

            Swal.fire({
              type: 'info',
              title: 'Informaci&oacute;n',
              text: 'Se elimino satisfactoriamente el registro.',
            })

            this.getConsultaFE();

          }
        }, error => {
          Swal.fire({
            type: 'error',
            title: 'Error',
            text: error,
          })

        });

      }

    })
  }

  modalVerLogFactura(row): void {
    const dialogRef = this.dialog.open(VisualizarLogComponent, {

      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getConsultaFE();

    });
  }

  getConsultaFE() {

    this.model = this.ConsultaForm.value;
    this.model.id_usuario = JSON.parse(localStorage.id_usuario);

    this.ConsultaForm = this.fb.group({
      DOCUMENTO: [this.model.DOCUMENTO],
      NIT_EMPRESA: [this.model.NIT_EMPRESA],
      SICUFE: [this.model.SICUFE],
      NOCUFE: [this.model.NOCUFE],
      FEC_INI: [this.model.FEC_INI],
      FEC_FIN: [this.model.FEC_FIN],

    })
    this.model.action = 'factura/getConsultaFE';

    if (this.ConsultaForm.value.FEC_INI != "" || this.ConsultaForm.value.FEC_FIN != "") {

      if (isNull(this.ConsultaForm.value.FEC_INI) || isNull(this.ConsultaForm.value.FEC_FIN)) {

        this.model.FEC_INI = "";
        this.model.FEC_FIN = "";

      } else {

        this.model.FEC_INI = (this.ConsultaForm.value.FEC_INI).format('DD/MM/YYYY');
        this.model.FEC_FIN = (this.ConsultaForm.value.FEC_FIN).format('DD/MM/YYYY');

      }

    } else {
      delete (this.model.FEC_INI);
      delete (this.model.FEC_FIN);
    }



    this.authService.getData(this.model).subscribe(response => {

      if (response) {
        this.consultaFactura = response;
        let DATOS = this.consultaFactura;
        this.dataSource = new MatTableDataSource(DATOS);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        //this.reactiveForm(); 
      }
    }, error => {
      this.authService.logout();
    });
  }

  generarCSVConsultaFE() {

    this.model = this.ConsultaForm.value;

    this.ConsultaForm = this.fb.group({
      DOCUMENTO: [this.model.DOCUMENTO],
      NIT_EMPRESA: [this.model.NIT_EMPRESA],
      SICUFE: [this.model.SICUFE],
      NOCUFE: [this.model.NOCUFE],
      FEC_INI: [this.model.FEC_INI],
      FEC_FIN: [this.model.FEC_FIN],

    })
    this.model.action = 'factura/getConsultaFE';

    if (this.ConsultaForm.value.FEC_INI != "" || this.ConsultaForm.value.FEC_FIN != "") {

      if (isNull(this.ConsultaForm.value.FEC_INI) || isNull(this.ConsultaForm.value.FEC_FIN)) {

        this.model.FEC_INI = "";
        this.model.FEC_FIN = "";

      } else {

        this.model.FEC_INI = (this.ConsultaForm.value.FEC_INI).format('DD/MM/YYYY');
        this.model.FEC_FIN = (this.ConsultaForm.value.FEC_FIN).format('DD/MM/YYYY');

      }

    } else {

      delete (this.model.FEC_INI);
      delete (this.model.FEC_FIN);

    }

    this.authService.getData(this.model).subscribe(response => {

      if (response) {

        var today = new Date();

        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        let columnasCSV = this.displayedColumns;
        columnasCSV.splice( columnasCSV.indexOf('action'), 1 );  
        this.appService.downloadFile(response, 'ReporteFE_' + date, columnasCSV, ";");
        columnasCSV.push ('action');

      }
    }, error => {
      this.authService.logout();
    });

  }

  public estadoDocumento(row) {

    const dialogRef = this.dialog.open(VisualizarEstadoDocumentoComponent, {

      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getConsultaFE();

    });

  }

  /* Manejar Errores en Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.ConsultaForm.controls[control].hasError(error);
  }

  reactiveForm() {

    this.ConsultaForm = this.fb.group({
      DOCUMENTO: [''],
      NIT_EMPRESA: [''],
      SICUFE: [true],
      NOCUFE: [false],
      FEC_INI: [''],
      FEC_FIN: [''],

    })

  }

}