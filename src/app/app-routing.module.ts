import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { DashboardComponent } from './_component/dashboard/dashboard.component';
import { LoginComponent } from './_component/login/login.component';
import { ListarEmpresasComponent } from './_component/empresa/listar-empresas/listar-empresas.component';
import { CrearEmpresaComponent } from './_component/empresa/crear-empresa/crear-empresa.component';
import { PrefijosEmpresaProvComponent } from './_component/empresa/prefijos-empresa-prov/prefijos-empresa-prov.component';
import { ConsultaFacturaFEComponent } from './_component/factura/consulta-factura-fe/consulta-factura-fe.component';
import { EmpresaProveedorComponent } from './_component/empresa/empresa-proveedor/empresa-proveedor.component';
import { ListarClienteComponent } from './_component/cliente/listar-cliente/listar-cliente.component';
import { CrearClienteComponent } from './_component/cliente/crear-cliente/crear-cliente.component';
import { CrearPrestamoComponent } from './_component/cliente/crear-prestamo/crear-prestamo.component';
import { CrearFormapagoComponent} from './_component/parametros/crear-formapago/crear-formapago.component';

const routes: Routes = [ 

  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {path: 'clientes', children: [
    {path:'crear', component: CrearClienteComponent,
        canActivate: [AuthGuard] } ,
      {path:'listar', component: ListarClienteComponent,
        canActivate: [AuthGuard] }     
        ,
        {path:'crearPrestamo', component: CrearPrestamoComponent,
          canActivate: [AuthGuard] }    
    ]
  },


  {path: 'parametros', children: [
    {path:'formaspago', component: CrearFormapagoComponent,
        canActivate: [AuthGuard] } 
        
    ]
  },

 
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
