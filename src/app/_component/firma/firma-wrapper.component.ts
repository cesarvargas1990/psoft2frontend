import { Component, ViewChild,OnInit, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';

@Component({
    
  selector: 'formly-wrapper-firma',
  template: `
      <p>Escriba su firma sobre el cuadro de abajo, presione el boton guardar cuando termine.</p>
      <signature-pad [options]="signaturePadOptions" (onBeginEvent)="drawStart()" (onEndEvent)="drawComplete()"></signature-pad>
        <ng-container #fieldComponent></ng-container>
    
    <button type="button" (click)="drawComplete()" title="Guardar" class="btn btn-primary submit-button">
                            <mat-icon aria-label="Edit">save</mat-icon>
                        </button>
                            &nbsp;
                        <button type="button" title="Limpiar" (click)="drawClear()" class="btn btn-primary submit-button">
                            <mat-icon aria-label="Edit">clear</mat-icon>
                        </button>
                        <br>
  `,
  
})
export class FirmaWrapperComponent extends FieldWrapper {
    
    

  @ViewChild('fieldComponent', {static: false}) fieldComponent: ViewContainerRef;
  @ViewChild(SignaturePad, null) signaturePad: SignaturePad;

  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth' : window.innerWidth,
    'canvasHeight': 300 
  };


  public drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log (this.signaturePad.toDataURL());
    return (this.signaturePad.toDataURL());
  }
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }
  
  drawClear(){
    this.signaturePad.clear();
  }

  ngOnInit() {
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
}

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */