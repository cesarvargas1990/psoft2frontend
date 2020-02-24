import { Component, OnInit, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../../../../_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import beautify from 'xml-beautifier';
import { HighlightResult } from 'ngx-highlightjs';
import { AppService } from '../../../../../_services/app.service';

@Component({
  selector: 'app-visualizar-jsonrequest',
  templateUrl: './visualizar-jsonrequest.component.html',
  styleUrls: ['./visualizar-jsonrequest.component.scss']
})
export class VisualizarJsonrequestComponent implements OnInit {
  response: HighlightResult;

  onHighlight(e) {
    this.response = {
      language: e.language,
      //r: e.r,
      second_best: '{...}',
      top: '{...}',
      value: '{...}'
    }

  }

  model: any = {};

  datosConsultaJSON: any[] = [];
  json1: string;
  json2: string;

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VisualizarJsonrequestComponent>,
    public appService: AppService,
    @Inject(MAT_DIALOG_DATA) public data: [],
  ) { }

  ngOnInit() {
    this.logXmlRespuesta();
  }

  logXmlRespuesta() {


    this.model = this.dialogRef.componentInstance['data'];
    this.model.action = 'empresa/getJsonRequest';

    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {

        this.datosConsultaJSON = response;
      
        this.json1 = JSON.parse (this.datosConsultaJSON[0].LOG_TEST);
        this.json2 = JSON.parse (this.datosConsultaJSON[1].LOG_TEST);

      }
    }, error => {
      this.authService.logout();
    });

  }

  public guardarArchivoJsonVstFAC () { 
    
    let nombreArchivo = 'JSON_VSTFAC_'+this.model.PREFIJO + this.model.DOCUM + '_'+this.model.NIT_EMPRESA+'_'+this.model.TRANSA + 'ESCN'+this.model.IDESCN + '.txt';
    this.appService.downloadFileFromText( document.getElementById('jsonVstfac').innerText,nombreArchivo,'text/html;charset=utf8;');
  }

  public guardarArchivoJsonVsFAC () { 
    
    let nombreArchivo = 'JSON_VSFAC_'+this.model.PREFIJO + this.model.DOCUM + '_'+this.model.NIT_EMPRESA+'_'+this.model.TRANSA + 'ESCN'+this.model.IDESCN + '.txt';
    this.appService.downloadFileFromText(  document.getElementById('jsonVsfac').innerText,nombreArchivo,'text/html;charset=utf8;');
  }


}
 