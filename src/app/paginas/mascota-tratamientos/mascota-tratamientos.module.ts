import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MascotaTratamientosPage } from './mascota-tratamientos.page';

const routes: Routes = [
  {
    path: '',
    component: MascotaTratamientosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MascotaTratamientosPage]
})
export class MascotaTratamientosPageModule {}
