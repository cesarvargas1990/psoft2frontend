import { Component, OnInit, Inject } from '@angular/core';

import { Observable, throwError } from 'rxjs'; 
import { AuthService } from '../../../../../_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisualizarVsComponent} from '../visualizar-vs/visualizar-vs.component'; 
import { VisualizarVsfacComponent} from '../visualizar-vsfac/visualizar-vsfac.component'; 
import { VisualizarXmlenviadoComponent} from '../visualizar-xmlenviado/visualizar-xmlenviado.component';
import { VisualizarXmlrespComponent} from '../visualizar-xmlresp/visualizar-xmlresp.component';
import { VisualizarJsonrequestComponent } from '../visualizar-jsonrequest/visualizar-jsonrequest.component';

import Swal from 'sweetalert2';
@Component({ 
  selector: 'app-visualizar-log',
  templateUrl: './visualizar-log.component.html',
  styleUrls: ['./visualizar-log.component.scss']
})
export class VisualizarLogComponent implements OnInit {

  datosConsultaDocum : any = {};
  model : any = {};
  

  constructor(
    public authService : AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VisualizarLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [],
    ) { 

    
  }

  public logDocumento(valor): Observable<any[]> {

    this.model.action = 'empresa/getlogDocum';
    this.model.ID = valor;
    
    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {

        this.datosConsultaDocum = response;

      }
    }, error => {
      this.authService.logout();
    });

    return this.datosConsultaDocum;  


  }

  ngOnInit() { 
    
    this.logDocumento(this.data['ID']);
  }

  public modalDetalleVSTFAC () {
    
    const dialogRef = this.dialog.open(VisualizarVsComponent, {

      id: this.data['ID'] ,
      data: {
        ID: this.data['ID'],
        NIT_EMPRESA : this.data['NIT_EMPRESA'],
        PREFIJO : this.data['PREFIJO'],
        IDESCN : this.data['IDESCN'],
        DOCUM : this.data['DOCUM'],
        TRANSA : this.data['TRANSA'] 
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      

    });
  }

  public modalDetalleVSFAC () {
    
 
    const dialogRef = this.dialog.open(VisualizarVsfacComponent, {
  
       
      data: {
        ID: this.data['ID'],
        NIT_EMPRESA : this.data['NIT_EMPRESA'],
        PREFIJO : this.data['PREFIJO'],
        IDESCN : this.data['IDESCN'],
        DOCUM : this.data['DOCUM'],
        TRANSA : this.data['TRANSA'] 
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      

    });
  }

  public xmlEnviado () {


    const dialogRef = this.dialog.open(VisualizarXmlenviadoComponent, {
  
       
      data: {
        ID: this.data['ID'],
        NIT_EMPRESA : this.data['NIT_EMPRESA'],
        PREFIJO : this.data['PREFIJO'],
        IDESCN : this.data['IDESCN'],
        DOCUM : this.data['DOCUM'],
        TRANSA : this.data['TRANSA'] 
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      

    });

  }

  public xmlRespuesta () {


    const dialogRef = this.dialog.open(VisualizarXmlrespComponent, {
  
       
      data: {
        ID: this.data['ID'],
        NIT_EMPRESA : this.data['NIT_EMPRESA'],
        PREFIJO : this.data['PREFIJO'],
        IDESCN : this.data['IDESCN'],
        DOCUM : this.data['DOCUM'],
        TRANSA : this.data['TRANSA'],
        CUFE: this.data['CUFE']
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      

    });

  }

  public jsonRequest () {


    const dialogRef = this.dialog.open(VisualizarJsonrequestComponent, {
  
       
      data: {
        ID: this.data['ID'],
        NIT_EMPRESA : this.data['NIT_EMPRESA'],
        PREFIJO : this.data['PREFIJO'],
        IDESCN : this.data['IDESCN'],
        DOCUM : this.data['DOCUM'],
        TRANSA : this.data['TRANSA'] 
        
      }
    }); 

    dialogRef.afterClosed().subscribe(result => {
      

    });

  }

  public descargarPDF () {


    this.model.action = 'facturacionElectronica/descargarArchivoAdjunto'; 
    this.model.ID = this.data['ID'];
    this.model.tipoDescarga = "pdf";

    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {
 
        if (response.codigo == 200) {

          const linkSource = 'data:application/pdf;base64,' + response.documento;
          const downloadLink = document.createElement("a");
          const fileName = this.data['NIT_EMPRESA']+'_'+this.data['NITCLI']+'_'+this.data['PREFIJO']+this.data['DOCUM']+'.pdf'; 
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.target = "_blank";
          downloadLink.click();


        }  else {

          if ( typeof(response.codigo === 'undefined' ) ) {

            Swal.fire({ 
              type: 'error',
              title: 'Error',
              text: 'No se encuentra el documento solicitado o no esta soportado.',
            })
            return ;
          }

          Swal.fire({
            type: 'error', 
            title: 'C&oacute;digo Error: '+response.codigo, 
            html: response.mensaje
            
          })
        } 
        
      
      } else {
        Swal.fire({
          type: 'error',
          title: 'Error',
          text: 'No se encuentra el documento solicitado o no esta soportado.',
        })

      }
    }, error => {
      this.authService.logout();
    });

  }

  public descargarPDFAdjunto () {


    this.model.action = 'facturacionElectronica/descargarDocumentoPDF'; 
    this.model.CUFE = this.data['CUFE'];
    

    this.authService.getDataAny(this.model).subscribe(response => {

      if (response) {
 
        if (response.pdf) {

          const linkSource = 'data:application/pdf;base64,' + response.pdf;
          const downloadLink = document.createElement("a");
          const fileName = this.data['NIT_EMPRESA']+'_'+this.data['NITCLI']+'_'+this.data['PREFIJO']+this.data['DOCUM']+'.pdf'; 
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.target = "_blank";
          downloadLink.click();


        }  else {

          if ( typeof(response.codigo === 'undefined' ) ) {

            Swal.fire({ 
              type: 'error',
              title: 'Error',
              text: 'No se encuentra el documento solicitado o no esta soportado.',
            })
            return ;
          }

          Swal.fire({
            type: 'error', 
            title: 'C&oacute;digo Error: '+response.codigo, 
            html: response.mensaje
            
          })
        } 
        
      
      } else {
        Swal.fire({
          type: 'error',
          title: 'Error',
          text: 'No se encuentra el documento solicitado o no esta soportado.',
        })

      }
    }, error => {
      this.authService.logout();
    });

  }


}
  