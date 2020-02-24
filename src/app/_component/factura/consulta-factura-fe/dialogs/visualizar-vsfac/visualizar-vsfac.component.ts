import { Component, OnInit, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../../../../_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../../../../../_services/app.service'; 

@Component({
  selector: 'app-visualizar-vsfac',
  templateUrl: './visualizar-vsfac.component.html',
  styleUrls: ['./visualizar-vsfac.component.scss']
})
export class VisualizarVsfacComponent implements OnInit {

  model: any = {};

  consultaVsFac: any[] = [
  ];

  constructor(
    public authService : AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VisualizarVsfacComponent>,
    public appService : AppService,
    @Inject(MAT_DIALOG_DATA) public data: [],
  ) { }

  ngOnInit() {
    this.getVsfac();
  }

 
  getVsfac() {
    this.model = this.dialogRef.componentInstance['data'];
     this.model.action = 'empresa/getVsfac'; 
    
    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {
  
        this.consultaVsFac = response;
       
      }
    }, error => {
      this.authService.logout();
    });
  }

  getHeaders() {
    let headers: string[] = [];
    if(this.consultaVsFac) {
      this.consultaVsFac.forEach((value) => {
        Object.keys(value).forEach((key) => {
          if(!headers.find((header) => header == key)){
            headers.push(key)
          }
        })
      })
    }
    return headers;
  }

  guardarCsvVsfac () {
    let nombreArchivo = 'DATA_VSFAC_'+this.model.PREFIJO + this.model.DOCUM + '_'+this.model.NIT_EMPRESA+'_'+this.model.TRANSA + '_ESCN'+this.model.IDESCN ;
    this.appService.downloadFile(this.consultaVsFac, nombreArchivo, this.getHeaders(), ';');
  }

}
