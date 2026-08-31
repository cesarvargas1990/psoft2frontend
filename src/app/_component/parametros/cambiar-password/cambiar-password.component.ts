import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../_services/auth.service';

@Component({
  standalone: false,
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss']
})
export class CambiarPasswordComponent {
  form: UntypedFormGroup;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    });
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.mostrarError('Ingrese y confirme la nueva contraseña.');
      return;
    }

    if (this.form.value.password !== this.form.value.password_confirmation) {
      this.mostrarError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    this.authService.changePassword(this.form.value).subscribe(() => {
      Swal.fire({
        type: 'success',
        title: 'Password actualizado',
        text: 'Su contraseña fue actualizada correctamente.'
      });
      this.form.reset();
    });
  }

  private mostrarError(text: string): void {
    Swal.fire({
      type: 'error',
      title: 'Error',
      text
    });
  }
}
