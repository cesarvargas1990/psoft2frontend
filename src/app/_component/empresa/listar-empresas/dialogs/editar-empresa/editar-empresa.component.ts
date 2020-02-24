import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Empresa } from '../../../../../_models/empresa';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {AuthService} from '../../../../../_services/auth.service';

@Component({
  selector: 'app-editar-empresa',
  templateUrl: '../.././../reusable_templates/empresa.component.html',
  styleUrls: ['./editar-empresa.component.scss']
})
export class EditarEmpresaComponent implements OnInit {

  model: any = {};

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<EditarEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Empresa,
    public fb: FormBuilder,
  ) { }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  EmpresaForm: FormGroup;

  guardarEmpresa(): void {
    this.model.action = 'empresa/editarEmpresa'; 
    this.model.data = this.EmpresaForm.value;
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
      ID: [this.data.ID],
      NIT: [this.data.NIT, [
        Validators.required,
        Validators.minLength(9), 
        Validators.maxLength(20)]
      ],
      NOMBRE: [this.data.NOMBRE, [Validators.required]],
      DDIREC: [this.data.DDIREC, [Validators.required]],
      TELEFONO: [ this.data.TELEFONO, [
        Validators.required,
        Validators.minLength(7), 
        Validators.maxLength(50)
      ]
      ],
      EMAIL: [ this.data.EMAIL, [
        Validators.required,
        Validators.minLength(5), 
        Validators.maxLength(200)
      ]
      ]
    })
  }

}