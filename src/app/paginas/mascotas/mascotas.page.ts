import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase/app';
import { Mascota, MascotasService } from 'src/app/servicios/mascotas/mascotas.service';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
})
export class MascotasPage implements OnInit {

  mascotas : Mascota[] = [];
  observerMascotas : Subscription;

  constructor(
    private mascotaService: MascotasService,
    private loadingController: LoadingController,
    public toastController: ToastController,
    private route: ActivatedRoute ) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.cargarMascotas();
      } else {
        if(this.observerMascotas) 
          this.observerMascotas.unsubscribe();
      }
    });
  }

  cargarMascotas(){
    if(this.observerMascotas) 
      this.observerMascotas.unsubscribe();

    this.observerMascotas = this.mascotaService.getMascotas().subscribe(res => {
      this.mascotas = [];
      res.map(obj => {
        this.cargarMascota(obj);
      });
    });
  }
  cargarMascota(obj){
    return new Promise((resolve, reject) => { 
          this.mascotaService.getMascotaSinGuardarUltima(obj.id).subscribe(async imascota =>{
          const loading = await this.loadingController.create({
            message: ' Cargando Mascota...'
          });
          try{
            await loading.present();

            if(imascota != undefined){
              let mascota = Mascota.fromIMascota(imascota);
              mascota.id = obj.id;
              let actualizada = this.buscarActualizarMascota(mascota);
              if(! actualizada){
                this.mascotas.push(mascota);
              }
            }
          }
          finally{
            loading.dismiss();
            resolve(true);
          }
        });
    });
  }

  doRefresh(event) {
    this.cargarMascotas();
    event.target.complete();
  }

  buscarActualizarMascota(mascotaActualizada){
    let actualizada = false;
    let index = 0;

     this.mascotas.forEach(mascota =>{
      if(mascota.id == mascotaActualizada.id){
        actualizada=true;
        this.mascotas.splice(index, 1, mascotaActualizada);
      }
      index ++;
    });

    return actualizada;
  }


  remove(item){
    if(item.imagen != ''){
      this.mascotaService.removeImagenMascota(item.imagen).then(async r => {
        
        this.borrar(item);
          
      }, error => {
        this.presentToast("Se ha producido un error al intentar borrar la imagen de su mascota");
      });
    }else{
      this.borrar(item);
    }
   
  }

  borrar(item){
    this.mascotaService.removeMascota(item.id);
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 4000
    });
    toast.present();
  }

}
