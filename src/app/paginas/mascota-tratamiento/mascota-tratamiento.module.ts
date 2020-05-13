import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MascotaTratamientoPage } from './mascota-tratamiento.page';

const routes: Routes = [
  {
    path: '',
    component: MascotaTratamientoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MascotaTratamientoPage]
})
export class MascotaTratamientoPageModule {}
