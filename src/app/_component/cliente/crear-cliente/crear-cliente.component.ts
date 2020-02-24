import { Component, ViewChild, ElementRef, OnInit,ChangeDetectorRef,AfterViewInit , ViewContainerRef} from '@angular/core';


import {NavItem} from '../../../_models/nav-item';
import {NavService} from '../../../_services/nav.service';
import {VERSION} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../_services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from '../../../_models/cliente';
import { ClienteService } from '../../../_services/cliente/cliente.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';
import { UsersService} from '../../../_services/users/users.service';
import Swal from 'sweetalert2';


import { FormArray,FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Router } from '@angular/router';
import  { FirmaWrapperComponent} from '../../../_component/firma/firma-wrapper.component';

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


  @ViewChild(FirmaWrapperComponent,{static: false} ) child: FirmaWrapperComponent ; 

  @ViewChild('fieldComponent', {static: false}) fieldComponent: ViewContainerRef;
  
  
  
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
                options:  this.usersService.getUsers()
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
                options:  this.tipodocidentiService.getTipodocidenti()
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
      label:'Doc Adjuntos',
      fields: [

       
        
      ]
    },
    {
      label:'Firma cliente',
      fields: [
        {
          key: 'firma',
          wrappers: ['firma'],
          templateOptions: { label: 'Firma del cliente' },
          
        },
        
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






  //form = new FormGroup({});
  model: any = {};
  //options: FormlyFormOptions = {};

  tiposdocumento : any = {};
  cobradores :any = {};

  fields: FormlyFieldConfig[] = [];




  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;

  mobileQuery: MediaQueryList;

  version = VERSION;

  menuUsuario = JSON.parse (localStorage.getItem('menu_usuario')); 
  
  navItems: NavItem[] = this.menuUsuario; 

  

  datosCliente : any = [];

  

  constructor(
    public authService: AuthService,
    private navService: NavService,
    public clienteService : ClienteService, 
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public router: Router,
    public tipodocidentiService : TipodocidentiService,
    public usersService : UsersService
    
  ) { 

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  private _mobileQueryListener: () => void;
 
  
  async ngOnInit() {


    
    //this.tiposdocumento = await this.tipodocidentiService.getTipodocidenti();
    
    

    //this.cobradores = await this.usersService.getUsers();

    this.mobileQuery.removeListener(this._mobileQueryListener);
    
    
    
    
  }


  
  

  async ngAfterViewInit() {



   // this.tiposdocumento = await this.tipodocidentiService.getTipodocidenti();
   // this.cobradores = await this.usersService.getUsers();
    
    this.navService.appDrawer = this.appDrawer;





    //this.tabs = 


    
  }


  

  submit() {

      
    

    if (this.form.valid) {

      console.log(this.model);

     // let firmacliente = this.signaturePad.toDataURL();
      console.log('firmacliente base 64');
      //console.log(firmacliente);
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

}
