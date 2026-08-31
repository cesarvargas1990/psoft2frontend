import {

  Component,

  ViewChild,

  ElementRef,

  OnInit,

  OnDestroy,

  ChangeDetectorRef,

  AfterViewInit

} from '@angular/core';

import { NavItem } from '../../../_models/nav-item';

import { NavService } from '../../../_services/nav.service';

import { VERSION } from '@angular/material/core';

import { MediaMatcher } from '@angular/cdk/layout';

import { AuthService } from '../../../_services/auth.service';

import { ClienteService } from '../../../_services/cliente/cliente.service';

import { TipodocidentiService } from '../../../_services/tipodocidenti/tipodocidenti.service';

import { UsersService } from '../../../_services/users/users.service';

import Swal from 'sweetalert2';

import { PrestamosService } from '../../../_services/prestamos/prestamos.service';

import { UntypedFormGroup } from '@angular/forms';

import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { Router } from '@angular/router';

import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { CrearClienteComponent } from '../crear-cliente/crear-cliente.component';

import { SessionStateService } from '../../../core/session/session-state.service';

import { EmpresaService } from '../../../_services/empresa/empresa.service';

interface ResumenCuotasPrestamo {

  capital: number;

  intereses: number;

  granTotal: number;

  saldoRestante: number;

  cuotas: number;

}

@Component({

  standalone: false,

  selector: 'app-crear-prestamo',

  templateUrl: './crear-prestamo.component.html',

  styleUrls: ['./crear-prestamo.component.scss']

})

export class CrearPrestamoComponent implements AfterViewInit, OnDestroy {

  panelOpenState = false;

  plantillas_html: any = {};

  config: any = {};

  listarDocumentosPrestamo = false;

  form = new UntypedFormGroup({});

  model: any = {

    interes_equivalente_anual: '0.00',

    valor_cuota_diaria: ''

  };

  options: FormlyFormOptions = {};

  tiposdocumento: any = {};

  cobradores: any = {};

  formaspago: any = {};

  sistemaspago: any = {};

  mostrarTablaResumen = false;

  tableCuotasPrestamo: any[] = [];

  resumenCuotas: ResumenCuotasPrestamo = this.crearResumenVacio();

  fields: FormlyFieldConfig[] = [];

  @ViewChild('appDrawer') appDrawer: ElementRef;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  version = VERSION;

  menuUsuario: unknown = [];

  navItems: NavItem[] = [];

  contenidoCombinado = '';

  datosCliente: any = [];

  listaClientes: any = [];

  datosEmpresa: any = {};

  // La tarifa solo precarga este campo. Si el usuario lo cambia, ese valor manda.
  cuotaDiariaModificadaManual = false;

  constructor(

    public authService: AuthService,

    private navService: NavService,

    public clienteService: ClienteService,

    changeDetectorRef: ChangeDetectorRef,

    media: MediaMatcher,

    public router: Router,

    public dialog: MatDialog,

    private readonly sessionState: SessionStateService,

    public tipodocidentiService: TipodocidentiService,

    public usersService: UsersService,

    public prestamosService: PrestamosService,

    public empresaService: EmpresaService

  ) {

    this.menuUsuario = this.sessionState.parseStoredJson('menu_usuario', []);

    this.navItems = this.sessionState.getMenuItems();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');

    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

    if (this.mobileQuery.addEventListener) {

      this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    } else {

      const legacyAddListener = (this.mobileQuery as any).addListener as

        | ((listener: () => void) => void)

        | undefined;

      legacyAddListener?.(this._mobileQueryListener);

    }

  }

  ngOnInit() {}

  ngOnDestroy(): void {

    if (this.mobileQuery.removeEventListener) {

      this.mobileQuery.removeEventListener('change', this._mobileQueryListener);

    } else {

      const legacyRemoveListener = (this.mobileQuery as any).removeListener as

        | ((listener: () => void) => void)

        | undefined;

      legacyRemoveListener?.(this._mobileQueryListener);

    }

  }

  ngAfterViewInit(): void {

    void this.initializeAfterViewInit();

  }

