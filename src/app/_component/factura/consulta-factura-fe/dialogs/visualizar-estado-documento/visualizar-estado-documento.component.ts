
import { Component, OnInit, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../../../../_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import beautify from 'xml-beautifier';
import { HighlightResult } from 'ngx-highlightjs';
import { AppService } from '../../../../../_services/app.service';

@Component({
  selector: 'app-visualizar-estado-documento',
  templateUrl: './visualizar-estado-documento.component.html',
  styleUrls: ['./visualizar-estado-documento.component.scss']
})
export class VisualizarEstadoDocumentoComponent implements OnInit {


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

  datosConsultaJson: any[] = [];
  json: string;


  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VisualizarEstadoDocumentoComponent>,
    public appService: AppService,
    @Inject(MAT_DIALOG_DATA) public data: [],
  ) { }

  ngOnInit() {
    this.logXmlEnviado();
  }

  logXmlEnviado() {


    this.model = this.dialogRef.componentInstance['data'];
    this.model.action = 'empresa/getXmlDocumentoEnviado';

    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {

        this.datosConsultaJson = response;

        this.json =  JSON.parse (JSON.stringify(this.datosConsultaJson));

      }
    }, error => {
      this.authService.logout();
    });

  }
  public guardarArchivoJson () { 
    
    let nombreArchivo = 'JSON_'+this.model.PREFIJO + this.model.DOCUM + '_'+this.model.NIT_EMPRESA+'_'+this.model.TRANSA + 'ESCN'+this.model.IDESCN + '.txt';
    this.appService.downloadFileFromText( document.getElementById('json').innerText,nombreArchivo,'text/html;charset=utf8;');
  }

  

}
