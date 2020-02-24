import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';


import { NavItem } from '../../../_models/nav-item';
import { NavService } from '../../../_services/nav.service';
import { VERSION } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../_services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from '../../../_models/cliente';
import { ClienteService } from '../../../_services/cliente/cliente.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditarClienteComponent } from '../.././../_component/cliente/listar-cliente/dialogs/editar-cliente/editar-cliente.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-cliente',
  templateUrl: './listar-cliente.component.html',
  styleUrls: ['./listar-cliente.component.scss']
})
export class ListarClienteComponent implements AfterViewInit {


  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse(localStorage.getItem('menu_usuario'));

  navItems: NavItem[] = this.menuUsuario;

  model: any = {};

  datosCliente: any = [];


  displayedColumns: string[] = ['nomcliente', 'codtipdocid', 'numdocumento', 'ciudad', 'telefijo', 'celular', 'direcasa', 'diretrabajo', 'action'];


  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  constructor(
    public authService: AuthService,
    private navService: NavService,
    public clienteService: ClienteService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public dialog: MatDialog,
    public router: Router
  ) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  private _mobileQueryListener: () => void;

  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.getDatosCliente();

  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  getDatosCliente() {

    this.clienteService.getAllClientes().subscribe(

      response => {
        this.datosCliente = response;
        let DATOS: Cliente[] = this.datosCliente;
        console.log(DATOS);
        this.dataSource = new MatTableDataSource(DATOS);
        this.dataSource.sort = this.sort;

      }, error => {
        this.authService.logout();
      }
    )


  }

  modalEditarCliente(row: any[]) {

    const dialogRef = this.dialog.open(EditarClienteComponent, {

      data: row
    });
    // Subscribirme al evento de cerrar el cuadro de dialogo
    dialogRef.afterClosed().subscribe(result => {
      this.getDatosCliente();

    });
  }

  modalEliminarCliente(row) {

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


        this.clienteService.deleteCliente(row).subscribe(


          response => {

            Swal.fire({
              type: 'info',
              title: 'Informaci&oacute;n',
              text: 'Se elimino satisfactoriamente el registro.',
            })

            this.getDatosCliente();

          }, error => {

            console.log(error);
            Swal.fire({
              type: 'error',
              title: 'Error',
              text: error,
            })

          }
        )



      }

    })
  }

  modalAdicionarEmpresa() {
    this.router.navigate(['clientes/crear']);
  }

}