  private async initializeAfterViewInit(): Promise<void> {

    this.config = {

      height: 500,

      theme: 'modern',

      plugins:

        'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern',

      toolbar:

        'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',

      image_advtab: true,

      imagetools_toolbar:

        'rotateleft rotateright | flipv fliph | editimage imageoptions',

      init_instance_callback() {},

      content_css: [

        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',

        '//www\.tinymce.com/css/codepen.min.css'

      ]

    };

    this.tiposdocumento = await this.tipodocidentiService.getTipodocidenti();

    this.cobradores = await this.usersService.getUsers();

    this.listaClientes = await this.clienteService.getClientes();

    this.formaspago = await this.prestamosService.getFormasPago();

    this.sistemaspago = await this.prestamosService.getSistemaPrestamo();

    this.datosEmpresa = await this.empresaService.getEmpresa().toPromise();

    console.log('los clientes');

    console.log(this.listaClientes);

    this.navService.appDrawer = this.appDrawer;

    this.fields = [

      {

        fieldGroupClassName: 'row',

        fieldGroup: [

          {

            key: 'id_cliente',

            className: 'col-md-3',

            type: 'select',

            templateOptions: {

              label: 'Nombre Cliente',

              required: true,

              options: this.listaClientes,

              change: (field, event) => {

                if (this.form.valid) {

                  this.obtenerCuotasPrestamo();

                }

              }

            }

          },

          {

            className: 'col-md-1 cliente-plus-field',

            type: 'action-button',

            props: {

              label: 'Crear cliente',

              icon: 'add',

              onClick: () => this.modalAdicionarEmpresa()

            }

          },

          {

            key: 'id_periodo_pago',

            className: 'col-md-4',

            type: 'select',

            templateOptions: {

              label: 'Forma de pago',

              options: this.formaspago,

              required: true,

              change: (field, $event) => {

                this.actualizarEquivalenciaInteres();

                if (this.form.valid) {

                  this.obtenerCuotasPrestamo();

                }

              }

            }

          },

          {

            key: 'id_sistema_pago',

            className: 'col-md-4',

            type: 'select',

            templateOptions: {

              label: 'Sistema de pago',

              options: this.sistemaspago,

              required: true,

              change: (field, $event) => {

                this.actualizarCamposCuotaFijaPorBloque();

                this.prestamosService

                  .pstiposistemaprest()

                  .subscribe((response) => {

                    if (response) {

                      this.form.updateValueAndValidity();

                    }

                  });

                if (this.form.valid) {

                  this.obtenerCuotasPrestamo();

                }

              }

            }

          },

          {

            key: 'valorpres',

            className: 'col-md-3',

            type: 'input',

            modelOptions: {

              updateOn: 'blur'

            },

            templateOptions: {

              label: 'Valor del prestamo',

              required: true,

              pattern: /^[0-9]*\.?[0-9]*$/,

              minLength: 5,

              maxLength: 11,

              blur: (field, $event) => {

                const numeroCuotas = this.convertirANumero(
                  this.form.getRawValue()?.numcuotas ?? this.model?.numcuotas
                );

                if (this.esCuotaFijaPorBloque() && numeroCuotas > 0) {

                  this.cuotaDiariaModificadaManual = false;

                  this.calcularCuotaDiariaPorTarifa(numeroCuotas, true);

                  return;

                }

                this.actualizarEquivalenciaInteres();

                if (this.form.valid) {

                  this.obtenerCuotasPrestamo();

                }

              }

            },

            validation: {

              messages: {

                pattern: (error, field: FormlyFieldConfig) =>

                  `"${field.formControl.value}" no es un número válido`

              }

            }

          },

          {

            key: 'numcuotas',

            className: 'col-md-3',

            type: 'input',

            modelOptions: {

              updateOn: 'blur'

            },

            templateOptions: {

              label: 'Número de cuotas',

              required: true,

              pattern: /^[0-9]*\.?[0-9]*$/,

              minLength: 1,

              maxLength: 3,

              blur: (field, $event) => {

                const numeroCuotas = this.convertirANumero(
                  this.form.getRawValue()?.numcuotas ?? this.model?.numcuotas
                );

                if (this.esCuotaFijaPorBloque() && numeroCuotas > 0) {

                  this.cuotaDiariaModificadaManual = false;

                  this.calcularCuotaDiariaPorTarifa(numeroCuotas, true);

                  return;

                }

                if (this.form.valid) {

                  this.obtenerCuotasPrestamo();

                }

              }

            },

            validation: {

              messages: {

                pattern: (error, field: FormlyFieldConfig) =>

                  `"${field.formControl.value}" no es un número válido`

              }

            }

          },

          {

            key: 'valor_cuota_diaria',

            className: 'col-md-3',

            type: 'input',

            hideExpression: () => !this.esCuotaFijaPorBloque(),

            modelOptions: {

              updateOn: 'blur'

            },

            templateOptions: {

              label: 'Valor de cuota diaria',

              required: false,

              type: 'number',

              min: 1,

              // Mantiene el label arriba y evita que quede montado sobre el valor.
              floatLabel: 'always',

              blur: (field, $event) => {

                const valorCuota = this.convertirANumero(
                  this.form.getRawValue()?.valor_cuota_diaria
                );

                if (valorCuota <= 0) {

                  return;

                }

                // La tarifa solo precarga. Si el usuario cambia el valor, este manda.
                this.cuotaDiariaModificadaManual = true;

                this.model.valor_cuota_diaria = valorCuota;

                if (this.form.valid) {

                  this.obtenerCuotasPrestamo();

                }

              }

            }

          },

          {

            key: 'porcint',

            className: 'col-md-3',

            type: 'input',

            modelOptions: {

              updateOn: 'blur'

            },

            templateOptions: {

              label: 'Interés del período (%)',

              required: true,

              pattern: /^[0-9]*\.?[0-9]*$/,

              blur: (field, $event) => {

                this.actualizarEquivalenciaInteres();

                if (this.form.valid) {

                  this.obtenerCuotasPrestamo();

                }

              }

            },

            hideExpression: () => this.esCuotaFijaPorBloque(),

            expressionProperties: {

              'templateOptions.required': () => !this.esCuotaFijaPorBloque()

            },

            validation: {

              messages: {

                pattern: (error, field: FormlyFieldConfig) =>

                  `"${field.formControl.value}" no es un número válido`

              }

            }

          },

          {

            key: 'interes_equivalente_anual',

            className: 'col-md-3',

            type: 'input',

            hideExpression: () => this.esCuotaFijaPorBloque(),

            templateOptions: {

              label: 'Equivalencia anual simple (%)',

              readonly: true,

              disabled: true

            }

          },

          {

            key: 'fec_inicial',

            className: 'col-md-4',

            type: 'datepicker',

            hooks: {

              onInit: (field) => {

                field.formControl.valueChanges.subscribe((newVal) => {

                  setTimeout(() => {

                    if (field.form.valid) {

                      this.obtenerCuotasPrestamo();

                    }

                  }, 0);

                });

              }

            },

            templateOptions: {

              label: 'Fecha inicial',

              required: true

            }

          },

          {

            key: 'id_cobrador',

            className: 'col-md-4',

            type: 'select',

            templateOptions: {

              label: 'Cobrador',

              options: this.cobradores,

              required: true,

              change: (field, $event) => {

                if (this.form.valid) {

                  this.obtenerCuotasPrestamo();

                }

              }

            }

          }

        ]

      }

    ];

    this.aplicarDefaultsEmpresa();

  }

