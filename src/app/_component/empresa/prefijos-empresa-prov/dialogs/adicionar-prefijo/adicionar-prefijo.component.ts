import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prefijo } from '../../../../../_models/prefijo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {AuthService} from '../../../../../_services/auth.service';
import { Observable, throwError } from 'rxjs';
@Component({
  selector: 'app-adicionar-prefijo',
  templateUrl: '../.././../reusable_templates/prefijo.component.html',
  styleUrls: ['./adicionar-prefijo.component.scss']
})
export class AdicionarPrefijoComponent implements OnInit {

  model: any = {};
  comboTiposDocumentoFE : any = {};
  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<AdicionarPrefijoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Prefijo,
    //public comboEmpresa : Empresa,
    public fb: FormBuilder,
  ) { }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  editView = false;
  PrefijoForm: FormGroup;
  comboEscenario : any = {};
  guardarPrefijo(): void {
    this.model.action = 'empresa/guardarPrefijo'; 
    this.model.data = this.PrefijoForm.value;
    this.authService.getData(this.model).subscribe(response => {
      
       if (response) {
            
        Swal.fire({
          type: 'info',
          title: 'Informaci&oacute;n',
          text: 'Se registro satisfactoriamente el prefijo.',
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

  cerrarModal(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.reactiveForm()
  }

  /* Manejar Errores en Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.PrefijoForm.controls[control].hasError(error);
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


   this.model.action = 'empresa/obtenerDatosEscenario';
   this.model.NIT_PROVFE = valor; 

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

  })
    return; 


  }

  /* Formularios reactivos */
  reactiveForm() {
    this.PrefijoForm = this.fb.group({
      ID: [''],
      PREFIJO: ['', [
        Validators.minLength(2), 
        Validators.maxLength(10)]
      ],
      NIT_EMPRESA: [this.data.NIT_EMPRESA, [Validators.required]],
      IDESCN: ['', [Validators.required]],
      NIT_PROVFE: ['', [Validators.required]],
      CONSEC: [ '', [
        Validators.required,
        Validators.minLength(1), 
        Validators.maxLength(10), 
      ]
      ],
      TIPODOCUMENTO: [ '', [
        Validators.required,
        Validators.minLength(1), 
        Validators.maxLength(10)
      ]],
      RANGONUMERACION: [ '', [
        Validators.required,
        Validators.minLength(1), 
        Validators.maxLength(10)
      ]],
      TRANSA: [ '', [
        Validators.required,
        Validators.minLength(1), 
        Validators.maxLength(10)
      ]],
      RESOLUCION: [ '', [
        Validators.required,
        Validators.minLength(1), 
        Validators.maxLength(200)
      ]]
    })
  }

}
 