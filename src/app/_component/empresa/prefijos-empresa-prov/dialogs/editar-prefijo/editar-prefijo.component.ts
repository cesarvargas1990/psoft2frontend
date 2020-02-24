import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prefijo } from '../../../../../_models/prefijo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {AuthService} from '../../../../../_services/auth.service';
import { Observable, throwError } from 'rxjs';
@Component({
  selector: 'app-editar-prefijo',
  templateUrl: '../.././../reusable_templates/prefijo.component.html',
  styleUrls: ['./editar-prefijo.component.scss'] 
})

export class EditarPrefijoComponent implements OnInit {

  model: any = {};
  comboTiposDocumentoFE : any = {};
  comboEscenario :any = {};
  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<EditarPrefijoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [],
    public fb: FormBuilder,
  ) { }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  editView = true;
  
  PrefijoForm: FormGroup;

  guardarPrefijo(): void {

    this.model.action = 'empresa/editarPrefijo'; 
    this.model.data = this.PrefijoForm.value;
    this.authService.getData(this.model).subscribe(response => {
      
       if (response) {
            
        Swal.fire({
          type: 'info',
          title: 'Informaci&oacute;n',
          text: 'Se actualizo satisfactoriamente el registro.',
        })

        this.cerrarModal();

      
       }
    }, error => {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: error,
      })
      
    });

  }

  public seleccionProveedor(valor): Observable<any> {

    this.model.action = 'empresa/listarTiposDocumentoFE';
    this.model.NIT_PROVFE = valor;
    this.authService.getData(this.model).subscribe(response => {
      
      if (response) {
            
      
          this.comboTiposDocumentoFE  = response;
     
      }
   }, error => {
     Swal.fire({
       type: 'error',
       title: 'Error',
       text: error,
     })
     
   }); 
    return; 


  }

  obtenerDatosEscenarios(nit_provfe): void {
    this.model.action = 'empresa/obtenerDatosEscenario';
    this.model.NIT_PROVFE = nit_provfe;
    
    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {


        this.comboEscenario = response;

      }
    }, error => {
      Swal.fire({
        type: 'error',
        title: 'Error',
        text: error,
      })

    });
  }

  
  cerrarModal(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    
    this.seleccionProveedor(this.dialogRef.componentInstance.data['row'].NIT_PROVFE)
    this.obtenerDatosEscenarios(this.dialogRef.componentInstance.data['row'].NIT_PROVFE)
    this.reactiveForm()
  }

  

  /* Manejar Errores en Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.PrefijoForm.controls[control].hasError(error);
  }

  

  /* Formularios reactivos */
  reactiveForm() {

    //let dialogData = dialogData;
    let dialogData :any = {};
     dialogData = this.dialogRef.componentInstance.data;
    let rowData = dialogData.row;
    this.PrefijoForm = this.fb.group({
      ID: [rowData.ID],
      PREFIJO: [rowData.PREFIJO, [        
        Validators.maxLength(10)]
      ],
      NIT_EMPRESA: [rowData.NIT_EMPRESA, [Validators.required]],
      IDESCN: [rowData.IDESCN, [Validators.required]],
      NIT_PROVFE: [rowData.NIT_PROVFE, [Validators.required]],
      CONSEC: [ rowData.CONSEC, [
        Validators.required,
        Validators.minLength(1), 
        Validators.maxLength(10)
      ]
      ],
      TIPODOCUMENTO: [ rowData.TIPODOC, [
        Validators.required,
        Validators.minLength(1), 
        Validators.maxLength(10)
      ]],
      RANGONUMERACION: [ rowData.RANGONUMERACION, [
        Validators.required,
        Validators.minLength(1), 
        Validators.maxLength(10)
      ]],
      TRANSA: [ rowData.TRANSA, [
        Validators.required,
        Validators.minLength(1), 
        Validators.maxLength(10)
      ]],
      RESOLUCION : [ rowData.RESOLUCION, [
        Validators.minLength(1), 
        Validators.maxLength(200)
      ]]
    })
  }

}