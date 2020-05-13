import { Component, OnInit } from '@angular/core';
import { Mascota, TipoTratamiento, Especie, MascotasService } from 'src/app/servicios/mascotas/mascotas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mascota',
  templateUrl: './mascota.page.html',
  styleUrls: ['./mascota.page.scss'],
})
export class MascotaPage implements OnInit {

  mascota : Mascota = new Mascota('',Especie.perro,'',0,'',null,'');
  mascotaId : any = null;
  imagen : any;
  tipoVacuna : TipoTratamiento = TipoTratamiento.vacunas;
  tipoDesparasitacionesExternas : TipoTratamiento = TipoTratamiento.desparasitacionesExternas;
  tipoDesparasitacionesInternas : TipoTratamiento = TipoTratamiento.desparasitacionesInternas;
  tipoOtros : TipoTratamiento = TipoTratamiento.otros;
  constructor(private mascotaService: MascotasService,
    private route: ActivatedRoute, 
    public toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router:Router) { 
      
  }


  ngOnInit() {
    this.mascotaId = this.route.snapshot.params['id'];
    this.CargarMascota();
  }

  CargarMascota(){
    if(this.mascotaId){
      this.loadMascota();
    }else{

      this.mascotaService.getUltimaMascotaId().then(res => {
        this.mascotaId = res;

        if(this.mascotaId == null){
          this.router.navigate(['mascotas']);
        }
        else{
          this.mascotaService.getUltimaMascota().then(res => {
            res.subscribe(mascota =>{
              if(mascota){
                this.actualizarMascota(Mascota.fromIMascota(mascota));
              }else{
                this.router.navigate(['mascotas']);
              }
            })
          });
        }
      });
    }
  }

  async loadMascota(){
    const loading = await this.loadingController.create({
      message: ' Cargando Mascota...'
    });
    await loading.present();

    this.mascotaService.getMascota(this.mascotaId).subscribe(res => {
      loading.dismiss();
      this.actualizarMascota(Mascota.fromIMascota(res));
    })
  }

  actualizarMascota(mascota:Mascota){
    this.mascota = mascota;
    this.imagen = mascota.getImagen();
  }


  async presentAlertCompartirMascota() {
    const alert = await this.alertController.create({
      header: 'Compartir',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email del usuario a compartir'
        },
        
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Enviar',
          handler: data => {
            if(this.validateEmail(data.email)){
              this.mascotaService.compartirMascota(this.mascotaId,data.email);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  
  remove(){
    if(this.mascota.imagen != ''){
      this.mascotaService.removeImagenMascota(this.mascota.imagen).then(async r => {
        
        this.borrar();
          
      }, error => {
        this.presentToast("Se ha producido un error al intentar borrar la imagen de su mascota");
      });
    }else{
      this.borrar();
    }
   
  }

  borrar(){
    this.mascotaService.removeMascota(this.mascotaId).then(() =>{
      this.router.navigate(['mascotas']);
    });
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 4000
    });
    toast.present();
  }
}

