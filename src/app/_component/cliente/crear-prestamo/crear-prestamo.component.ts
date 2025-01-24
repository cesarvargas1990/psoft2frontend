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
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService } from '../../../_services/users/users.service';
import Swal from 'sweetalert2';
import { PrestamosService } from '../../../_services/prestamos/prestamos.service';
import { MatTabsModule } from '@angular/material/tabs';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-prestamo',
  templateUrl: './crear-prestamo.component.html',
  styleUrls: ['./crear-prestamo.component.scss']
})
export class CrearPrestamoComponent implements AfterViewInit {

  panelOpenState = false;
  plantillas_html: any = {};
  config: any = {};
  listarDocumentosPrestamo = false;

  form = new FormGroup({});
  model: any = {};

  options: FormlyFormOptions = {};

  tiposdocumento: any = {};
  cobradores: any = {};
  formaspago: any = {};

  sistemaspago: any = {};

  mostrarTablaResumen = false;

  tableCuotasPrestamo: any[] = [
  ];

  fields: FormlyFieldConfig[] = [];



  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse(localStorage.getItem('menu_usuario'));

  navItems: NavItem[] = this.menuUsuario;
  contenidoCombinado: string = '';


  datosCliente: any = [];
  listaClientes: any = [];


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


  ngOnInit() {

    this.mobileQuery.removeListener(this._mobileQueryListener);

  }

  volver() {
    this.router.navigate(['/dashboard']);
  }

  async ngAfterViewInit() {


    this.config = {
      height: 500,
      theme: 'modern',
      // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
      plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern',
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
      image_advtab: true,
      imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
      init_instance_callback: function () { },
      content_css: [
        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        '//www.tinymce.com/css/codepen.min.css'
      ]
    }

    this.tiposdocumento = await this.tipodocidentiService.getTipodocidenti();
    this.cobradores = await this.usersService.getUsers();
    this.listaClientes = await this.clienteService.getClientes();
    this.formaspago = await this.prestamosService.getFormasPago();
    this.sistemaspago = await this.prestamosService.getSistemaPrestamo();
    console.log('los clientes');
    console.log(this.listaClientes);



    this.navService.appDrawer = this.appDrawer;


    this.fields = [


      {

        fieldGroupClassName: 'row',
        fieldGroup: [

          {
            key: 'id_cliente',
            className: 'col-md-4',
            type: 'select',
            modelOptions: {
              updateOn: 'blur',
              debounce: {
                default: 2000,
              },
            },
            templateOptions: {
              label: 'Nombre Cliente',
              required: true,
              options: this.listaClientes
            },
          },

          {
            key: 'id_forma_pago',
            className: 'col-md-4',
            type: 'select',
            modelOptions: {
              updateOn: 'blur',
              debounce: {

                default: 2000,
              },
            },
            templateOptions: {
              label: 'Forma de pago',
              options: this.formaspago,
              required: true,
              change: (field, $event) => {

                this.form.get('porcint').setValue('');

                this.form.get('numcuotas').setValue('');
                this.form.get('valorpres').setValue('');

                console.log(field);
                console.log($event.value);
                this.prestamosService.consultaFormaPago($event.value).subscribe(
                  response => {
                    console.log(response);
                    if (response) {
                      this.form.updateValueAndValidity();
                    }
                  }
                )
              }
            },
          },

          {
            key: 'id_sistema_pago',
            className: 'col-md-4',
            type: 'select',
            modelOptions: {
              updateOn: 'blur',
              debounce: {
                default: 2000,
              },
            },
            templateOptions: {
              label: 'Sistema de pago',
              options: this.sistemaspago,
              required: true,
              change: (field, $event) => {
                this.prestamosService.pstiposistemaprest().subscribe(
                  response => {
                    if (response) {
                      this.form.updateValueAndValidity();
                    }

                  }
                )
              }
            },
          },
          {
            key: 'valorpres',
            className: 'col-md-4',
            type: 'input',
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Valor del prestamo',
              required: true,
              pattern: /^[0-9]*\.?[0-9]*$/,
              minLength: 5,
              maxLength: 11
            },

            validation: {
              messages: {
                pattern: (error, field: FormlyFieldConfig) => `"${field.formControl.value}" no es un n\u00FAmero valido`,
              },
            },
          },




          {
            key: 'numcuotas',
            className: 'col-md-4',
            type: 'input',
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Numero de cuotas',
              required: true,
              pattern: /^[0-9]*\.?[0-9]*$/,

              minLength: 1,
              maxLength: 3
            },
            validation: {
              messages: {
                pattern: (error, field: FormlyFieldConfig) => `"${field.formControl.value}" no es un n\u00FAmero valido`,
              },
            },
          },


          {
            key: 'porcint',
            className: 'col-md-4',
            type: 'input',
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Porcentaje interes',
              required: true,
              pattern: /^[0-9]*\.?[0-9]*$/,
            },
            validation: {
              messages: {
                pattern: (error, field: FormlyFieldConfig) => `"${field.formControl.value}" no es un n\u00FAmero valido`,
              },
            },
          },





          {
            key: 'fec_inicial',
            className: 'col-md-4',
            type: 'datepicker',
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Fecha inicial',
              required: true,
            },
          },

