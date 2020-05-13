import { Component, OnInit } from '@angular/core';
import { ITratamiento, Mascota, TipoTratamiento, MascotasService } from 'src/app/servicios/mascotas/mascotas.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-mascota-tratamientos',
  templateUrl: './mascota-tratamientos.page.html',
  styleUrls: ['./mascota-tratamientos.page.scss'],
})
export class MascotaTratamientosPage implements OnInit {

  mascotaId = null;
  tratamientos : ITratamiento[] = [];
  mascota : Mascota;
  tipoTratamiento : TipoTratamiento;

  constructor(private mascotaService: MascotasService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private loadingController: LoadingController ) { }

  ngOnInit() {
    this.mascotaId = this.route.snapshot.params['id'];
    this.tipoTratamiento = this.route.snapshot.params['tipo'];
    this.loadTratamientos();
  }

  async loadTratamientos(){
    const loading = await this.loadingController.create({
      message: ' Cargando Tratamientos...'
    });
    await loading.present();
    this.mascotaService.getTratamientos(this.mascotaId).subscribe(res => {
      this.tratamientos = res.filter(t => t.tipo == this.tipoTratamiento ).sort((a, b) => {
        let dateBproximo_tratamiento = new Date (b.proximo_tratamiento);
        let dateAproximo_tratamiento = new Date (a.proximo_tratamiento);
        let timeproximo_tratamiento = dateBproximo_tratamiento.getTime() - dateAproximo_tratamiento.getTime()
        let dateBfecha = new Date (b.fecha);
        let dateAfecha = new Date (a.fecha);
        let timefecha = dateBfecha.getTime() - dateAfecha.getTime();
        return isNaN(timeproximo_tratamiento) ? timefecha : timeproximo_tratamiento;
      });
      loading.dismiss();
    });
  }

  

  remove(id){
    this.mascotaService.removeTratamiento(this.mascotaId,id);
  }

  goToDetails(item){
    let navigationExtras: NavigationExtras = {
      state: {
        tratamiento: item
      }
    };
    this.router.navigate(['mascota-tratamiento'], navigationExtras);
  }

}