  volver() {

    this.router.navigate(['/dashboard']);

  }

  submit() {

    if (this.form.valid) {

      this.clienteService.saveCliente(this.model).subscribe((response) => {

        this.model = response;

        this.router.navigate(['/prestamos/listar']);

      });

    } else {

      Swal.fire({

        type: 'error',

        title: 'Error',

        text: 'Por favor valide los campos obligatorios, para generar la tabla.'

      });

    }

  }

  async obtenerCuotasPrestamo() {

    if (!this.form.valid) {

      Swal.fire({

        type: 'error',

        title: 'Error',

        text: 'Por favor valide los campos obligatorios, para generar la tabla.'

      });

      return;

    }

    // Cada simulación debe volver a modo simulador.
    // Esto evita que quede visible el estado de préstamo registrado/documentos
    // y garantiza que la tabla vuelva a mostrarse después de guardar un préstamo.
    this.listarDocumentosPrestamo = false;

    if (this.esCuotaFijaPorBloque()) {

      // Al simular NO recalcular tarifa: usar el valor visible en el campo.
      this.form.get('porcint')?.setValue(null, {

        emitEvent: false,

        onlySelf: true

      });

      this.form.get('porcint')?.disable({

        emitEvent: false,

        onlySelf: true

      });

    } else {

      this.actualizarEquivalenciaInteres();

    }

    this.mostrarTablaResumen = true;

    const payload = this.construirPayloadPrestamo();

    this.prestamosService

      .calcularCuotas(payload)

      .subscribe({

        next: (response: any) => {

          if (Array.isArray(response)) {

            this.tableCuotasPrestamo = response;

          } else if (Array.isArray(response?.tabla_formato)) {

            this.tableCuotasPrestamo = response.tabla_formato;

          } else if (Array.isArray(response?.tabla)) {

            this.tableCuotasPrestamo = response.tabla;

          } else {

            this.tableCuotasPrestamo = [];

          }

          // Forzar nuevamente el estado de simulación una vez llega la respuesta.
          this.listarDocumentosPrestamo = false;
          this.mostrarTablaResumen = true;

          this.actualizarResumenCuotas();

        },

        error: (error) => {

          this.tableCuotasPrestamo = [];

          this.mostrarTablaResumen = false;

          Swal.fire({

            type: 'error',

            title: 'Error',

            text: error?.error?.message || 'No fue posible calcular las cuotas.'

          });

        }

      });

  }

  private esCuotaFijaPorBloque(): boolean {

    const idSistemaPago = this.normalizarIdentificador(

      this.form.value?.id_sistema_pago ?? this.model?.id_sistema_pago

    );

    if (idSistemaPago === '5') {

      return true;

    }

    const sistemaSeleccionado = this.obtenerSistemaPagoSeleccionado();

    const nombreSistema = this.normalizarTexto(

      [

        sistemaSeleccionado?.label,

        sistemaSeleccionado?.nomtipsistemap,

        sistemaSeleccionado?.nombre,

        sistemaSeleccionado?.descripcion,

        typeof sistemaSeleccionado === 'string' ? sistemaSeleccionado : ''

      ]

        .filter(Boolean)

        .join(' ')

    );

    return (

      nombreSistema.includes('cuota fija') &&

      nombreSistema.includes('bloque') &&

      nombreSistema.includes('capital')

    );

  }

