import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../../../../_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaProvFE } from '../../../../../_models/EmpresaProvFE';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-adicionar-empresaprov-fe',
  templateUrl: '../.././../reusable_templates/empresa-provfe.component.html',
  styleUrls: ['./adicionar-empresaprov-fe.component.scss']
})
export class AdicionarEmpresaprovFeComponent implements OnInit {

  model: any = {};


  fields: FormlyFieldConfig[] = [];

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<AdicionarEmpresaprovFeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaProvFE,
    public fb: FormBuilder,
  ) { }

  EmpresaProvForm: FormGroup;
  form: FormGroup;

  ngOnInit() {

    this.reactiveForm();
  }

  /* Manejar Errores en Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.EmpresaProvForm.controls[control].hasError(error);
  }


  public seleccionProveedor(valor): Observable<FormlyFieldConfig[]> {


    this.model.action = 'empresa/getDatosCampProvFe';
    this.model.NIT_PROVFE = valor;
    this.model.NIT_EMPRESA = this.EmpresaProvForm.controls.NIT_EMPRESA.value;
    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {

        this.fields = response.formDefinition;

      }
    }, error => {
      this.authService.logout();
    });
    return; 


  }

  cerrarModal(): void {
    this.dialogRef.close();
  }


  reactiveForm() {
    this.EmpresaProvForm = this.fb.group({
      NIT_EMPRESA: ['', Validators.required],
      NIT_PROVFE: ['', Validators.required]
    })

    this.form = this.fb.group([

    ]);
  }

  guardarEmpresaProvFE() {


    this.model.action = 'empresa/guardarEmpresaProvFE';
  
    this.authService.getDataAny(this.model).subscribe(response => {

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

} 
