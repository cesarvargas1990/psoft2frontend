import { Component, ViewChild, ElementRef, OnInit,ChangeDetectorRef,AfterViewInit } from '@angular/core';


import {NavItem} from '../../../_models/nav-item';
import {NavService} from '../../../_services/nav.service';
import {VERSION} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../_services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { formasPago } from '../../../_models/formasPago';
import { ClienteService } from '../../../_services/cliente/cliente.service';
import { PrestamosService } from '../../../_services/prestamos/prestamos.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService} from '../../../_services/users/users.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { EditarFormapagoComponent} from '../../../_component/parametros/crear-formapago/dialogs/editar-formapago/editar-formapago.component';
 
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-formapago',
  templateUrl: './crear-formapago.component.html',
  styleUrls: ['./crear-formapago.component.scss']
})
export class CrearFormapagoComponent implements AfterViewInit {


  form = new FormGroup({});
  model: any = {};
  
  options: FormlyFormOptions = {};

  tiposdocumento : any = {};
  cobradores :any = {};
  periodospago :any = {};

  fields: FormlyFieldConfig[] = [];




  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse (localStorage.getItem('menu_usuario')); 
  
  navItems: NavItem[] = this.menuUsuario; 

  

  datosFormasPago : any = [];

  displayedColumns: string[] = ['id','nomfpago','nomperiodopago','valseguro','porcint','numcuotas','action'];

  
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public authService: AuthService,
    private navService: NavService,
    public clienteService : ClienteService, 
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public router: Router,
    public tipodocidentiService : TipodocidentiService,
    public usersService : UsersService,
    public prestamosService : PrestamosService,
    public dialog: MatDialog,
    
  ) { 

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  private _mobileQueryListener: () => void;
 
  
  ngOnInit() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    
    
    
    
  }

  async ngAfterViewInit() {


    this.tiposdocumento = await this.tipodocidentiService.getTipodocidenti();
    this.cobradores = await this.usersService.getUsers();
    
    
    this.navService.appDrawer = this.appDrawer;
    this.periodospago = await this.prestamosService.getPeriodosPago();

    this.fields = [

      {

        fieldGroupClassName: 'row',
        fieldGroup: [

          {
            key: 'id_periodo_pago',
            className: 'col-md-6',
            type: 'select',
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
            key: 'valorpres',
            className: 'col-md-6',
            type: 'input',
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Valor del prestamo',
              placeholder: 'Ingrese Valor del prestamo',
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
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Valor de seguro',
              placeholder: 'Ingrese Valor de seguro ?',
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
            defaultValue: false,
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
            defaultValue: false,
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Modificar porc interes?',
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
              label: 'Modificar numero de cuotas ?',
              placeholder: 'En el momento del registro del prestamo',
              
            }
          },


          {
            key: 'ind_solivalorpres',
            className: 'col-md-6',
            type: 'checkbox',
            defaultValue: false,
            modelOptions: {
              updateOn: 'blur',
            },
            templateOptions: {
              label: 'Modificar valor del prestamo ?',
              placeholder: 'En el momento del registro del prestamo',
              
            }
          },
          

        ],
        

      }
    ]

    this.getDatosFormasPago();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  eliminarFormaPago(row) {

    Swal.fire({
      title: 'Esta seguro?',
      text: "Desea eliminar el registro?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!'
    }).then((result) => {

      if (result.value == true) {


        this.prestamosService.deleteFormaPago(row).subscribe(


          response => {

            Swal.fire({
              type: 'info',
              title: 'Informaci&oacute;n',
              text: 'Se elimino satisfactoriamente el registro.',
            })

            this.getDatosFormasPago();

          }, error => {

            console.log(error);
            Swal.fire({
              type: 'error',
              title: 'Error',
              text: error,
            })

          }
        )



      }

    })
  }

  guardarFormaPago () {


    this.prestamosService.guardarFormaPago(this.model).subscribe(

      response => {

        this.model = response;
        console.log (response);
       // this.router.navigate(['/prestamos/listar']);


      }

    )


  }

  submit() {


    

    if (this.form.valid) {

      console.log(this.model);
      this.prestamosService.guardarFormaPago (this.model).subscribe(

        response => {
  
          this.model = response;
          console.log (response);
          this.getDatosFormasPago();

          Swal.fire({
            type: 'info',
            title: 'Informaci&oacute;n',
            text: 'Se crea satisfactoriamente la forma de pago.',
          })
          //this.router.navigate(['/formaspago/listar']);
          
  
        }
  
      )
      
    }else {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: 'Por favor valide los campos obligatorios, para guardar la forma de pago.',
      })
    }


    
    
  }

  getDatosFormasPago() {
 
    this.prestamosService.consultaFormasPago().subscribe(

      response => {
        this.datosFormasPago = response;
        let DATOS: formasPago[] = this.datosFormasPago;
        console.log(DATOS);
        this.dataSource = new MatTableDataSource(DATOS);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      }, error => {
        this.authService.logout();
      }
    )


  }

  modalEditarFormaPago(row: any[]): void {

    const dialogRef = this.dialog.open(EditarFormapagoComponent, {
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.getDatosFormasPago ();

    });


  }

}