  get esSistemaCuotaBloque(): boolean {

    return this.esCuotaFijaPorBloque();

  }

  private actualizarCamposCuotaFijaPorBloque(): void {

    if (!this.esCuotaFijaPorBloque()) {

      this.cuotaDiariaModificadaManual = false;

      this.form.get('porcint')?.enable({

        emitEvent: false,

        onlySelf: true

      });

      this.form.get('valor_cuota_diaria')?.setValue('', {

        emitEvent: false,

        onlySelf: true

      });

      this.model.valor_cuota_diaria = '';

      return;

    }

    this.form.get('porcint')?.setValue(null, {

      emitEvent: false,

      onlySelf: true

    });

    this.form.get('porcint')?.disable({

      emitEvent: false,

      onlySelf: true

    });

    this.form.get('interes_equivalente_anual')?.setValue('0.00', {

      emitEvent: false,

      onlySelf: true

    });

    this.model.porcint = null;

    this.model.interes_equivalente_anual = '0.00';

    this.form.updateValueAndValidity({ emitEvent: false });

    if (!this.cuotaDiariaModificadaManual) {

      this.actualizarValorCuotaBloque();

    }

  }

  private aplicarDefaultsEmpresa(): void {

    const sistemaDefault = this.datosEmpresa?.id_sistema_pago_default;

    if (!sistemaDefault) {

      return;

    }

    this.model.id_sistema_pago = sistemaDefault;

    this.form.patchValue({ id_sistema_pago: sistemaDefault }, { emitEvent: false });

    if (this.esCuotaFijaPorBloque()) {

      this.model.numcuotas = 25;

      this.form.patchValue({ numcuotas: 25 }, { emitEvent: false });

      this.actualizarCamposCuotaFijaPorBloque();

    }

  }

  private actualizarValorCuotaBloque(): void {

    if (!this.esCuotaFijaPorBloque()) {

      return;

    }

    if (this.cuotaDiariaModificadaManual) {

      return;

    }

    const numcuotas = this.convertirANumero(
      this.form.getRawValue()?.numcuotas ?? this.model?.numcuotas
    );

    const valorpres = this.convertirANumero(
      this.form.getRawValue()?.valorpres ?? this.model?.valorpres
    );

    if (!numcuotas || !valorpres) {

      return;

    }

    this.calcularCuotaDiariaPorTarifa(numcuotas, false);

  }

  private calcularCuotaDiariaPorTarifa(
    numeroCuotas: number,
    simularDespues: boolean = false
  ): void {

    if (!this.esCuotaFijaPorBloque()) {

      return;

    }

    const valorPrestamo = this.convertirANumero(
      this.form.getRawValue()?.valorpres ?? this.model?.valorpres
    );

    if (valorPrestamo <= 0 || numeroCuotas <= 0) {

      return;

    }

    this.prestamosService

      .tarifaBloqueCapital({

        numcuotas: numeroCuotas,

        valorpres: valorPrestamo

      })

      .subscribe({

        next: (response: any) => {

          // Si el usuario alcanzó a editar mientras respondía el API, respetar su valor.
          if (this.cuotaDiariaModificadaManual) {

            return;

          }

          let valorCuota = this.convertirANumero(response?.valor_cuota);

          if (valorCuota <= 0) {

            const baseCalculo = this.convertirANumero(response?.base_calculo);

            const valorPorBloque = this.convertirANumero(
              response?.valor_por_bloque
            );

            if (baseCalculo > 0 && valorPorBloque > 0) {

              valorCuota =
                (valorPrestamo / baseCalculo) * valorPorBloque;

            }

          }

          if (valorCuota <= 0) {

            valorCuota =
              this.convertirANumero(response?.valor_default) || 40000;

          }

          valorCuota =
            Math.round((valorCuota + Number.EPSILON) * 100) / 100;

          this.model.valor_cuota_diaria = valorCuota;

          this.form.get('valor_cuota_diaria')?.setValue(valorCuota, {

            emitEvent: false,

            onlySelf: true

          });

          if (simularDespues && this.form.valid) {

            this.obtenerCuotasPrestamo();

          }

        },

        error: (error) => {

          console.error('ERROR CONSULTANDO TARIFA:', error);

          if (this.cuotaDiariaModificadaManual) {

            return;

          }

          const valorFallback = 40000;

          this.model.valor_cuota_diaria = valorFallback;

          this.form.get('valor_cuota_diaria')?.setValue(valorFallback, {

            emitEvent: false,

            onlySelf: true

          });

          if (simularDespues && this.form.valid) {

            this.obtenerCuotasPrestamo();

          }

        }

      });

  }

