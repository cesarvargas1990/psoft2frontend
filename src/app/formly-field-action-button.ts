import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material';

@Component({
  selector: 'formly-field-action-button',
  template: `
    <button
      type="button"
      class="btn btn-outline-primary add-client-inline-btn"
      [attr.title]="to.label || 'Acción'"
      (click)="to.onClick && to.onClick(field, $event)"
    >
      <mat-icon aria-label="Acción">{{ to.icon || 'add' }}</mat-icon>
    </button>
  `
})
export class FormlyFieldActionButton extends FieldType {}
