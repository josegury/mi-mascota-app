import { Component, OnInit } from '@angular/core';
import { Mascota, MascotasService, Especie, IMascota } from 'src/app/servicios/mascotas/mascotas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController, Platform } from '@ionic/angular';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-mascota-detalle',
  templateUrl: './mascota-detalle.page.html',
  styleUrls: ['./mascota-detalle.page.scss'],
})
export class MascotaDetallePage implements OnInit {
  especies : any;
  mascota: Mascota;
  mascotaId = null;
  imagen : any;
  imagenActualizada = false;
  maxDate: any = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString();
  minDate: any = new Date(2019,1,1).toISOString();
  esApp: boolean = false;
  constructor(private mascotaService: MascotasService,
    private route: ActivatedRoute, 
    private loadingController: LoadingController,
    private nav: NavController,
    private camera: Camera, 
    private router:Router, 
    public toastController: ToastController,
    public platform: Platform) { 
      this.especies = this.enumSelector(Especie);
      this.mascota = new Mascota("",Especie.gato,'',0,'','','');
    }

    ngOnInit() {
      this.mascotaId = this.route.snapshot.params['id'];
      if(this.mascotaId){
        this.loadMascota();
      }
      this.esApp = this.platform.is('hybrid');
    }
  
    async loadMascota(){
      const loading = await this.loadingController.create({
        message: ' Cargando Mascota...'
      });
      await loading.present();
  
      this.mascotaService.getMascota(this.mascotaId).subscribe(res => {
        loading.dismiss();
        this.mascota = Mascota.fromIMascota(res);
        this.imagen = this.mascota.getImagen();
      })
    }
    async guardar(){
      if(this.imagenActualizada){
        await this.subirImagen();
      }else{
        await this.guardarMascota();
      }
    }
  
    async guardarMascota(){
        const loading = await this.loadingController.create({
          message: ' Guardando Mascota...'
        });
        await loading.present();
  
      if(this.mascotaId){
        let imascota: IMascota = this.mascota.toIMascota();  
        

        this.mascotaService.updateMascota(imascota, this.mascotaId).then(() =>{
          loading.dismiss();
          this.nav.back();
        }).catch(error =>{
          loading.dismiss();
          this.presentToast("Se ha producido un error al intentar actualizar su mascota");
        });
      }else{
        this.mascotaService.addMascota(this.mascota.toIMascota()).then(() =>{
          loading.dismiss();
          this.nav.back();
        }).catch(error =>{
          loading.dismiss();
          this.presentToast("Se ha producido un error al intentar guardar su mascota");
        }).finally(() => {
          loading.dismiss();
        });
      }
    }
  
    async presentToast(mensaje) {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 4000
      });
      toast.present();
    }
  
    enumSelector(definition) {
      return Object.keys(definition)
        .map(key => ({ value: definition[key], title: key }));
    }
  
    cambiarFoto(){
      const options: CameraOptions = {
        quality: 100,
        targetWidth:250,
        targetHeight:250,
        correctOrientation: true,
        sourceType: PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      
      this.camera.getPicture(options).then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64 (DATA_URL):
       let base64Image = 'data:image/jpeg;base64,' + imageData;
       this.imagen = base64Image;
       this.imagenActualizada = true;
       //this.mascota.imagen = base64Image;
      }, (err) => {
       // Handle error
      });
    }
    
    async subirImagen(){
      
        if(this.mascota.imagen != '' && this.imagenActualizada){
            const loading = await this.loadingController.create({
              message: ' Guardando Mascota...'
            });
            await loading.present();

          this.mascotaService.removeImagenMascota(this.mascota.imagen).then(async r => {
            loading.dismiss();
            
              await this.subirImagenGuardarMascota();
              
          }, error => {
            loading.dismiss();

            this.presentToast("Se ha producido un error al intentar actualizar la imagen de su mascota");
          });
        }else{

          await this.subirImagenGuardarMascota();
        }
    
  }

  async subirImagenGuardarMascota(){
    if(this.imagenActualizada){
      const loading = await this.loadingController.create({
        message: ' Guardando Mascota...'
      });
      await loading.present();

    this.mascotaService.uploadImagenMascota(this.imagen).then((savedPicture) => {
      savedPicture.ref.getDownloadURL().then(async url =>  {
        this.mascota.imagen = url;
        loading.dismiss();   

        await this.guardarMascota(); 
      });      
    }, (err) => {
      loading.dismiss();
      
      this.presentToast("Se ha producido un error al intentar actualizar la imagen de su mascota");
    });
    }
  }
    

}