  getHeaders() {

    const headers: string[] = [];

    if (this.tableCuotasPrestamo) {

      this.tableCuotasPrestamo.forEach((value) => {

        Object.keys(value).forEach((key) => {

          if (!headers.find((header) => header === key)) {

            headers.push(key);

          }

        });

      });

    }

    return headers;

  }

  obtenerNombreHeader(header: string): string {

    if (!this.esCuotaFijaPorBloque()) {
      return header;
    }

    const headers: Record<string, string> = {
      Interes: 'Interés / Ganancia',
      'Interés': 'Interés / Ganancia',
      Amortizacion: 'Amortización (Capital)',
      'Amortización': 'Amortización (Capital)'
    };

    return headers[header] ?? header;

  }

  actualizarEquivalenciaInteres(): void {


    const interesPeriodo = this.convertirANumero(this.form.value?.porcint);

    const multiplicadorAnual = this.obtenerMultiplicadorAnualPago();

    const equivalenciaAnual = interesPeriodo * multiplicadorAnual;

    const valorFormateado = equivalenciaAnual.toFixed(2);

    this.model.interes_equivalente_anual = valorFormateado;

    this.form

      .get('interes_equivalente_anual')

      ?.setValue(valorFormateado, { emitEvent: false, onlySelf: true });

  }

  private obtenerMultiplicadorAnualPago(): number {

    const formaPago = this.obtenerFormaPagoSeleccionada();

    const nombrePeriodo = this.normalizarTexto(

      [

        formaPago?.nomfpago,

        formaPago?.nomperiodopago,

        formaPago?.label,

        formaPago?.nombre,

        formaPago?.descripcion,

        typeof formaPago === 'string' ? formaPago : ''

      ]

        .filter(Boolean)

        .join(' ')

    );

    if (nombrePeriodo.includes('diari')) {

      return 360;

    }

    if (nombrePeriodo.includes('seman')) {

      return 52;

    }

    if (nombrePeriodo.includes('quincen')) {

      return 24;

    }

    if (nombrePeriodo.includes('mens')) {

      return 12;

    }

    if (nombrePeriodo.includes('bimestr')) {

      return 6;

    }

    if (nombrePeriodo.includes('cuatrimestr')) {

      return 3;

    }

    if (nombrePeriodo.includes('trimestr')) {

      return 4;

    }

    if (nombrePeriodo.includes('semestr')) {

      return 2;

    }

    if (nombrePeriodo.includes('anual')) {

      return 1;

    }

    return 12;

  }

  private obtenerFormaPagoSeleccionada(): any {

    const idPeriodoPago = this.form.value?.id_periodo_pago;

    const idPeriodoNormalizado = this.normalizarIdentificador(idPeriodoPago);

    const opciones = Array.isArray(this.formaspago) ? this.formaspago : [];

    if (idPeriodoNormalizado === null) {

      return undefined;

    }

    return opciones.find((opcion) => {

      if (typeof opcion === 'string') {

        return opcion === idPeriodoNormalizado;

      }

      if (!opcion || typeof opcion !== 'object') {

        return false;

      }

      const record = opcion as Record<string, unknown>;

      return [

        record.value,

        record.id,

        record.id_periodo_pago,

        record.codperiodopago

      ].some(

        (valor) => this.normalizarIdentificador(valor) === idPeriodoNormalizado

      );

    });

  }

  private obtenerSistemaPagoSeleccionado(): any {

    const idSistemaPago = this.form.value?.id_sistema_pago;

    const idSistemaNormalizado = this.normalizarIdentificador(idSistemaPago);

    const opciones = Array.isArray(this.sistemaspago) ? this.sistemaspago : [];

    if (idSistemaNormalizado === null) {

      return undefined;

    }

    return opciones.find((opcion) => {

      if (typeof opcion === 'string') {

        return opcion === idSistemaNormalizado;

      }

      if (!opcion || typeof opcion !== 'object') {

        return false;

      }

      const record = opcion as Record<string, unknown>;

      return [

        record.value,

        record.id,

        record.id_sistema_pago,

        record.codtipsistemap

      ].some(

        (valor) => this.normalizarIdentificador(valor) === idSistemaNormalizado

      );

    });

  }

  private normalizarIdentificador(valor: unknown): string | null {

    return typeof valor === 'string' || typeof valor === 'number'

      ? String(valor)

      : null;

  }

  formatearMoneda(valor: number): string {

    return new Intl.NumberFormat('en-US', {

      style: 'currency',

      currency: 'USD',

      minimumFractionDigits: 2,

      maximumFractionDigits: 2

    }).format(Number.isFinite(valor) ? valor : 0);

  }