          {
            key: 'id_cobrador',
            className: 'col-md-4',
            type: 'select',
            modelOptions: {
              updateOn: 'blur',
              debounce: {
                default: 2000,
              },
            },
            templateOptions: {
              label: 'Cobrador',
              options: this.cobradores,
              required: true
            },
          },

        ]
      }



    ]
  }

  submit() {


    console.log(this.form.value)

    if (this.form.valid) {

      console.log(this.model);
      this.clienteService.saveCliente(this.model).subscribe(

        response => {

          this.model = response;
          this.router.navigate(['/prestamos/listar']);


        }

      )

    } else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Por favor valide los campos obligatorios, para generar la tabla.',
      })
    }




  }

  async obtenerCuotasPrestamo() {

    console.log(this.model);

    if (this.form.valid) {
      this.mostrarTablaResumen = true;
      this.prestamosService.calcularCuotas(this.form.value).subscribe(
        response => {

          console.log(response);

          this.tableCuotasPrestamo = response;
        }
      )
    } else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Por favor valide los campos obligatorios, para generar la tabla.',
      })
    }


  }

  getHeaders() {
    let headers: string[] = [];
    if (this.tableCuotasPrestamo) {
      this.tableCuotasPrestamo.forEach((value) => {
        Object.keys(value).forEach((key) => {
          if (!headers.find((header) => header == key)) {
            headers.push(key)
          }
        })
      })
    }
    return headers;
  }
  modalAdicionarEmpresa() {

  }
  async guardarPrestamo() {

    if (this.form.valid) {


      Swal.fire({
        title: 'Esta seguro?',
        text: "Desea registrar el prestamo?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
        cancelButtonText: 'No!'
      }).then((result) => {

        if (result.value == true) {


          this.prestamosService.guardarPrestamo(this.model).subscribe(
            response => {
              console.log(response);
              if (response) {

                Swal.fire({
                  type: 'info',
                  title: 'Informaci&oacute;n',
                  text: 'Se crea satisfactoriamente el prestamo # ' + response,
                }).then(
                  (result) => {

                    if (result.value == true) {

                      this.listarDocumentosPrestamo = true;

                      this.model.id_prestamo = response;
                      this.prestamosService.renderTemplates(this.model).subscribe(
                        response => {
                          console.log(response);
                          this.plantillas_html = response;
                          this.combinarContenido(response);
                        }
                      )


                    }

                  }
                )

              }
            }
          )


        }

      })




    } else {

      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Por favor valide los campos obligatorios, para generar la tabla.',
      })

    }

  }

  combinarContenido(response: any): void {
    console.log('Response recibido:', response);
  
    if (!Array.isArray(response)) {
      console.error('Response no es un arreglo:', response);
      return;
    }
  
    this.contenidoCombinado = response
      .map((item) => {
        // Limpia etiquetas <html>, <head>, <body>
        const contenidoLimpio = this.limpiarHTML(item.plantilla_html);
        return `
          <div>
            
            ${contenidoLimpio}
            <hr style="page-break-after: always;">
          </div>
        `;
      })
      .join('');
  
    console.log('Contenido combinado:', this.contenidoCombinado);
  }

  limpiarHTML(html: string): string {
    // Remueve etiquetas <html>, <head>, y <body>
    return html
      .replace(/<html[^>]*>/gi, '')
      .replace(/<\/html>/gi, '')
      .replace(/<head[^>]*>.*?<\/head>/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '');
  }

}
