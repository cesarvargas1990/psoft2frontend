import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prefijo } from '../../../../../_models/prefijo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../../_services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-prefijo',
  templateUrl: './eliminar-prefijo.component.html',
  styleUrls: ['./eliminar-prefijo.component.scss']
})
export class EliminarPrefijoComponent implements OnInit {


  model: any = {};

  constructor(
    public dialogRef: MatDialogRef<EliminarPrefijoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Prefijo,
    public authService: AuthService,
  ) { }


  PrefijoForm: FormGroup;
  eliminarPrefijo(): void {

    this.model.action = 'empresa/eliminarPrefijo';
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