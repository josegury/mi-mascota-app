import { Component, OnInit } from '@angular/core';
import { TipoTratamiento, ITratamiento, MascotasService } from 'src/app/servicios/mascotas/mascotas.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-mascota-tratamiento',
  templateUrl: './mascota-tratamiento.page.html',
  styleUrls: ['./mascota-tratamiento.page.scss'],
})
export class MascotaTratamientoPage implements OnInit {

  mascotaId = null;
  tratamientoId = null;
  tipoTratamiento : TipoTratamiento = null;
  tratamiento : ITratamiento = {tipo: TipoTratamiento.otros, nombre:"", fecha:"", proximo_tratamiento:"", notas:""}
  maxDate: any = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString();
  minDate: any = new Date(2019,1,1).toISOString();

  constructor(private mascotaService: MascotasService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private nav: NavController) {
  }

  ngOnInit() {
    this.tratamientoId = this.route.snapshot.params['id'];
    this.mascotaId = this.route.snapshot.params['idMascota'];
    this.tipoTratamiento = this.route.snapshot.params['tipo'];
    this.tratamiento.tipo = this.tipoTratamiento;
    if(this.tratamientoId){
      this.loadTratamiento();
    }
  }

  async loadTratamiento(){
    const loading = await this.loadingController.create({
      message: ' Cargando Tratamiento...'
    });
    await loading.present();

    this.mascotaService.getTratamiento(this.mascotaId,this.tratamientoId).subscribe(res => {
      this.tratamiento = res;
      loading.dismiss();
    })
  }

  async guardar(){
    const loading = await this.loadingController.create({
      message: ' Guardando Tratamiento...'
    });
    await loading.present();

    if(this.tratamientoId){
      this.mascotaService.updatTratamiento(this.mascotaId, this.tratamiento,this.tratamientoId ).then(() =>{
        loading.dismiss();
        this.nav.back();
      });
    }else{
      this.mascotaService.addTratamiento(this.mascotaId,this.tratamiento).then(() =>{
        loading.dismiss();
        this.nav.back();
      });
    }
  }


}
