import { Component, OnInit, Inject,AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../../../../_models/cliente';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { ClienteService } from '../../../../../_services/cliente/cliente.service';
import Swal from 'sweetalert2';
import { TipodocidentiService } from './../../../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService} from '../../../../../_services/users/users.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.scss'],
  providers: [DatePipe]
})
export class EditarClienteComponent implements OnInit {

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  tiposdocumento : any = {};
  cobradores :any = {};
  fields: FormlyFieldConfig[] = [];

  submit() {

    if (this.form.valid) {
      this.model.id = this.data.id;
      this.clienteServicio.updateCliente(this.model).subscribe(

        response => {



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
    public dialogRef: MatDialogRef<EditarClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    public clienteServicio: ClienteService,
    public tipodocidentiService : TipodocidentiService,
    public usersService : UsersService,
    private datePipe: DatePipe

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
        key: 'codtipdocid',
        className: 'col-md-3',
        type: 'select',
        defaultValue: this.data.codtipdocid,
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
        key: 'perfil_facebook',
        className: 'col-md-3',
        type: 'input',
        defaultValue: this.data.perfil_facebook,
        modelOptions: {
          updateOn: 'submit',
        },
        templateOptions: {
          label: 'Perfil facebook',
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


  }
  async ngOnInit() {


    

   

  }

}