  private actualizarResumenCuotas(): void {

    const cuotas = Array.isArray(this.tableCuotasPrestamo)

      ? this.tableCuotasPrestamo

      : [];

    const resumen = cuotas.reduce((acumulado, cuota) => {

      acumulado.capital += this.obtenerNumeroDeCampo(cuota, [

        'Capital',

        'Amortizacion',

        'Amortización'

      ]);

      acumulado.intereses += this.obtenerNumeroDeCampo(cuota, [

        'Interes',

        'Interés'

      ]);

      acumulado.granTotal += this.obtenerNumeroDeCampo(cuota, [

        'Total a pagar cuota'

      ]);

      return acumulado;

    }, this.crearResumenVacio());

    const ultimaCuota = cuotas.length ? cuotas[cuotas.length - 1] : null;

    resumen.saldoRestante = this.esCuotaFijaPorBloque()

      ? resumen.capital

      : ultimaCuota

        ? this.obtenerNumeroDeCampo(ultimaCuota, ['Saldo'])

        : 0;

    resumen.cuotas = cuotas.length;

    if (resumen.granTotal === 0) {

      resumen.granTotal = resumen.capital + resumen.intereses;

    }

    this.resumenCuotas = resumen;

  }

  private crearResumenVacio(): ResumenCuotasPrestamo {

    return {

      capital: 0,

      intereses: 0,

      granTotal: 0,

      saldoRestante: 0,

      cuotas: 0

    };

  }

  private obtenerNumeroDeCampo(

    fila: Record<string, unknown>,

    nombresCampo: string[]

  ): number {

    const nombresNormalizados = nombresCampo.map((campo) =>

      this.normalizarTexto(campo)

    );

    const nombreEncontrado = Object.keys(fila).find((campo) =>

      nombresNormalizados.includes(this.normalizarTexto(campo))

    );

    if (!nombreEncontrado) {

      return 0;

    }

    return this.convertirANumero(fila[nombreEncontrado]);

  }

  private normalizarTexto(texto: string): string {

    return texto

      .normalize('NFD')

      .replace(/[\u0300-\u036f]/g, '')

      .toLowerCase()

      .trim();

  }

  private convertirANumero(valor: unknown): number {

    if (typeof valor === 'number') {

      return Number.isFinite(valor) ? valor : 0;

    }

    if (typeof valor !== 'string') {

      return 0;

    }

    let valorLimpio = valor.replace(/[^\d,.-]/g, '');

    if (!valorLimpio) {

      return 0;

    }

    const ultimoPunto = valorLimpio.lastIndexOf('.');

    const ultimaComa = valorLimpio.lastIndexOf(',');

    if (ultimoPunto >= 0 && ultimaComa >= 0) {

      if (ultimaComa > ultimoPunto) {

        valorLimpio = valorLimpio.replace(/\./g, '').replace(',', '.');

      } else {

        valorLimpio = valorLimpio.replace(/,/g, '');

      }

    } else if (ultimaComa >= 0) {

      const decimales = valorLimpio.length - ultimaComa - 1;

      valorLimpio =

        decimales > 0 && decimales <= 2

          ? valorLimpio.replace(',', '.')

          : valorLimpio.replace(/,/g, '');

    } else if (ultimoPunto >= 0) {

      const decimales = valorLimpio.length - ultimoPunto - 1;

      valorLimpio =

        decimales > 0 && decimales <= 2

          ? valorLimpio

          : valorLimpio.replace(/\./g, '');

    }

    const numero = Number(valorLimpio);

    return Number.isFinite(numero) ? numero : 0;

  }

  async guardarPrestamo() {

    if (!this.form.valid) {

      Swal.fire({

        type: 'error',

        title: 'Error',

        text: 'Por favor valide los campos obligatorios, para generar la tabla.'

      });

      return;

    }

    Swal.fire({

      title: '¿Está seguro?',

      text: 'Desea registrar el prestamo?',

      type: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#3085d6',

      cancelButtonColor: '#d33',

      confirmButtonText: '¡Sí!',

      cancelButtonText: '¡No!'

    }).then((result) => {

      if (result.value !== true) {

        return;

      }

      // Tomar una copia antes de limpiar el formulario.
      // Este mismo payload contiene valor_cuota_diaria cuando aplica,
      // por lo que el valor simulado es exactamente el valor que se guarda.
      const payloadPrestamo = this.construirPayloadPrestamo();

      this.prestamosService

        .guardarPrestamo(payloadPrestamo)

        .subscribe({

          next: (response) => {

            console.log('RESPUESTA GUARDAR PRESTAMO:', response);

            const idPrestamo = this.extractPrestamoId(response);

            if (idPrestamo === null) {

              Swal.fire({

                type: 'error',

                title: 'Error',

                text: 'El préstamo fue guardado pero no se recibió su identificador.'

              });

              return;

            }

            // Los documentos usan una copia independiente del formulario.
            // Así podemos dejar la pantalla lista para un préstamo nuevo
            // sin perder los datos del préstamo recién guardado.
            const datosPrestamoGuardado: any = {

              ...this.model,

              ...payloadPrestamo,

              id_prestamo: idPrestamo

            };

            this.prestamosService

              .renderTemplates(datosPrestamoGuardado)

              .subscribe({

                next: (resp) => {

                  console.log('DOCUMENTOS GENERADOS:', resp);

                  const documentos = this.extractRenderedTemplates(resp);

                  if (documentos.length === 0) {

                    console.warn(
                      'El préstamo fue creado, pero no se generaron documentos.'
                    );

                  }

                },

                error: (error) => {

                  console.error('ERROR GENERANDO DOCUMENTOS:', error);

                }

              });

            // IMPORTANTE:
            // limpiar el estado del préstamo anterior SIN reconstruir fields.
            // De esta forma los blur/change/hooks del simulador siguen vivos.
            this.reiniciarFormularioPrestamo();

            Swal.fire({

              type: 'success',

              title: 'Préstamo creado',

              text: 'Se crea satisfactoriamente el prestamo # ' + idPrestamo

            }).then((result) => {
              if (result.value) {
                window.location.reload();
              }
            });
            

          },

          error: (error) => {

            console.error('ERROR GUARDANDO PRESTAMO:', error);

            Swal.fire({

              type: 'error',

              title: 'Error',

              text:
                error?.error?.message ||
                'No fue posible guardar el préstamo.'

            });

          }

        });

    });

  }

