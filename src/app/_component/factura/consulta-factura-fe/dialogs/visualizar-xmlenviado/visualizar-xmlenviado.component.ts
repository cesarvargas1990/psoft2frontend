import { Component, OnInit, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../../../../_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import beautify from 'xml-beautifier';
import { HighlightResult } from 'ngx-highlightjs';
import { AppService } from '../../../../../_services/app.service';
@Component({
  selector: 'app-visualizar-xmlenviado',
  templateUrl: './visualizar-xmlenviado.component.html',
  styleUrls: ['./visualizar-xmlenviado.component.scss']
})
export class VisualizarXmlenviadoComponent implements OnInit {
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

  datosConsultaXML: any[] = [];
  xml: string;

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VisualizarXmlenviadoComponent>,
    public appService : AppService,
    @Inject(MAT_DIALOG_DATA) public data: [],
  ) { }

  ngOnInit() {
    this.logXmlRespuesta();
  }

  logXmlRespuesta() {


    this.model = this.dialogRef.componentInstance['data'];
    this.model.action = 'empresa/getXmlEnviado';

    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {

        this.datosConsultaXML = response;
      
        this.xml = beautify(this.datosConsultaXML[0].LOG_TEST);

      }
    }, error => {
      this.authService.logout();
    });

  }

  public guardarArchivoXmlEnviado () { 
    
    let nombreArchivo = 'REQUEST_'+this.model.PREFIJO + this.model.DOCUM + '_'+this.model.NIT_EMPRESA+'_'+this.model.TRANSA + 'ESCN'+this.model.IDESCN + '.xml';
    this.appService.downloadFileFromText(this.xml,nombreArchivo,'text/html;charset=utf8;');
  }

}
 