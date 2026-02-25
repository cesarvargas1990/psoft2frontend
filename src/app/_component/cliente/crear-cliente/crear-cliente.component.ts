import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  ViewContainerRef,
  Optional,
  Inject
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { NavItem } from '../../../_models/nav-item';
import { NavService } from '../../../_services/nav.service';
import { VERSION } from '@angular/material/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../../../_services/auth.service';
import { ClienteService } from '../../../_services/cliente/cliente.service';
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../_services/users/users.service';
import Swal from 'sweetalert2';
import { PrestamosService } from '../../../_services/prestamos/prestamos.service';

import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { environment } from '../../../../environments/environment';
import { SessionStateService } from '../../../core/session/session-state.service';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';

export interface TabType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  standalone: false,
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.scss']
})
export class CrearClienteComponent implements AfterViewInit {
  public isDialogMode = false;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public webcamIndex: any;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  @ViewChild('signaturePadRef') public signaturePad: any;

  public signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    minWidth: 1,
    maxWidth: 2,
    canvasWidth: window.innerWidth,
    canvasHeight: 300
  };

  panelOpenState = false;

  public imagePath;
  imgURL: any;
  public message: string;
  public sign = false;
  modoEdicion = false;
  listaArchivos: any = [];
  listaTipoDoc: any = [];
  selectedFileNames: any = [];
  lista: string[] = ['hola', 'que', 'tal', 'estas'];
  listaTiposDocumento: any[] = [];
  webcam = 0;
  tomarfoto = 0;
  currentIndexImage = 0;

  urlimage: any = {};

  model: any = {};
  data: any = {};

  tabs: TabType[] = [
    {
      label: 'Datos Personales',
      fields: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'nomcliente',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                debounce: {
                  default: 2000
                }
              },
              templateOptions: {
                label: 'Nombre del cliente',
                placeholder: 'Ingrese nombre del cliente',
                required: true
              }
            },

            {
              key: 'id_cobrador',
              className: 'col-md-4',
              type: 'select',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Cobrador',
                placeholder: 'Seleccione cobrador',
                required: true,
                options: this.usersService.getUsers()
              }
            },
            {
              key: 'id_tipo_docid',
              className: 'col-md-4',
              type: 'select',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Tipo Documento',
                placeholder: 'Seleccione Tipo documento',
                required: true,
                options: this.tipodocidentiService.getTipodocidenti()
              }
            },
            {
              key: 'numdocumento',
              className: 'col-md-4',
              type: 'input',

              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Numero Documento',
                placeholder: 'Numero Documento',
                required: true
              }
            },
            {
              key: 'fch_expdocumento',
              className: 'col-md-4',
              type: 'datepicker',

              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Fecha Expedicion',
                placeholder: 'Fecha Expedicion'
              }
            },

            {
              key: 'fch_nacimiento',
              className: 'col-md-4',
              type: 'datepicker',

              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Fecha Nacimiento',
                placeholder: 'Fecha Nacimiento',
                required: true
              }
            },

            {
              key: 'email',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Email',
                required: true
              }
            }
          ]
        }
      ]
    },
    {
      label: 'Datos Contacto',
      fields: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'ciudad',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Ciudad',
                required: true
              }
            },
            {
              key: 'telefijo',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Telefono Fijo'
              }
            },
            {
              key: 'celular',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Celular',
                required: true
              }
            },

            {
              key: 'direcasa',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Dir Casa',
                required_: true
              }
            },

            {
              key: 'diretrabajo',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Dir Trabajo'
              }
            }
          ]
        }
      ]
    },

    {
      label: 'Referencias',
      fields: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'ref1',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Referencia 1'
              }
            },
            {
              key: 'ref2',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur'
              },
              templateOptions: {
                label: 'Referencia 2'
              }
            }
          ]
        }
      ]
    }
  ];

  form = new UntypedFormArray(this.tabs.map(() => new UntypedFormGroup({})));
  options = this.tabs.map(() => ({}) as FormlyFormOptions);

  tiposdocumento: any = {};
  cobradores: any = {};

  fields: FormlyFieldConfig[] = [];

  @ViewChild('appDrawer') appDrawer: ElementRef;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario: unknown = [];

  navItems: NavItem[] = [];

  datosCliente: any = [];

  constructor(
    public authService: AuthService,
    private navService: NavService,
    public clienteService: ClienteService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public router: Router,
    private readonly sessionState: SessionStateService,
    public tipodocidentiService: TipodocidentiService,
    public usersService: UsersService,
    public prestamosService: PrestamosService,
    @Optional() public dialogRef?: MatDialogRef<CrearClienteComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: any
  ) {
    this.menuUsuario = this.sessionState.parseStoredJson('menu_usuario', []);
    this.navItems = this.sessionState.getMenuItems();

    this.isDialogMode = !!this.dialogRef;
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
  }

  private _mobileQueryListener: () => void;

  async ngOnInit() {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );

    if (this.mobileQuery.removeEventListener) {
      this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    } else {
      const legacyRemoveListener = (this.mobileQuery as any).removeListener as
        | ((listener: () => void) => void)
        | undefined;
      legacyRemoveListener?.(this._mobileQueryListener);
    }
  }

  public triggerSnapshot(i): void {
    this.currentIndexImage = i;
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcam = 0;
    this.tomarfoto = 0;

    this.webcamImage = webcamImage;
    this.urlimage = this.webcamImage.imageAsDataUrl;
    this.listaArchivos[this.currentIndexImage] = this.urlimage;
    this.selectedFileNames[this.currentIndexImage] = 'Captura de cámara';
    console.log('como va');
    console.log(this.listaArchivos);
  }

  onFileChange(files: FileList, index: number, tipoDocumentoId: number): void {
    this.webcamIndex = null;
    this.webcam = 0;
    this.tomarfoto = 0;
    this.listaTipoDoc[index] = tipoDocumentoId;
    this.listaArchivos[index] = '';
    this.message = '';

    if (!files || files.length === 0) {
      this.selectedFileNames[index] = '';
      return;
    }

    this.selectedFileNames[index] = files[0].name;
    this.preview(files, index);
  }

  clearSelectedFile(index: number): void {
    this.listaArchivos[index] = '';
    this.selectedFileNames[index] = '';
    this.message = '';
  }

  isPdfFile(index: number): boolean {
    const fileData = this.listaArchivos[index];
    return (
      typeof fileData === 'string' &&
      fileData.startsWith('data:application/pdf')
    );
  }

  getSelectedFileName(index: number): string {
    return this.selectedFileNames[index] || 'Ningún archivo seleccionado';
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  async tiposDocumentos() {
    this.prestamosService.listaTiposDocumento().subscribe((response) => {
      this.listaTiposDocumento = response;
    });
  }

  async ngAfterViewInit() {
    this.tiposDocumentos();

    this.navService.appDrawer = this.appDrawer;
  }

  drawComplete() {
    this.sign = true;
  }

  drawStart() {
    this.sign = true;
  }

  drawClear() {
    this.signaturePad.clear();
    this.sign = false;
  }

  submit() {
    if (this.form.valid) {
      this.clienteService.saveCliente(this.model).subscribe((response) => {
        if (response) {
          this.model = response;
          Swal.fire({
            type: 'info',
            title: 'Informaci&oacute;n',
            text: 'Se registro satisfactoriamente el cliente.'
          }).then((result) => {
            if (result.value == true) {
              let ltdoc;

              for (let i = 0; i < Object.keys(this.listaArchivos).length; i++) {
                const imageBase64 = this.listaArchivos[i];
                ltdoc = this.listaTipoDoc[i];

                if (this.listaArchivos[i] != '') {
                  this.data.image = imageBase64;
                  this.data.id_tdocadjunto = this.listaTipoDoc[i];
                  this.data.id_cliente = response.id;
                  this.data.path = environment.GET_UPLOADS_PATH;

                  this.clienteService
                    .uploadFile(this.data)
                    .subscribe((response) => {
                      console.log(response);
                    });
                }
              }
              if (this.sign) {
                this.data.image = this.signaturePad.toDataURL();
                this.data.id_tdocadjunto = 3;
                this.data.id_cliente = response.id;
                this.data.path = environment.GET_UPLOADS_PATH;
                this.clienteService
                  .uploadFile(this.data)
                  .subscribe((response) => {
                    console.log(response);
                  });
                console.log(this.signaturePad.toDataURL());
              }

              this.model = response;
              if (this.isDialogMode) {
                this.dialogRef.close(response);
              } else {
                this.router.navigate(['/clientes/listar']);
              }
            }
          });
        }
      });
    } else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Por favor valide los campos obligatorios, para guardar el cliente.'
      });
    }
  }

  preview(files, i) {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;

    if (
      mimeType.match(/image\/*/) == null &&
      mimeType.match(/application\/pdf/) == null
    ) {
      this.message = 'Solo se Aceptan, Imagenes o Documentos PDF.';
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.listaArchivos[i] = reader.result;

      this.imgURL = reader.result;
    };
  }

  public validateExtension(filename) {
    if (filename) {
      if (filename != '') {
        return filename.substr(filename.lastIndexOf('.') + 1);
      }
    }
  }

  volver() {
    if (this.isDialogMode) {
      this.dialogRef.close();
      return;
    }

    this.router.navigate(['/dashboard']);
  }
}
