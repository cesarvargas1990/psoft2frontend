import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaProvFE } from '../../../../../_models/EmpresaProvFE';
import { AuthService } from '../../../../../_services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-empresaprov-fe',
  templateUrl: './eliminar-empresaprov-fe.component.html',
  styleUrls: ['./eliminar-empresaprov-fe.component.scss']
})
export class EliminarEmpresaprovFeComponent implements OnInit {

  model: any = {};
  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<EliminarEmpresaprovFeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaProvFE    
  ) { }

  ngOnInit() {
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  

  eliminarEmpresaProvFe () {

    this.model.action = 'empresa/eliminarEmpresaProvFE';
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

}
