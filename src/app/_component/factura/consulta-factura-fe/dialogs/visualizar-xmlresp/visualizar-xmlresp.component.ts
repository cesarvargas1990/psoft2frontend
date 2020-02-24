import { Component, OnInit, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../../../../_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import beautify from 'xml-beautifier';
import { HighlightResult } from 'ngx-highlightjs';
import { AppService } from '../../../../../_services/app.service';
@Component({
  selector: 'app-visualizar-xmlenviado',
  templateUrl: './visualizar-xmlresp.component.html',
  styleUrls: ['./visualizar-xmlresp.component.scss']
})
export class VisualizarXmlrespComponent implements OnInit {
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
    public dialogRef: MatDialogRef<VisualizarXmlrespComponent>,
    public appService: AppService,
    @Inject(MAT_DIALOG_DATA) public data: [],
  ) { }

  ngOnInit() {
    this.logXmlEnviado();
  }

  logXmlEnviado() {


    this.model = this.dialogRef.componentInstance['data'];
    this.model.action = 'empresa/getXmlRespuesta';

    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {

        this.datosConsultaXML = response;

        this.xml = beautify(this.datosConsultaXML[0].LOG_TEST);

      }
    }, error => {
      this.authService.logout();
    });

  }

  public guardarArchivoXmlRespuesta() {

    let nombreArchivo = 'RESPONSE_' + this.model.PREFIJO + this.model.DOCUM + '_' + this.model.NIT_EMPRESA + '_' + this.model.TRANSA + 'ESCN' + this.model.IDESCN + '.xml';
    this.appService.downloadFileFromText(this.xml, nombreArchivo, 'text/html;charset=utf8;');
  }

  public visualizarEnDIAN() {
    window.open("https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=" + this.data['CUFE'], "_blank");
  }

  public visualizarPDFDIAN() {
    let rtoken = "&recaptchaToken=03AOLTBLSvZE6J2ii_i1HVnXqr5Iz3lo5zBWxv62WS6pdjwECS4CCoh1YSnUnhQDBCa3xj0rprnuPHaBz5MxnH1y2RdO5UZRLp5qWXZeFm-3x-35Se_Buia41KqOvMG6eGX4eXGXjGLVuiqpxeU--Swfk9veCk4vpkaM3YHM33-rT7DpK6xrCFGcNBeym4ROBQtQQKeW5IvZOlfM5oCmAIgCoRXp5HK94sTB6MTYRLhb46m_MGslyJjcg2b8Q5qlNdptvk9KMg1XmO7cCH-e-QDQfTZY4Kr2CH37bHvN0wjmXYaSlX00M4a4pGvh55HRt45szjRN_HtInSqOWxiMRWwTSe8RJd6_UFZHFx4U4MvKx-DkokKcQ-MH3byIgGngqNPG_VBqJy3vsHEqUw-u1u0zDT8orl4z5l_31B2IdD_-PenExtZAV4bUOL1WwCpDI0Apo_R7INfsFRSqdzCH6gBw9gh5-Q_gsc3fvj9QnhUyhN1Bm7F74F-83daK5v3EXqEXMA5NiX-SFrB3ZD2KF4a-ql8EmotLf20w";
    window.open("https://catalogo-vpfe.dian.gov.co/Document/DownloadPDF?trackid=" + this.data['CUFE'] + rtoken, "_blank");
  }

}