import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MascotaDetallePage } from './mascota-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: MascotaDetallePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MascotaDetallePage]
})
export class MascotaDetallePageModule {}
