
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  //MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  //MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTableModule,
} from '@angular/material';

import { MatSidenavModule } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';



import {NgModule} from '@angular/core';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule } from '@angular/material/sort';
//import {MatPaginatorIntl} from '@angular/material';
import {MatFormFieldModule } from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// Modulos
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule,FormBuilder, FormGroup} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AppRoutingModule} from './app-routing.module';


// Servicios
import {NavService} from '../app/_services/nav.service';
import { AppService } from '../app/_services/app.service';

// Componentes

import {LoginComponent} from './_component/login/login.component';
import {DashboardComponent} from './_component/dashboard/dashboard.component';
import {AppComponent} from './app.component';


import { LoaderService } from './loader.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { LoaderInterceptor } from './loader.interceptor';

import {TopNavComponent} from './_component/top-nav/top-nav.component';
import {ListarEmpresasComponent} from './_component/empresa/listar-empresas/listar-empresas.component';
import {CrearEmpresaComponent} from './_component/empresa/crear-empresa/crear-empresa.component';
import {EliminarEmpresaComponent } from './_component/empresa/listar-empresas/dialogs/eliminar-empresa/eliminar-empresa.component';
import {EditarEmpresaComponent } from './_component/empresa/listar-empresas/dialogs/editar-empresa/editar-empresa.component';
import {AdicionarEmpresaComponent } from './_component/empresa/listar-empresas/dialogs/adicionar-empresa/adicionar-empresa.component';
import {MenuListItemComponent} from './_component/menu-list-item/menu-list-item.component';
import {LogoComponent} from '../app/_component/logo/logo.component';


import { DatePipe } from '@angular/common';


// Custom material (idioma, extensiones y modificaciones a modulos de material. ETC)
//import { MatPaginatorIntlEs } from '../app/_models/paginator_lang_es';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { LoaderComponent } from './loader/loader.component';
import { PrefijosEmpresaProvComponent } from './_component/empresa/prefijos-empresa-prov/prefijos-empresa-prov.component';
import { EditarPrefijoComponent } from './_component/empresa/prefijos-empresa-prov/dialogs/editar-prefijo/editar-prefijo.component';
import { EliminarPrefijoComponent } from './_component/empresa/prefijos-empresa-prov/dialogs/eliminar-prefijo/eliminar-prefijo.component';
import { EdicionarPrefijoComponent } from './_component/empresa/prefijos-empresa-prov/dialogs/edicionar-prefijo/edicionar-prefijo.component';
import { AdicionarPrefijoComponent } from './_component/empresa/prefijos-empresa-prov/dialogs/adicionar-prefijo/adicionar-prefijo.component';
import { ConsultaFacturaFEComponent } from './_component/factura/consulta-factura-fe/consulta-factura-fe.component';

import {FormlyModule,FormlyFieldConfig} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';

/**
 * NgModule that includes all Material modules that are required.
 */

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { EmpresaProveedorComponent } from './_component/empresa/empresa-proveedor/empresa-proveedor.component';
import { AdicionarEmpresaprovFeComponent } from './_component/empresa/empresa-proveedor/dialogs/adicionar-empresaprov-fe/adicionar-empresaprov-fe.component';
import { EliminarEmpresaprovFeComponent } from './_component/empresa/empresa-proveedor/dialogs/eliminar-empresaprov-fe/eliminar-empresaprov-fe.component';
import { EditarEmpresaprovFeComponent } from './_component/empresa/empresa-proveedor/dialogs/editar-empresaprov-fe/editar-empresaprov-fe.component';
import { VisualizarLogComponent } from './_component/factura/consulta-factura-fe/dialogs/visualizar-log/visualizar-log.component';
import { VisualizarVsComponent } from './_component/factura/consulta-factura-fe/dialogs/visualizar-vs/visualizar-vs.component';
import { VisualizarVsfacComponent } from './_component/factura/consulta-factura-fe/dialogs/visualizar-vsfac/visualizar-vsfac.component';
import { VisualizarXmlenviadoComponent } from './_component/factura/consulta-factura-fe/dialogs/visualizar-xmlenviado/visualizar-xmlenviado.component';
import { VisualizarXmlrespComponent } from './_component/factura/consulta-factura-fe/dialogs/visualizar-xmlresp/visualizar-xmlresp.component';


import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { VisualizarJsonrequestComponent } from './_component/factura/consulta-factura-fe/dialogs/visualizar-jsonrequest/visualizar-jsonrequest.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { VisualizarEstadoDocumentoComponent } from './_component/factura/consulta-factura-fe/dialogs/visualizar-estado-documento/visualizar-estado-documento.component';


import { NgxEchartsModule } from 'ngx-echarts';
import { ListarClienteComponent } from './_component/cliente/listar-cliente/listar-cliente.component';
import { EditarClienteComponent } from './_component/cliente/listar-cliente/dialogs/editar-cliente/editar-cliente.component';
import { CrearClienteComponent } from './_component/cliente/crear-cliente/crear-cliente.component';
import { CrearPrestamoComponent } from './_component/cliente/crear-prestamo/crear-prestamo.component';

import { FormlyFieldInput } from './formly-field-input';

import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';

