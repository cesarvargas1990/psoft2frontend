import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Empresa } from '../../../../../_models/empresa';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {AuthService} from '../../../../../_services/auth.service';

@Component({
  selector: 'app-adicionar-empresa',
  templateUrl: '../.././../reusable_templates/empresa.component.html',
  styleUrls: ['./adicionar-empresa.component.scss']
})
export class AdicionarEmpresaComponent implements OnInit {

  model: any = {};

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<AdicionarEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Empresa,
    public fb: FormBuilder,
  ) { }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  EmpresaForm: FormGroup;

  guardarEmpresa(): void {
    this.model.action = 'empresa/guardarEmpresa'; 
    this.model.data = this.EmpresaForm.value;
    this.authService.getData(this.model).subscribe(response => {
      
       if (response) {
            
        Swal.fire({
          type: 'info',
          title: 'Informaci&oacute;n',
          text: 'Se registro satisfactoriamente la empresa.',
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
    return this.EmpresaForm.controls[control].hasError(error);
  }

  /* Formularios reactivos */
  reactiveForm() {
    this.EmpresaForm = this.fb.group({
      ID: [''],
      NIT: ['', [
        Validators.required,
        Validators.minLength(9), 
        Validators.maxLength(18)]
      ],
      NOMBRE: ['', [
        Validators.required,
        Validators.minLength(5), 
        Validators.maxLength(60)
      ]],
      DDIREC: ['', [
        Validators.required,
        Validators.minLength(5), 
        Validators.maxLength(60)]],
      TELEFONO: [ '', [
        Validators.required,
        Validators.minLength(7), 
        Validators.maxLength(60)
      ]
      ],
      EMAIL: [ '', [
        Validators.required,
        Validators.minLength(5), 
        Validators.maxLength(200)
      ]
      ]
    })
  }

}
