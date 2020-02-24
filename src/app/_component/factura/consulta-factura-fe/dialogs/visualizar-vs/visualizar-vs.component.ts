import { Component, OnInit, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../../../../_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../../../../../_services/app.service';

@Component({
  selector: 'app-visualizar-vs',
  templateUrl: './visualizar-vs.component.html',
  styleUrls: ['./visualizar-vs.component.scss']
})
export class VisualizarVsComponent implements OnInit {

  model: any = {};

  consultaVstFac: any[] = [
  ];

  constructor(
    public authService : AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VisualizarVsComponent>,
    public appService : AppService,
    @Inject(MAT_DIALOG_DATA) public data: [],
  ) { }

  ngOnInit() {
    
    this.getVstfac();
  }

  getVstfac() {
    this.model = this.dialogRef.componentInstance['data'];
     this.model.action = 'empresa/getVstfac'; 
    this.model.ID = this.dialogRef.id; 
    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {

      
        this.consultaVstFac = response;
      
      }
    }, error => {
      this.authService.logout();
    });
  }

  getHeaders() {
    let headers: string[] = [];
    if(this.consultaVstFac) {
      this.consultaVstFac.forEach((value) => {
        Object.keys(value).forEach((key) => {
          if(!headers.find((header) => header == key)){
            headers.push(key)
          }
        })
      })
    }
    return headers;
  }

  guardarCsvVstfac () {
    let nombreArchivo = 'DATA_VSTFAC_'+this.model.PREFIJO + this.model.DOCUM + '_'+this.model.NIT_EMPRESA+'_'+this.model.TRANSA + '_ESCN'+this.model.IDESCN ;
    this.appService.downloadFile(this.consultaVstFac, nombreArchivo, this.getHeaders(), ';');
  }

}