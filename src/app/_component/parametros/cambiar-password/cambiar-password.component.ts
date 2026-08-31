import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import Swal from 'sweetalert2';

import { AuthService } from '../../../_services/auth.service';
import { NavService } from '../../../_services/nav.service';
import { NavItem } from '../../../_models/nav-item';

import { SessionStateService } from '../../../core/session/session-state.service';

@Component({
  standalone: false,
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss']
})
export class CambiarPasswordComponent
  implements AfterViewInit, OnDestroy
{
  form: UntypedFormGroup;

  ocultarPassword = true;
  ocultarConfirmacion = true;

  guardando = false;

  navItems: NavItem[] = [];
  menuUsuario: unknown = [];

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  @ViewChild('appDrawer')
  appDrawer: ElementRef;

  constructor(
    private readonly fb: UntypedFormBuilder,

    public authService: AuthService,

    private readonly navService: NavService,

    private readonly sessionState: SessionStateService,

    private readonly router: Router,

    changeDetectorRef: ChangeDetectorRef,

    media: MediaMatcher
  ) {
    this.form = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      password_confirmation: [
        '',
        [
          Validators.required
        ]
      ]
    });

    this.menuUsuario =
      this.sessionState.parseStoredJson(
        'menu_usuario',
        []
      );

    this.navItems =
      this.sessionState.getMenuItems();

    this.mobileQuery =
      media.matchMedia('(max-width: 600px)');

    this._mobileQueryListener = () =>
      changeDetectorRef.detectChanges();

    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener(
        'change',
        this._mobileQueryListener
      );
    } else {
      const legacyAddListener =
        (this.mobileQuery as any).addListener as
          | ((listener: () => void) => void)
          | undefined;

      legacyAddListener?.(
        this._mobileQueryListener
      );
    }
  }

  ngAfterViewInit(): void {
    this.navService.appDrawer = this.appDrawer;
  }

  ngOnDestroy(): void {
    if (this.mobileQuery.removeEventListener) {
      this.mobileQuery.removeEventListener(
        'change',
        this._mobileQueryListener
      );
    } else {
      const legacyRemoveListener =
        (this.mobileQuery as any).removeListener as
          | ((listener: () => void) => void)
          | undefined;

      legacyRemoveListener?.(
        this._mobileQueryListener
      );
    }
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }

  guardar(): void {
    if (this.guardando) {
      return;
    }

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.mostrarError(
        'Ingrese y confirme la nueva contraseña.'
      );
      return;
    }

    const password =
      this.form.get('password')?.value;

    const confirmacion =
      this.form.get('password_confirmation')?.value;

    if (password !== confirmacion) {
      this.mostrarError(
        'La confirmación no coincide con la nueva contraseña.'
      );
      return;
    }

    this.guardando = true;

    this.authService
      .changePassword(this.form.getRawValue())
      .subscribe({
        next: () => {
          this.guardando = false;

          Swal.fire({
            type: 'success',
            title: 'Contraseña actualizada',
            text: 'Su contraseña fue actualizada correctamente.'
          });

          this.form.reset();

          this.ocultarPassword = true;
          this.ocultarConfirmacion = true;
        },

        error: (error) => {
          this.guardando = false;

          this.mostrarError(
            error?.error?.message ||
            'No fue posible actualizar la contraseña.'
          );
        }
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