  private reiniciarFormularioPrestamo(): void {

    // Volver al modo de captura normal.
    this.cuotaDiariaModificadaManual = false;

    // No dejar la vista en estado de préstamo registrado/documentos.
    this.listarDocumentosPrestamo = false;
    this.plantillas_html = {};
    this.contenidoCombinado = '';

    // Limpiar completamente simulación y resumen.
    this.tableCuotasPrestamo = [];
    this.mostrarTablaResumen = false;
    this.resumenCuotas = this.crearResumenVacio();

    // Modelo base de un préstamo nuevo.
    this.model = {
      interes_equivalente_anual: '0.00',
      valor_cuota_diaria: ''
    };

    /*
     * IMPORTANTE:
     * No se recrea this.fields y no se llama options.resetModel().
     * Los mismos controles Formly conservan sus hooks, blur y change.
     */
    this.form.reset({}, { emitEvent: false });

    // Restaurar estado visual/validación de los controles existentes.
    Object.keys(this.form.controls).forEach((key) => {

      const control = this.form.get(key);

      control?.markAsPristine();
      control?.markAsUntouched();

    });

    // Esperar a que Formly termine de reflejar el reset y luego
    // reaplicar únicamente los defaults de la empresa.
    setTimeout(() => {

      this.cuotaDiariaModificadaManual = false;

      this.aplicarDefaultsEmpresa();

      // Mantener la pantalla en modo de nuevo préstamo.
      this.listarDocumentosPrestamo = false;
      this.tableCuotasPrestamo = [];
      this.mostrarTablaResumen = false;
      this.resumenCuotas = this.crearResumenVacio();

      // Si el sistema por defecto NO es bloque, interés vuelve a estar activo.
      if (!this.esCuotaFijaPorBloque()) {

        this.form.get('porcint')?.enable({
          emitEvent: false,
          onlySelf: true
        });

      }

      this.form.updateValueAndValidity({
        emitEvent: false
      });

    }, 0);

  }

  private construirPayloadPrestamo(): Record<string, unknown> {

    const payload: Record<string, any> = {

      ...this.form.getRawValue()

    };

    payload.fec_inicial = this.obtenerProximaFechaPago(payload.fec_inicial);

    delete payload.interes_equivalente_anual;

    if (this.esCuotaFijaPorBloque()) {

      // La tarifa es solo el valor inicial sugerido.
      // El valor actual del campo es el que se simula y el que se guarda.
      payload.valor_cuota_diaria = this.convertirANumero(
        this.form.getRawValue()?.valor_cuota_diaria
      );

    } else {

      delete payload.valor_cuota_diaria;

    }

    return payload;

  }

  private obtenerProximaFechaPago(fechaBase: unknown): string {

    const fecha = fechaBase instanceof Date

      ? new Date(fechaBase.getTime())

      : new Date(String(fechaBase));

    if (Number.isNaN(fecha.getTime())) {

      return String(fechaBase || '');

    }

    const idPeriodoPago = this.normalizarIdentificador(this.form.value?.id_periodo_pago);

    if (idPeriodoPago === '1') {

      fecha.setDate(fecha.getDate() + 1);

    } else if (idPeriodoPago === '2') {

      fecha.setDate(fecha.getDate() + 7);

    } else if (idPeriodoPago === '3') {

      fecha.setDate(fecha.getDate() + 15);

    } else if (idPeriodoPago === '4') {

      fecha.setMonth(fecha.getMonth() + 1);

    } else if (idPeriodoPago === '5') {

      fecha.setFullYear(fecha.getFullYear() + 1);

    }

    return this.formatearFechaLocal(fecha);

  }

