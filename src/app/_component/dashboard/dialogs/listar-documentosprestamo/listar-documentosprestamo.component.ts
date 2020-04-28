import { Component, OnInit, Inject,AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../../../_models/cliente';
import { documento } from '../../../../_models/documento';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { ClienteService } from '../../../../_services/cliente/cliente.service';
import Swal from 'sweetalert2';
import { TipodocidentiService } from './../../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService} from '../../../../_services/users/users.service';
import { PrestamosService } from '../../../../_services/prestamos/prestamos.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'listar-documentosprestamo',
  templateUrl: './listar-documentosprestamo.component.html',
  styleUrls: ['./listar-documentosprestamo.component.scss']
})
export class ListarDocumentosprestamoComponent implements OnInit {

  html = ``;
  panelOpenState = false;
  config: any = {
    
  };

  set(key: string, value: any) {
    const obj: any = {};
    obj[key] = value;
    this.config = Object.assign({}, this.config, obj);
  }

  form = new FormGroup({});
  model: any = {};

  documentoPlantilla:  any = {};
  plantillas_html : any = {};


  options: FormlyFormOptions = {};


  periodospago :any = {};

  tiposdocumento : any = {};
  cobradores :any = {};
  fields: FormlyFieldConfig[] = [];


  

  submit() {

    if (this.form.valid) { 
      //this.model.id = this.data.id;
      this.documentoPlantilla.id =  this.data.id;
      this.documentoPlantilla.nombre = this.model.nombre;
      this.documentoPlantilla.plantilla_html = this.html;
      

      this.prestamosService.updatePlantillaDocumento (this.documentoPlantilla).subscribe(

        response => {

           console.log (response); 

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

      )
    }





  }

  constructor(
    public dialogRef: MatDialogRef<ListarDocumentosprestamoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: documento,
    public clienteServicio: ClienteService,
    public tipodocidentiService : TipodocidentiService,
    public usersService : UsersService,
    public prestamosService : PrestamosService,
    public san: DomSanitizer,
    public router: Router,

  ) { }


  async ngAfterViewInit() {

    let datosPrestamo = this.dialogRef.componentInstance['data'];
    
    this.model.id_prestamo = datosPrestamo['id_prestamo']; 
                          this.prestamosService.renderTemplates(this.model).subscribe(
                            response => {
                              console.log (response);
                              this.plantillas_html = response;
                            }
                          )


    this.prestamosService.listaVariablesPlantillas().subscribe(
      response => {
        this.config = {
          height: 250,
          theme: 'modern',
          // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
          plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern',
          toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
          image_advtab: true,
          imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
          templates: response,
          init_instance_callback: function() {},
          content_css: [
            '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
            '//www.tinymce.com/css/codepen.min.css'
          ]
        }
      }
    )
    
    this.tiposdocumento = await this.tipodocidentiService.getTipodocidenti();
    this.cobradores = await this.usersService.getUsers();
    this.periodospago = await this.prestamosService.getPeriodosPago();

    this.html = this.data.plantilla_html;
    this.fields = [

       
    
      {

        fieldGroupClassName: 'row',
        fieldGroup: [

          {
            key: 'nombre',
            className: 'col-md-12',
            type: 'input',
            defaultValue: this.data.nombre,
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Nombre Plantilla',
              placeholder: 'Nombre Plantilla',
              required: true,
            },
          },
      
         
          

        ]

      }
    

  ];


  }
  async ngOnInit() {


    

   

  }

  volver () {
    this.router.navigate(['/dashboard']);
  }


  

}