import { CrearFormapagoComponent } from './_component/parametros/crear-formapago/crear-formapago.component';
import { EditarFormapagoComponent } from './_component/parametros/crear-formapago/dialogs/editar-formapago/editar-formapago.component';


import { CrearDocumentoComponent } from './_component/parametros/crear-documento/crear-documento.component';
import { EditarDocumentoComponent } from './_component/parametros/crear-documento/dialogs/editar-documento/editar-documento.component';

import { NgxTinymceModule } from 'ngx-tinymce';

import { SignaturePadModule } from 'ngx-signaturepad';

//import {FirmaWrapperComponent} from './_component/firma/firma-wrapper.component';
import { CargaradjuntosComponent } from './_component/cargaradjuntos/cargaradjuntos/cargaradjuntos.component';
import { ListaPrestamosComponent } from './_component/cliente/lista-prestamos/lista-prestamos.component';
import { ListarPrestamosclienteComponent } from './_component/cliente/listar-cliente/dialogs/listar-prestamoscliente/listar-prestamoscliente.component';


import { ListarDocumentosprestamoComponent } from './_component/dashboard/dialogs/listar-documentosprestamo/listar-documentosprestamo.component';


import {WebcamModule} from 'ngx-webcam';

export function IpValidatorMessage(err, field: FormlyFieldConfig){
  return `"${field.formControl.value}" is not a valid IP Address`;
}

@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule,
    // Modulos Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule,
    // Modulos Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    FormlyMaterialModule,
    HighlightModule,
    NgxJsonViewerModule,
    NgxEchartsModule,
    FormlyMatDatepickerModule,
    FormlyModule.forRoot({
      //wrappers: [
        //{ name: 'firma', component: FirmaWrapperComponent },
      //],
      types: [
        {
          name: 'input',
          component: FormlyFieldInput
        }
      ],
      validationMessages: [
        {name: 'ip',message: IpValidatorMessage},
        {name: 'required',message: 'El campo es obligatorio'}
      ],
    }),
    NgxTinymceModule.forRoot({
      baseURL: './assets/tinymce/',
    }),
    SignaturePadModule,
    WebcamModule,
    
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AppComponent,
    MenuListItemComponent,
    TopNavComponent, 
    // Se Declaran Componentes que de alguna manera implementan angular van aqui
    //(dialogos, o componentes de entrada)
    ListarEmpresasComponent, 
    CrearEmpresaComponent, 
    EliminarEmpresaComponent, 
    AdicionarEmpresaComponent,
    EditarEmpresaComponent,
    LoaderComponent,
    PrefijosEmpresaProvComponent,
    EditarPrefijoComponent,
    EliminarPrefijoComponent,
    EdicionarPrefijoComponent,
    AdicionarPrefijoComponent,
    ConsultaFacturaFEComponent,
    LogoComponent,
    EmpresaProveedorComponent,
    AdicionarEmpresaprovFeComponent,
    EliminarEmpresaprovFeComponent,
    EditarEmpresaprovFeComponent,
    VisualizarLogComponent,
    VisualizarVsComponent,
    VisualizarVsfacComponent,
    VisualizarXmlenviadoComponent,
    VisualizarXmlrespComponent,
    VisualizarJsonrequestComponent,
    VisualizarEstadoDocumentoComponent,
    ListarClienteComponent,
    EditarClienteComponent,
    CrearClienteComponent,
    CrearPrestamoComponent,    
    FormlyFieldInput, 
    CrearFormapagoComponent, 
    EditarFormapagoComponent,

    CrearDocumentoComponent,
    EditarDocumentoComponent,


    //FirmaWrapperComponent, 
    CargaradjuntosComponent,
    ListaPrestamosComponent,
    ListarPrestamosclienteComponent,
    ListarDocumentosprestamoComponent
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    // Se registra como Componentes de entrada (dialogos o componentes que implementaron angular module)
    ListarEmpresasComponent, 
    CrearEmpresaComponent, 
    EliminarEmpresaComponent, 
    AdicionarEmpresaComponent,
    EditarEmpresaComponent,
    EditarPrefijoComponent,
    EliminarPrefijoComponent,
    //EdicionarPrefijoComponent,
    AdicionarPrefijoComponent,
    AdicionarEmpresaprovFeComponent,
    EditarEmpresaprovFeComponent,
    EliminarEmpresaprovFeComponent,
    VisualizarLogComponent,
    VisualizarVsComponent,
    VisualizarVsfacComponent,
    VisualizarXmlenviadoComponent,
    VisualizarXmlrespComponent,
    VisualizarJsonrequestComponent,
    VisualizarEstadoDocumentoComponent,
    EditarClienteComponent,
    EditarFormapagoComponent,
    ListaPrestamosComponent,
    //EditarDocumentoComponent,
    ListarPrestamosclienteComponent,
	  ListarDocumentosprestamoComponent
  ],
  providers: [
    LoaderService,
    NavService,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: getHighlightLanguages()
      }
    },
    
    AppService]
})
export class AppModule {}

export function getHighlightLanguages() {
  return { 
    typescript: () => import('highlight.js/lib/languages/typescript'),
    css: () => import('highlight.js/lib/languages/css'),
    xml: () => import('highlight.js/lib/languages/xml')
  };
}
