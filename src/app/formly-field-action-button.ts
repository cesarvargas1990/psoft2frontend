import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-action-button',
  template: `
    <button
      type="button"
      class="btn btn-outline-primary add-client-inline-btn"
      [attr.title]="props?.label || to?.label || 'Acción'"
      (click)="(props?.onClick || to?.onClick)?.(field, $event)"
    >
      <mat-icon aria-label="Acción">{{
        props?.icon || to?.icon || 'add'
      }}</mat-icon>
    </button>
  `
})
export class FormlyFieldActionButton extends FieldType<FieldTypeConfig> {}