  private formatearFechaLocal(fecha: Date): string {

    const ano = fecha.getFullYear();

    const mes = String(fecha.getMonth() + 1).padStart(2, '0');

    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;

  }

  combinarContenido(response: any): void {

    const templates = this.extractRenderedTemplates(response);

    if (!Array.isArray(response) && templates.length === 0) {

      console.error('Response no es un arreglo:', response);

      return;

    }

    this.contenidoCombinado = templates

      .map((item) => {

        const contenidoLimpio = this.limpiarHTML(item.plantilla_html);

        return `

          <div>

            ${contenidoLimpio}

            <hr style="page-break-after: always;">

          </div>

        `;

      })

      .join('');

    console.log('Contenido combinado:', this.contenidoCombinado);

  }

  modalAdicionarEmpresa() {

    const dialogRef = this.dialog.open(CrearClienteComponent, {

      width: '95vw',

      maxWidth: '1400px',

      maxHeight: '92vh',

      autoFocus: false,

      disableClose: true,

      panelClass: 'crear-cliente-dialog',

      backdropClass: 'crear-cliente-backdrop'

    });

    dialogRef.afterClosed().subscribe(async (clienteCreado) => {

      if (!clienteCreado) {

        return;

      }

      await this.recargarClientes(clienteCreado.id || null);

      Swal.fire({

        type: 'success',

        title: 'Cliente creado',

        text: 'El cliente nuevo ya está disponible para seleccionar.'

      });

    });

  }

  private async recargarClientes(clienteId?: number): Promise<void> {

    this.listaClientes = await this.clienteService.getClientes();

    const raiz = this.fields && this.fields.length ? this.fields[0] : null;

    const fieldCliente =

      raiz && raiz.fieldGroup

        ? raiz.fieldGroup.find((field) => field.key === 'id_cliente')

        : null;

    if (fieldCliente && fieldCliente.templateOptions) {

      fieldCliente.templateOptions.options = this.listaClientes;

    }

    if (clienteId) {

      this.model.id_cliente = clienteId;

      this.form.patchValue({ id_cliente: clienteId });

    }

    this.form.updateValueAndValidity();

  }

  limpiarHTML(html: string): string {

    return html

      .replace(/<html[^>]*>/gi, '')

      .replace(/<\/html>/gi, '')

      .replace(/<head[^>]*>.*?<\/head>/gi, '')

      .replace(/<body[^>]*>/gi, '')

      .replace(/<\/body>/gi, '');

  }

  private extractPrestamoId(response: unknown): number | string | null {

    if (typeof response === 'number' || typeof response === 'string') {

      return response;

    }

    if (response && typeof response === 'object') {

      const record = response as Record<string, unknown>;

      const candidates = [

        record.id_prestamo,

        record.id,

        record.idPrestamo,

        record.idprestamo,

        (record.data as Record<string, unknown> | undefined)?.id_prestamo,

        (record.data as Record<string, unknown> | undefined)?.id,

        (record.data as Record<string, unknown> | undefined)?.idPrestamo,

        (record.data as Record<string, unknown> | undefined)?.idprestamo

      ];

      for (const candidate of candidates) {

        if (typeof candidate === 'number' || typeof candidate === 'string') {

          return candidate;

        }

      }

    }

    return null;

  }

  private extractRenderedTemplates(

    response: unknown

  ): Array<{ plantilla_html: string }> {

    if (Array.isArray(response)) {

      return response

        .map((item) => this.mapToTemplate(item))

        .filter((item): item is { plantilla_html: string } => item !== null);

    }

    if (typeof response === 'string') {

      try {

        return this.extractRenderedTemplates(JSON.parse(response));

      } catch (_error) {

        return [];

      }

    }

    if (response && typeof response === 'object') {

      const record = response as Record<string, unknown>;

      const mapped = this.mapToTemplate(record);

      if (mapped) {

        return [mapped];

      }

      const nestedCandidates = [

        record.data,

        record.documentos,

        record.templates,

        record.plantillas_html,

        record.result,

        record.rendered

      ];

      for (const candidate of nestedCandidates) {

        if (candidate !== undefined) {

          const extracted = this.extractRenderedTemplates(candidate);

          if (extracted.length > 0) {

            return extracted;

          }

        }

      }

    }

    return [];

  }

  private mapToTemplate(value: unknown): { plantilla_html: string } | null {

    if (typeof value === 'string') {

      return { plantilla_html: value };

    }

    if (!value || typeof value !== 'object') {

      return null;

    }

    const record = value as Record<string, unknown>;

    const rawTemplate = [

      record.plantilla_html,

      record.rendered,

      record.html,

      record.contenido

    ].find((candidate) => typeof candidate === 'string');

    if (typeof rawTemplate === 'string') {

      return { plantilla_html: rawTemplate };

    }

    return null;

  }

}
