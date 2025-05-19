import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../../../../_models/cliente';
import { BASE_URL, environment } from '../../../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject } from 'rxjs';
import { ClienteService } from '../../../../../_services/cliente/cliente.service';
import Swal from 'sweetalert2';
import { TipodocidentiService } from './../../../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../../../_services/users/users.service';
import { DatePipe } from '@angular/common';
import { PrestamosService } from '../../../../../_services/prestamos/prestamos.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.scss'],
  providers: [DatePipe]
})
export class EditarClienteComponent implements OnInit {



  @ViewChild(SignaturePad, { static: false }) public signaturePad: SignaturePad;

  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': window.innerWidth,
    'canvasHeight': 300
  };

  public imagePath;
  imgURL: any;
  public message: string;
  public drawStart: any;
  public webcamIndex: any;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public editFirmar: boolean = false;
  listaTipoDoc: any = {};

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

  listaTiposDocumento: [] = [];
  webcam = 0;
  tomarfoto = 0;
  currentIndexImage = 0;
  panelOpenState = false;

  public photoPath: string = environment.UPLOADS_CLIENTES;

  urlimage: any = {};


  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  tiposdocumento: any = {};
  cobradores: any = {};
  fields: FormlyFieldConfig[] = [];
  listaArchivos: any = {};

  dataImage: any = {};


  isBase64(str) {
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }

  submit() {

    if (this.form.valid) {
      this.model.id = this.data.id;
      if (this.editFirmar) {
        this.listaArchivos[3] = this.signaturePad.toDataURL();
        this.listaTipoDoc = { ...this.listaTipoDoc, 3: 3 };
      }

      this.clienteServicio.updateCliente(this.model).subscribe(

        response => {

          if (response) {
            let ltdoc;
            let imageBase64;

            this.dataImage.image = this.listaArchivos;
            this.dataImage.id_tdocadjunto = this.listaTipoDoc;
            this.dataImage.id_cliente = this.data.id;
            this.dataImage.path = environment.GET_UPLOADS_PATH;


            this.clienteServicio.editFile(this.dataImage).subscribe(
              response => {

              }
            )


            /*for (let i = 0; i < Object.keys(this.listaArchivos).length; i++) {



              if (this.listaArchivos[i] != '') {

                  let imageBase64 = this.listaArchivos[i];
                  ltdoc = this.listaTipoDoc[i];
                  this.dataImage.image = imageBase64;
                  this.dataImage.id_tdocadjunto = this.listaTipoDoc[i];
                  this.dataImage.id_cliente = response.id;
                  this.dataImage.path = environment.GET_UPLOADS_PATH;
                  this.dataImage.fileExt = 'jpeg';


                  this.clienteServicio.editFile(this.dataImage).subscribe(
                    response => {

                    }
                  )



              }

            }
          }*/




            if (response) {

              this.model = response;
              Swal.fire({
                type: 'info',
                title: 'Informaci&oacute;n',
                text: 'Se actualizo satisfactoriamente el registro.',
              }).then(
                (result) => {

                  if (result.value == true) {
                    this.dialogRef.close();
                  }

                }
              )


            }

          }
        }

      )
    }

  }

  constructor(
    public dialogRef: MatDialogRef<EditarClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    public clienteServicio: ClienteService,
    public tipodocidentiService: TipodocidentiService,
    public usersService: UsersService,
    private datePipe: DatePipe,
    public prestamosService: PrestamosService,

  ) { }


  async ngAfterViewInit() {

    this.tiposdocumento = await this.tipodocidentiService.getTipodocidenti();
    this.cobradores = await this.usersService.getUsers();



    this.fields = [


      {
        key: 'nomcliente',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.nomcliente,
        modelOptions: {
          debounce: {
            default: 2000,
          },
        },
        templateOptions: {
          label: 'Nombre Cliente',
        },
      },

      {
        key: 'id_cobrador',
        className: 'col-md-3',
        type: 'select',
        defaultValue: this.data.id_cobrador,
        modelOptions: {
          updateOn: 'blur',
        },
        templateOptions: {
          label: 'Cobrador',
          placeholder: 'Seleccione cobrador',
          required: true,
          options: this.cobradores
        },
      },
      {
        key: 'id_tipo_docid',
        className: 'col-md-3',
        type: 'select',
        defaultValue: this.data.id_tipo_docid,
        modelOptions: {
          updateOn: 'blur',
        },
        templateOptions: {
          label: 'Tipo Documento',
          required: true,
          options: this.tiposdocumento
        },
      },
      {
        key: 'numdocumento',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.numdocumento,
        modelOptions: {
          updateOn: 'submit',
        },
        templateOptions: {
          label: 'Numero Documento',
          required: true,
        },
      },

      {
        key: 'fch_expdocumento',
        className: 'col-md-4',
        defaultValue: this.data.fch_expdocumento,
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
        defaultValue: this.data.fch_nacimiento,
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
        key: 'ciudad',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.ciudad,
        modelOptions: {
          updateOn: 'submit',
        },
        templateOptions: {
          label: 'Ciudad',
          required: true,
        },
      },
      {
        key: 'telefijo',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.telefijo,
        modelOptions: {
          updateOn: 'submit',
        },
        templateOptions: {
          label: 'Telefono Fijo',

        },
      },
      {
        key: 'celular',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.celular,
        modelOptions: {
          updateOn: 'submit',
        },
        templateOptions: {
          label: 'Celular',
          required: true,
        },
      },

      {
        key: 'email',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.email,
        modelOptions: {
          updateOn: 'submit',
        },
        templateOptions: {
          label: 'Email',
          required: true,
        },
      },

      {
        key: 'direcasa',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.direcasa,
        modelOptions: {
          updateOn: 'submit',
        },
        templateOptions: {
          label: 'Dir Casa',

        },
      },


      {
        key: 'diretrabajo',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.diretrabajo,
        modelOptions: {
          updateOn: 'submit',
        },
        templateOptions: {
          label: 'Dir Trabajo',

        },
      },


      {
        key: 'ref1',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.ref1,
        modelOptions: {
          updateOn: 'submit',
        },
        templateOptions: {
          label: 'Referencia 1',

        },
      },
      {
        key: 'ref2',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.ref2,
        modelOptions: {
          updateOn: 'submit',
        },
        templateOptions: {
          label: 'Referencia 2',
        },
      },


    ];


    this.prestamosService.listaTiposDocumento().subscribe(
      response => {

        if (response) {


          this.listaTiposDocumento = response;
          Object.entries(response).forEach(([key, value]) => {

            this.listaTipoDoc[value['id']] = value['id'];
            console.log('tipodoc')
            console.log(this.listaTipoDoc)


          })





        }




      }
    )




  }
  async ngOnInit() {



    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });





    this.prestamosService.listadoArchivosCliente(this.data.id).subscribe(
      response => {
        Object.entries(response).forEach(([key, value]) => {


          this.listaArchivos[value['id_tdocadjunto']] = this.photoPath + value['nombrearchivo'];


        })
      }
    )



  }


  public triggerSnapshot(i): void {
    //////console.log ('home');
    //////console.log(i);
    this.currentIndexImage = i;
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public validateExtension(filename) {
    if (filename) {
      if (filename != "") {
        return filename.substr(filename.lastIndexOf('.') + 1)
      }
    }
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
    ////console.log ('lisra archivos');
    ////console.log (this.listaArchivos);

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

  preview(files, i) {


    if (files.length === 0)
      return;

    var mimeType = files[0].type;

    if (mimeType.match(/image\/*/) == null && mimeType.match(/application\/pdf/) == null) {
      this.message = "Solo se Aceptan, Imagenes o Documentos PDF.";
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