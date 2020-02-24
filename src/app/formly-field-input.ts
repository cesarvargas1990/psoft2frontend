import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material';

@Component({ 
 selector: 'formly-field-input',
 template: `
   <input  type="input" matInput [formControl]="formControl" [formlyAttributes]="field">    
 `,
})
export class FormlyFieldInput extends FieldType {}