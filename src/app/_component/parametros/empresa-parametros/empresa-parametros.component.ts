import { EmpresaService } from './../../../_services/empresa/empresa.service';
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
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresa-parametros',
  templateUrl: './empresa-parametros.component.html',
  styleUrls: ['./empresa-parametros.component.scss'],
})
export class EmpresaParametrosComponent implements OnInit {
  form = new FormGroup({});
  model: any = {};

  datosEmpresa: any = [];

  options: FormlyFormOptions = {};

  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse(localStorage.getItem('menu_usuario'));

  permisos = JSON.parse(localStorage.getItem('permisos'));
  navItems: NavItem[] = this.menuUsuario;

  datosFormasPago: any = [];

  fields: FormlyFieldConfig[] = [];

  constructor(
    public authService: AuthService,
    private navService: NavService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public router: Router,
    public empresaService: EmpresaService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.empresaService.getEmpresa().subscribe((response) => {
      this.datosEmpresa = response;
    });
  }

  private _mobileQueryListener: () => void;

  volver() {
    this.router.navigate(['dashboard']);
  }
  async ngOnInit() {
    this.empresaService.getEmpresa().subscribe((response) => {
      this.datosEmpresa = response;
      this.fields = [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'nombre',
              defaultValue: this.datosEmpresa.nombre,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Nombre',
                placeholder: 'Nombre de la empresa',
                required: true,
              },
            },

            {
              key: 'nit',
              defaultValue: this.datosEmpresa.nitempresa,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Nit',
                placeholder: 'Nit',
                required: true,
              },
            },

            {
              key: 'vlr_capinicial',
              defaultValue: this.datosEmpresa.vlr_capinicial,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Capital Inicial',
                placeholder: 'Valor de capital inicial',
                required: true,
              },
            },

            {
              key: 'email',
              defaultValue: this.datosEmpresa.email,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Email',
                placeholder: 'Email',
              },
            },

            {
              key: 'pagina',
              defaultValue: this.datosEmpresa.pagina,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Pagina Web',
                placeholder: 'Pagina web',
              },
            },

            {
              key: 'telefono',
              defaultValue: this.datosEmpresa.telefono,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Teléfono',
                placeholder: 'Teléfono',
              },
            },

            {
              key: 'ciudad',
              defaultValue: this.datosEmpresa.ciudad,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Ciudad',
                placeholder: 'Ciudad',
              },
            },

            {
              key: 'ddirec',
              defaultValue: this.datosEmpresa.ddirec,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Dirección',
                placeholder: 'Dirección',
              },
            },
          ],
        },
      ];
    });

    console.log('los datos empresa');
    console.log(this.datosEmpresa);

    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  submit() {
    if (this.form.valid) {
      console.log(this.model);

      this.empresaService
        .actualizarDatosEmpresa(this.form.value)
        .subscribe((response) => {
          if (response) {
            Swal.fire({
              type: 'info',
              title: 'Informaci&oacute;n',
              text: 'Se actualizo satisfactoriamente la información de la empresa.',
            }).then((result) => {});
          }
        });
    } else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Por favor valide los campos obligatorios, para guardar la información de la empresa.',
      });
    }
  }

  async ngAfterViewInit() {}
}
