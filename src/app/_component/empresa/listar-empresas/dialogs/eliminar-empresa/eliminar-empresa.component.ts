import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Empresa } from '../../../../../_models/empresa';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../../_services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-empresa',
  templateUrl: './eliminar-empresa.component.html',
  styleUrls: ['./eliminar-empresa.component.scss']
})
export class EliminarEmpresaComponent implements OnInit {


  model: any = {};

  constructor(
    public dialogRef: MatDialogRef<EliminarEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Empresa,
    public authService: AuthService,
  ) { }


  EmpresaForm: FormGroup;
  eliminarEmpresa(): void {

    this.model.action = 'empresa/eliminarEmpresa';
    this.model.data = this.data;
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

  ngOnInit() {
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

}