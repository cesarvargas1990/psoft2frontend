import { Component, OnInit ,Inject } from '@angular/core';
import { AuthService } from '../../../../../_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaProvFE } from '../../../../../_models/EmpresaProvFE';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import Swal from 'sweetalert2';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-editar-empresaprov-fe',
  templateUrl: './editar-empresaprov-fe.component.html',
  styleUrls: ['./editar-empresaprov-fe.component.scss']
})
export class EditarEmpresaprovFeComponent implements OnInit {

  model: any = {};
  comboEscenario : any = {};
  fields: FormlyFieldConfig[] = [];

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<EditarEmpresaprovFeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaProvFE,
    public fb: FormBuilder,
  ) { }

  EmpresaProvForm: FormGroup;
  form: FormGroup;
  

  ngOnInit() {
    this.reactiveForm();
    this.seleccionProveedor();
    this.obtenerDatosEscenarios(); 
    
  }

  reactiveForm() {

    let dialogData :any = {};
     dialogData = this.dialogRef.componentInstance.data;
    let rowData = dialogData.row;
  
    this.form = this.fb.group({

      IDESCN: [rowData.IDESCN, Validators.required] 

    });

    
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  public seleccionProveedor(): Observable<FormlyFieldConfig[]> {


    this.model.action = 'empresa/getDatosCampProvFe';
    this.model.NIT_PROVFE = this.data['row'].NIT_PROVFE;
    this.model.NIT_EMPRESA = this.data['row'].NIT_EMPRESA;
    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {

        this.fields = response.formDefinition;
        this.model = response.modelData;

      }
    }, error => {
      this.authService.logout();
    });
    return;


  }
   
  guardarEmpresaProvFE(): void {
    

 
    this.model.action = 'empresa/editarEmpresaProvFe'; 
    this.model.data = this.form.value;
    this.model.IDESCN = this.form.value.IDESCN;
    this.model.ID = this.data['row'].ID;  
    
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

  datosEscenario(idescenario) :void {
    this.model.action = 'empresa/datosEscenario';
    this.model.NIT_PROVFE = this.data['row'].NIT_PROVFE;
    this.model.IDESCN = idescenario;
    this.model.NIT_EMPRESA = this.data['row'].NIT_EMPRESA;
    this.authService.getDataAny (this.model).subscribe(

      response => {

        if (response) {
          this.model = response[0];
        }

      }
      , error => {
        Swal.fire({
          type: 'error',
          title: 'Error',
          text: error,
        })
  
      }
    )
  }

  obtenerDatosEscenarios(): void {
    this.model.action = 'empresa/obtenerDatosEscenario';
    this.model.NIT_PROVFE = this.data['row'].NIT_PROVFE;
    
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

}
 