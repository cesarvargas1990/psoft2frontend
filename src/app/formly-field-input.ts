import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  standalone: false,
  selector: 'formly-field-input',
  template: `
    <input
      type="input"
      matInput
      [formControl]="formControl"
      [formlyAttributes]="field"
    />
  `
})
export class FormlyFieldInput extends FieldType<FieldTypeConfig> {}
