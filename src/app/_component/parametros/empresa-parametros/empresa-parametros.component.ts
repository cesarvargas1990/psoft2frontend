import { EmpresaService } from './../../../_services/empresa/empresa.service';
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { NavItem } from '../../../_models/nav-item';
import { NavService } from '../../../_services/nav.service';
import { VERSION } from '@angular/material/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../../../_services/auth.service';

import Swal from 'sweetalert2';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';

import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SessionStateService } from '../../../core/session/session-state.service';

@Component({
  standalone: false,
  selector: 'app-empresa-parametros',
  templateUrl: './empresa-parametros.component.html',
  styleUrls: ['./empresa-parametros.component.scss']
})
export class EmpresaParametrosComponent implements OnInit, OnDestroy {
  form = new UntypedFormGroup({});
  model: any = {};
  firmaPreview = '';
  firmaMensaje = '';
  firmaBase64 = '';
  firmaCambiada = false;
  firmaFileName = '';

  datosEmpresa: any = [];

  options: FormlyFormOptions = {};

  @ViewChild('appDrawer') appDrawer: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario: unknown = [];

  permisos: string[] = [];
  navItems: NavItem[] = [];

  datosFormasPago: any = [];

  fields: FormlyFieldConfig[] = [];

  constructor(
    public authService: AuthService,
    private readonly navService: NavService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public router: Router,
    public empresaService: EmpresaService,
    private readonly sessionState: SessionStateService
  ) {
    this.menuUsuario = this.sessionState.parseStoredJson('menu_usuario', []);
    this.permisos = this.sessionState.getPermissions();
    this.navItems = this.sessionState.getMenuItems();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    } else {
      const legacyAddListener = (this.mobileQuery as any).addListener as
        | ((listener: () => void) => void)
        | undefined;
      legacyAddListener?.(this._mobileQueryListener);
    }

