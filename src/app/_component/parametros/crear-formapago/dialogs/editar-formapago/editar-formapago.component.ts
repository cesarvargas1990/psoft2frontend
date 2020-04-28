import { Component, OnInit, Inject,AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../../../../_models/cliente';
import { formasPago } from '../../../../../_models/formasPago';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { ClienteService } from '../../../../../_services/cliente/cliente.service';
import Swal from 'sweetalert2';
import { TipodocidentiService } from './../../../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService} from '../../../../../_services/users/users.service';
import { PrestamosService } from '../../../../../_services/prestamos/prestamos.service';

@Component({
  selector: 'app-editar-formapago',
  templateUrl: './editar-formapago.component.html',
  styleUrls: ['./editar-formapago.component.scss']
})
export class EditarFormapagoComponent implements OnInit {

  form = new FormGroup({});
  model: any = {};

  formaPagoModel:  any = {};


  options: FormlyFormOptions = {};


  periodospago :any = {};

  tiposdocumento : any = {};
  cobradores :any = {};
  fields: FormlyFieldConfig[] = [];

  submit() {

    if (this.form.valid) { 
      //this.model.id = this.data.id;
      this.formaPagoModel.id =  this.data.id;
      this.formaPagoModel.id_periodo_pago = this.model.id_periodo_pago;
      this.formaPagoModel.nomfpago = this.model.nomfpago;
      this.formaPagoModel.valseguro = this.model.valseguro;
      this.formaPagoModel.porcint = this.model.porcint;
      this.formaPagoModel.ind_solicporcint = this.model.ind_solicporcint;
      this.formaPagoModel.ind_solicseguro = this.model.ind_solicseguro;

      this.prestamosService.updateFormaPago(this.formaPagoModel).subscribe(

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
    public dialogRef: MatDialogRef<EditarFormapagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: formasPago,
    public clienteServicio: ClienteService,
    public tipodocidentiService : TipodocidentiService,
    public usersService : UsersService,
    public prestamosService : PrestamosService

  ) { }


  async ngAfterViewInit() {
    this.tiposdocumento = await this.tipodocidentiService.getTipodocidenti();
    this.cobradores = await this.usersService.getUsers();
    this.periodospago = await this.prestamosService.getPeriodosPago();
    this.fields = [

       
     

      {

        fieldGroupClassName: 'row',
        fieldGroup: [

          {
            key: 'id_periodo_pago',
            className: 'col-md-6',
            type: 'select',
            defaultValue: this.data.id_periodo_pago,
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Periodo de pago',
              placeholder: 'Seleccione periodo de pago',
              required: true,
              options: this.periodospago
            },
          },
      
          {
            key: 'nomfpago',
            className: 'col-md-6',
            type: 'input',
            defaultValue: this.data.nomfpago,
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Nombre Forma de pago',
              placeholder: 'Ingrese Nombre de la forma de pago',
              required: true,
            },
          },

          {
            key: 'numcuotas',
            className: 'col-md-6',
            type: 'input',
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Numero de cuotas',
              placeholder: 'Ingrese Numero de cuotas',
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
            key: 'valseguro',
            className: 'col-md-6',
            type: 'input',
            defaultValue: this.data.valseguro,
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Valor de seguro',
              placeholder: 'Ingrese Valor de seguro',
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
            key: 'porcint',
            className: 'col-md-6',
            type: 'input',
            defaultValue: this.data.porcint,
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Porcentaje Interes',
              placeholder: 'Ingrese Valor de porcentaje interes',
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
            key: 'ind_solicseguro',
            className: 'col-md-6',
            type: 'checkbox',
            defaultValue: this.data.ind_solicseguro,
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Modificar valor del seguro?',
              placeholder: 'En el momento del registro del prestamo',
              
            }
          },

          {
            key: 'ind_solicporcint',
            className: 'col-md-6',
            type: 'checkbox',
            defaultValue: this.data.ind_solicporcint,
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Modificar porc interes ?',
              placeholder: 'En el momento del registro del prestamo',
              
            }
          },
          {
            key: 'ind_solinumc',
            className: 'col-md-6',
            type: 'checkbox',
            defaultValue: false,
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Modificar num cuotas?',
              placeholder: 'En el momento del registro del prestamo',
              
            }
          },
          

        ]

      }
    

  ];


  }
  async ngOnInit() {


    

   

  }

  

}

