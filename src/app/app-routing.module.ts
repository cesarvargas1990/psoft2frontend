import { EmpresaParametrosComponent } from './_component/parametros/empresa-parametros/empresa-parametros.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { DashboardComponent } from './_component/dashboard/dashboard.component';
import { LoginComponent } from './_component/login/login.component';
import { ListarClienteComponent } from './_component/cliente/listar-cliente/listar-cliente.component';
import { CrearClienteComponent } from './_component/cliente/crear-cliente/crear-cliente.component';
import { CrearPrestamoComponent } from './_component/cliente/crear-prestamo/crear-prestamo.component';
import { CrearDocumentoComponent } from './_component/parametros/crear-documento/crear-documento.component';
import { LogoutComponent } from './_component/logout/logout.component';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'clientes',
    children: [
      {
        path: 'crear',
        component: CrearClienteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listar',
        component: ListarClienteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'crearPrestamo',
        component: CrearPrestamoComponent,
        canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: 'parametros',
    children: [
      {
        path: 'documentos',
        component: CrearDocumentoComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'empresa',
        component: EmpresaParametrosComponent,
        canActivate: [AuthGuard],
      },
    ],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
