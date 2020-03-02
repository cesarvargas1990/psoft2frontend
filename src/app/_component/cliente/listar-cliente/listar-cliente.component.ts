import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
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
import { ListarPrestamosclienteComponent } from '../../../_component/cliente/listar-cliente/dialogs/listar-prestamoscliente/listar-prestamoscliente.component';
import { MatPaginator } from '@angular/material/paginator';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';

import { FormArray, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';


export interface TabType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'app-listar-cliente',
  templateUrl: './listar-cliente.component.html',
  styleUrls: ['./listar-cliente.component.scss']
})
export class ListarClienteComponent implements AfterViewInit {


  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(SignaturePad, { static: false }) signaturePad: SignaturePad;
  imagePath :any = {};
  imgURL :any = {};

  mobileQuery: MediaQueryList;
  webcam = 0;
  version = VERSION;
  listaArchivos: any = {};
  
  tomarfoto = 0;
  modoEdicion = false;
  

  public webcamImage: WebcamImage = null;
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': window.innerWidth,
    'canvasHeight': 300
  };

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  menuUsuario = JSON.parse(localStorage.getItem('menu_usuario'));
  urlimage: any = {};
  navItems: NavItem[] = this.menuUsuario;
  currentIndexImage = 0;
  model: any = {};
  data: any = {};
  tabs: TabType[] = [];
  datosCliente: any = [];
  listaTiposDocumento: any = {};
  listaTipoDoc: any = {};

  panelOpenState = false;
  displayedColumns: string[] = ['nomcliente', 'numdocumento', 'ciudad', 'celular','email','perfil_facebook', 'direcasa', 'diretrabajo', 'action'];
  public message: string;

  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  form = new FormArray(this.tabs.map(() => new FormGroup({})));
  options = this.tabs.map(() => <FormlyFormOptions>{});

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  submit () {

  }
  public triggerSnapshot(i): void {
    
    this.currentIndexImage = i;
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {

    this.webcam = 0;
    this.tomarfoto = 0;


    this.webcamImage = webcamImage;
    this.urlimage = this.webcamImage.imageAsDataUrl;
    this.listaArchivos[this.currentIndexImage] = this.urlimage;
    console.log('como va');
    console.log (this.listaArchivos);

  }


  drawComplete() {

  }

  drawStart() {

  }

  drawClear() {
    this.signaturePad.clear();
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

    this.clienteService.getAllClientes(this.data).subscribe(

      response => {
        this.datosCliente = response;
        let DATOS: Cliente[] = this.datosCliente;
        console.log(DATOS);
        this.dataSource = new MatTableDataSource(DATOS);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        


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
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  modalListadoCreditos (row) {

    const dialogRef = this.dialog.open(ListarPrestamosclienteComponent, {

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

  preview(files, i) {


    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {



      this.listaArchivos[i] = reader.result;


      this.imgURL = reader.result;
    }
  }

}