    this.empresaService.getEmpresa().subscribe((response) => {
      this.datosEmpresa = response;
    });
  }

  private readonly _mobileQueryListener: () => void;

  volver() {
    this.router.navigate(['dashboard']);
  }
  ngOnInit(): void {
    this.empresaService.getEmpresa().subscribe((response) => {
      this.datosEmpresa = response;
      this.firmaPreview = this.construirPreviewFirma(
        this.datosEmpresa.firma || ''
      );
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
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Nombre',
                placeholder: 'Nombre de la empresa',
                required: true
              }
            },

            {
              key: 'nit',
              defaultValue: this.datosEmpresa.nitempresa,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Nit',
                placeholder: 'Nit',
                required: true
              }
            },

            {
              key: 'vlr_capinicial',
              defaultValue: this.datosEmpresa.vlr_capinicial,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Capital Inicial',
                placeholder: 'Valor de capital inicial',
                required: true
              }
            },

            {
              key: 'email',
              defaultValue: this.datosEmpresa.email,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Email',
                placeholder: 'Email'
              }
            },

            {
              key: 'pagina',
              defaultValue: this.datosEmpresa.pagina,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Pagina Web',
                placeholder: 'Pagina web'
              }
            },

            {
              key: 'telefono',
              defaultValue: this.datosEmpresa.telefono,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Teléfono',
                placeholder: 'Teléfono'
              }
            },

            {
              key: 'ciudad',
              defaultValue: this.datosEmpresa.ciudad,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Ciudad',
                placeholder: 'Ciudad'
              }
            },

            {
              key: 'ddirec',
              defaultValue: this.datosEmpresa.ddirec,
              className: 'col-md-6',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Dirección',
                placeholder: 'Dirección'
              }
            }
          ]
        }
      ];
    });

    console.log('los datos empresa');
    console.log(this.datosEmpresa);
  }

  ngOnDestroy(): void {
    if (this.mobileQuery.removeEventListener) {
      this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    } else {
      const legacyRemoveListener = (this.mobileQuery as any).removeListener as
        | ((listener: () => void) => void)
        | undefined;
      legacyRemoveListener?.(this._mobileQueryListener);
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.firmaCambiada) {
        if (this.firmaBase64) {
          const dataFile: any = {
            image: this.firmaBase64,
            path: environment.GET_UPLOADS_PATH
          };

          this.empresaService
            .subirArchivoFirma(dataFile)
            .subscribe((fileResp) => {
              const rutaFirma = this.extraerRutaFirma(fileResp);
              if (!rutaFirma) {
                Swal.fire({
                  type: 'error',
                  title: 'Error',
                  text: 'No se pudo obtener la ruta de la firma cargada.'
                });
                return;
              }

              this.enviarActualizacionEmpresa(rutaFirma);
            });
          return;
        }

        this.enviarActualizacionEmpresa('');
        return;
      }

      this.enviarActualizacionEmpresa(
        this.datosEmpresa.firma || this.firmaPreview
      );
    } else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Por favor valide los campos obligatorios, para guardar la información de la empresa.'
      });
    }
  }

  previewFirma(files: FileList) {
    if (!files || files.length === 0) {
      this.firmaFileName = '';
      return;
    }

    const mimeType = files[0].type;
    if (/image\/*/.exec(mimeType) == null) {
      this.firmaMensaje = 'Solo se aceptan imágenes.';
      this.firmaFileName = '';
      return;
    }

    this.firmaFileName = files[0].name;

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.firmaPreview = reader.result as string;
      this.firmaBase64 = reader.result as string;
      this.firmaCambiada = true;
      this.firmaMensaje = '';
    };
  }

  limpiarFirma(inputFile?: HTMLInputElement) {
    this.firmaPreview = '';
    this.firmaBase64 = '';
    this.firmaFileName = '';
    this.firmaCambiada = true;
    this.firmaMensaje = '';

    if (inputFile) {
      inputFile.value = '';
    }
  }

  getFirmaFileName(): string {
    return this.firmaFileName || 'Ningún archivo seleccionado';
  }

  private enviarActualizacionEmpresa(firmaRuta: string) {
    const data = {
      ...this.form.value,
      firma: this.normalizarRutaFirma(firmaRuta) || null
    };

    this.empresaService.actualizarDatosEmpresa(data).subscribe((response) => {
      if (response) {
        this.datosEmpresa.firma = data.firma;
        this.firmaPreview = this.construirPreviewFirma(data.firma);
        this.firmaBase64 = '';
        this.firmaCambiada = false;

        Swal.fire({
          type: 'info',
          title: 'Informaci&oacute;n',
          text: 'Se actualizo satisfactoriamente la información de la empresa.'
        }).then((result) => {});
      }
    });
  }

  private extraerRutaFirma(response: any): string {
    if (!response) {
      return '';
    }

    if (typeof response === 'string') {
      if (this.tieneNombreArchivo(response)) {
        return this.normalizarRutaDesdeArchivo(response);
      }
      return '';
    }

    const payload =
      response.data || response.result || response.respuesta || response;

    if (typeof payload === 'string') {
      if (this.tieneNombreArchivo(payload)) {
        return this.normalizarRutaDesdeArchivo(payload);
      }
      return '';
    }

    if (Array.isArray(payload) && payload.length > 0) {
      return this.extraerRutaFirma(payload[0]);
    }

    const rutaDirecta =
      payload.firma ||
      payload.ruta ||
      payload.url ||
      payload.file ||
      payload.filename ||
      payload.nombrearchivo ||
      payload.path;

    if (rutaDirecta && this.tieneNombreArchivo(String(rutaDirecta))) {
      return this.normalizarRutaDesdeArchivo(String(rutaDirecta));
    }

    const nombreArchivo =
      payload.nombrearchivo ||
      payload.filename ||
      payload.fileName ||
      payload.name;
    const rutaBase = payload.path || payload.basePath || payload.uploadPath;

    if (nombreArchivo && this.tieneNombreArchivo(String(nombreArchivo))) {
      const base = rutaBase || environment.GET_UPLOADS_PATH;
      const rutaCompuesta = `${base}/${nombreArchivo}`.split('//').join('/');
      return this.normalizarRutaFirma(rutaCompuesta);
    }

    return '';
  }

  private tieneNombreArchivo(valor: string): boolean {
    if (!valor) {
      return false;
    }

    return /\.[a-z0-9]{2,5}(\?.*)?$/i.test(valor);
  }

  private normalizarRutaFirma(ruta: string): string {
    if (!ruta) {
      return '';
    }

    if (ruta.startsWith('data:')) {
      return '';
    }

    const uploadIndex = ruta.indexOf('upload/');
    if (uploadIndex >= 0) {
      return ruta.substring(uploadIndex);
    }

    const documentosAdjuntosIndex = ruta.indexOf('documentosAdjuntos/');
    if (documentosAdjuntosIndex >= 0) {
      return 'upload/' + ruta.substring(documentosAdjuntosIndex);
    }

    return ruta;
  }

  private normalizarRutaDesdeArchivo(rutaArchivo: string): string {
    if (
      rutaArchivo.includes('upload/') ||
      rutaArchivo.includes('documentosAdjuntos/') ||
      rutaArchivo.startsWith('http')
    ) {
      return this.normalizarRutaFirma(rutaArchivo);
    }

    return this.normalizarRutaFirma(
      `${environment.GET_UPLOADS_PATH}${rutaArchivo}`
    );
  }

  private construirPreviewFirma(ruta: string): string {
    if (!ruta) {
      return '';
    }

    if (ruta.startsWith('http') || ruta.startsWith('data:')) {
      return ruta;
    }

    const rutaNormalizada = this.normalizarRutaFirma(ruta);
    const segmentos = rutaNormalizada.split('/');
    const nombreArchivo = segmentos[segmentos.length - 1];

    if (!this.tieneNombreArchivo(nombreArchivo)) {
      return ruta;
    }

    return `${environment.UPLOADS_CLIENTES}${nombreArchivo}`;
  }
}
