import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mascotas',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'mascotas', loadChildren: './paginas/mascotas/mascotas.module#MascotasPageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './paginas/login/login.module#LoginPageModule' },
  { path: 'creditos', loadChildren: './paginas/creditos/creditos.module#CreditosPageModule' },
  { path: 'mascota', loadChildren: './paginas/mascota/mascota.module#MascotaPageModule' },
  { path: 'mascota/:id', loadChildren: './paginas/mascota/mascota.module#MascotaPageModule', canActivate: [AuthGuard]  },
  { path: 'mascota-detalle', loadChildren: './paginas/mascota-detalle/mascota-detalle.module#MascotaDetallePageModule', canActivate: [AuthGuard] },
  { path: 'mascota-detalle/:id', loadChildren: './paginas/mascota-detalle/mascota-detalle.module#MascotaDetallePageModule', canActivate: [AuthGuard] },
  { path: 'mascota-tratamiento/:tipo/:idMascota', loadChildren: './paginas/mascota-tratamiento/mascota-tratamiento.module#MascotaTratamientoPageModule', canActivate: [AuthGuard] },
  { path: 'mascota-tratamiento/:tipo/:idMascota/:id', loadChildren: './paginas/mascota-tratamiento/mascota-tratamiento.module#MascotaTratamientoPageModule', canActivate: [AuthGuard] },
  { path: 'mascota-tratamientos/:tipo/:id', loadChildren: './paginas/mascota-tratamientos/mascota-tratamientos.module#MascotaTratamientosPageModule', canActivate: [AuthGuard] },
  { path: 'registro', loadChildren: './paginas/registro/registro.module#RegistroPageModule' },
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
