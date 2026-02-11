import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';

import { NavItem } from '../../../_models/nav-item';
import { NavService } from '../../../_services/nav.service';
import { VERSION } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../_services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { documento } from '../../../_models/documento';
import { ClienteService } from '../../../_services/cliente/cliente.service';
import { PrestamosService } from '../../../_services/prestamos/prestamos.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../_services/users/users.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-documento',
  templateUrl: './crear-documento.component.html',
  styleUrls: ['./crear-documento.component.scss'],
})
export class CrearDocumentoComponent implements AfterViewInit {
  html = ``;
  config: any = {};
  templates: any = {};

  form = new FormGroup({});
  model: any = {};

  options: FormlyFormOptions = {};

  tiposdocumento: any = {};
  cobradores: any = {};
  periodospago: any = {};

  fields: FormlyFieldConfig[] = [];

  documentoPlantilla: any = {};
  modoEdicion = false;
  editItem = false;

  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse(localStorage.getItem('menu_usuario'));
  permisos = JSON.parse(localStorage.getItem('permisos'));
  navItems: NavItem[] = this.menuUsuario;

  datosFormasPago: any = [];

  displayedColumns: string[] = ['nombre', 'action'];

  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public authService: AuthService,
    private navService: NavService,
    public clienteService: ClienteService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public router: Router,
    public tipodocidentiService: TipodocidentiService,
    public usersService: UsersService,
    public prestamosService: PrestamosService,
    public dialog: MatDialog,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  ngOnInit() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  async ngAfterViewInit() {
    this.prestamosService.listaVariablesPlantillas().subscribe((response) => {
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
        templates: response,
        init_instance_callback() {},
        content_css: [
          '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
          '//www.tinymce.com/css/codepen.min.css',
        ],
      };
    });

    this.navService.appDrawer = this.appDrawer;

    this.fields = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'nombre',
            className: 'col-md-6',
            type: 'input',
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Nombre plantilla',
              required: true,
            },
          },
        ],
      },
    ];

    this.getDatosDocumentos();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminarDocumentoPlantilla(row) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Desea eliminar el registro?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!',
    }).then((result) => {
      if (result.value == true) {
        this.prestamosService.deleteDocumentoPlantilla(row).subscribe(
          (response) => {
            Swal.fire({
              type: 'info',
              title: 'Informaci&oacute;n',
              text: 'Se elimino satisfactoriamente el registro.',
            });

            this.getDatosDocumentos();
          },
          (error) => {
            console.log(error);
            Swal.fire({
              type: 'error',
              title: 'Error',
              text: error,
            });
          },
        );
      }
    });
  }

  guardarFormaPago() {
    this.prestamosService.guardarDocumento(this.model).subscribe((response) => {
      this.model = response;
      console.log(response);
      // this.router.navigate(['/prestamos/listar']);
    });
  }

  submit() {
    if (this.form.valid) {
      if (this.html == '') {
        Swal.fire(
          'Error',
          'El contenido de la plantilla no puede estar vacio',
          'error',
        );
        return false;
      }
      // console.log(this.model);
      this.model.plantilla_html = this.html;
      console.log(this.model);
      this.prestamosService
        .guardarDocumento(this.model)
        .subscribe((response) => {
          this.model = response;
          // console.log (response);
          this.getDatosDocumentos();

          Swal.fire({
            type: 'info',
            title: 'Informaci&oacute;n',
            text: 'Se crea satisfactoriamente el documento.',
          });
          // this.router.navigate(['/formaspago/listar']);
        });
    } else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Por favor valide los campos obligatorios, para guardar la forma de pago.',
      });
    }
  }

  getDatosDocumentos() {
    this.prestamosService.consultaPlantillasDocumentos().subscribe(
      (response) => {
        this.datosFormasPago = response;
        const DATOS: documento[] = this.datosFormasPago;
        console.log(DATOS);
        this.dataSource = new MatTableDataSource(DATOS);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        this.authService.logout();
      },
    );
  }

  modalEditarFormaPago(row: any[]): void {
    console.log(row);
    /* const dialogRef = this.dialog.open(EditarDocumentoComponent, {
       height: '800px',
      width: '1800px',
      data: row
    }); */

    /* dialogRef.afterClosed().subscribe(result => {

      this.getDatosDocumentos ();

    }); */
  }

  volver() {
    this.modoEdicion = false;
    // this.router.navigate(['/dashboard']);
  }

  editarDocumento(row) {
    this.html = row.plantilla_html;
    this.model.nombre = row.nombre;
    this.model.id = row.id;
  }

  editarPlantilla() {
    if (this.form.valid) {
      // this.model.id = this.data.id;
      this.documentoPlantilla.id = this.model.id;
      this.documentoPlantilla.nombre = this.model.nombre;
      this.documentoPlantilla.plantilla_html = this.html;

      console.log(this.documentoPlantilla);
      console.log(this.documentoPlantilla);
      this.prestamosService
        .updatePlantillaDocumento(this.documentoPlantilla)
        .subscribe((response) => {
          console.log(response);

          if (response) {
            this.model = response;
            Swal.fire({
              type: 'info',
              title: 'Informaci&oacute;n',
              text: 'Se actualizo satisfactoriamente el registro.',
            }).then((result) => {
              if (result.value == true) {
                // this.dialogRef.close();
                this.getDatosDocumentos();
              }
            });
          }
        });
    }
  }
}
