import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef, AfterViewInit, ViewContainerRef } from '@angular/core';
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
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../_services/users/users.service';
import Swal from 'sweetalert2';
import { PrestamosService } from '../../../_services/prestamos/prestamos.service';

import { FormArray, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

export interface TabType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.scss']
})
export class CrearClienteComponent implements AfterViewInit {


  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
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
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();



  @ViewChild(SignaturePad, { static: false }) signaturePad: SignaturePad;

  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': window.innerWidth,
    'canvasHeight': 300
  };

  panelOpenState = false;

  public imagePath;
  imgURL: any;
  public message: string;

  modoEdicion = false;
  listaArchivos: any = {};
  listaTipoDoc: any = {};
  lista: string[] = ["hola", "que", "tal", "estas"];
  listaTiposDocumento: any = {};
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
                  default: 2000,
                },
              },
              templateOptions: {
                label: 'Nombre del cliente',
                placeholder: 'Ingrese nombre del cliente',
                required: true
              },
            },

            {
              key: 'id_cobrador',
              className: 'col-md-4',
              type: 'select',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Cobrador',
                placeholder: 'Seleccione cobrador',
                required: true,
                options: this.usersService.getUsers()
              },
            },
            {
              key: 'codtipdocid',
              className: 'col-md-4',
              type: 'select',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Tipo Documento',
                placeholder: 'Seleccione Tipo documento',
                required: true,
                options: this.tipodocidentiService.getTipodocidenti()
              },
            },
            {
              key: 'numdocumento',
              className: 'col-md-4',
              type: 'input',

              modelOptions: {
                updateOn: 'blur',

              },
              templateOptions: {
                label: 'Numero Documento',
                placeholder: 'Numero Documento',
                required: true,
              },
            },
            {
              key: 'fch_expdocumento',
              className: 'col-md-4',
              type: 'datepicker',

              modelOptions: {
                updateOn: 'blur',

              },
              templateOptions: {
                label: 'Fecha Expedicion',
                placeholder: 'Fecha Expedicion',
                required: true,
              },
            },

            {
              key: 'fch_nacimiento',
              className: 'col-md-4',
              type: 'datepicker',

              modelOptions: {
                updateOn: 'blur',

              },
              templateOptions: {
                label: 'Fecha Nacimiento',
                placeholder: 'Fecha Nacimiento',
                required: true,
              },
            },

          
           
           


            {
              key: 'email',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Email',
                required: true,
              },
            },

            {
              key: 'perfil_facebook',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Perfil Facebook',
                required: true

              },
            },

            

          ]

        }
      ],
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
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Ciudad',
                required: true,
              },
            },
            {
              key: 'telefijo',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Telefono Fijo',

              },
            },
            {
              key: 'celular',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Celular',
                required: true,
              },
            },

            {
              key: 'direcasa',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Dir Casa',
                required_: true

              },
            },

            {
              key: 'diretrabajo',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Dir Trabajo',

              },
            },



          ]

        }
      ],
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
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Referencia 1',

              },
            },
            {
              key: 'ref2',
              className: 'col-md-4',
              type: 'input',
              modelOptions: {
                updateOn: 'blur',
              },
              templateOptions: {
                label: 'Referencia 2',
              },
            },

          ]

        }

      ],
    },
  ];

  form = new FormArray(this.tabs.map(() => new FormGroup({})));
  options = this.tabs.map(() => <FormlyFormOptions>{});


  tiposdocumento: any = {};
  cobradores: any = {};

  fields: FormlyFieldConfig[] = [];


  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse(localStorage.getItem('menu_usuario'));

  navItems: NavItem[] = this.menuUsuario;


  datosCliente: any = [];


  constructor(
    public authService: AuthService,
    private navService: NavService,
    public clienteService: ClienteService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public router: Router,
    public tipodocidentiService: TipodocidentiService,
    public usersService: UsersService,
    public prestamosService: PrestamosService

  ) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  private _mobileQueryListener: () => void;


  async ngOnInit() {



    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });



    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API



    this.mobileQuery.removeListener(this._mobileQueryListener);



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
    console.log('como va');
    console.log (this.listaArchivos);

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

    this.prestamosService.listaTiposDocumento().subscribe(
      response => {

        this.listaTiposDocumento = response;
      }
    )

  }


  async ngAfterViewInit() {

    this.tiposDocumentos();



    this.navService.appDrawer = this.appDrawer;



  }


  drawComplete() {

  }

  drawStart() {

  }


  drawClear() {
    this.signaturePad.clear();
  }

  submit() {


    if (this.form.valid) {

      this.clienteService.saveCliente(this.model).subscribe(

        response => {


          if (response) {

            this.model = response;
            Swal.fire({
              type: 'info',
              title: 'Informaci&oacute;n',
              text: 'Se registro satisfactoriamente el cliente.',
            }).then(
              (result) => {

                if (result.value == true) {


                  let ltdoc;

                  for (let i = 0; i < Object.keys(this.listaArchivos).length; i++) {


                    let imageBase64 = this.listaArchivos[i];
                    ltdoc = this.listaTipoDoc[i];


                    if (this.listaArchivos[i] != '') {
                      this.data.image = imageBase64;
                      this.data.id_tdocadjunto = this.listaTipoDoc[i];
                      this.data.id_cliente = response.id;
                      this.data.path =  './upload/documentosAdjuntos/';
                      

                      this.clienteService.uploadFile(this.data).subscribe(
                        response => {
                          console.log(response);
                        }
                      )
                    }

                  }

                  this.model = response;
                  this.router.navigate(['/clientes/listar']);
                }

              }
            )

          }

        }

      )

    } else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Por favor valide los campos obligatorios, para guardar el cliente.',
      })
    }



  }

  preview(files, i) {


    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    
    if (mimeType.match(/image\/*/) || (mimeType.match(/application\/pdf/) == null)) {
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
