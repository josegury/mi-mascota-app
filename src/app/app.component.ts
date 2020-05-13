import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { Usuario } from './servicios/Usuarios/usuarios.service';
import { AuthService } from './servicios/Auth/auth.service';
import { Router } from '@angular/router';
import { MascotasService } from './servicios/mascotas/mascotas.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Mascotas',
      url: '/mascotas',
      icon: 'paw'
    },
    {
      title: 'App - Info',
      url: '/creditos',
      icon: 'information-circle'
    }
  ];
  usuario : Usuario = new Usuario();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router:Router, 
    private mascotaService: MascotasService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

     let esApp = this.platform.is('hybrid');

     if(esApp){
      //this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.suscribirseSalir()
     }
      
      //No es necesario inicializar firebase porque lo inicializa el servicio mascotaService en el constructor
      //firebase.initializeApp(environment.firebase);
      
      this.mascotaService.getUltimaMascotaId().then(res => {
          if(res != null){
            this.router.navigate(['mascota']);
          }else{
            this.router.navigate(['mascotas']);
          }
      });
      if(esApp){
        this.splashScreen.hide();
      }
    });
  }
  suscribirseSalir(){
    this.platform.backButton.subscribe(async () => {
      if ((this.router.isActive('/mascota', true) && this.router.url === '/mascota') || (this.router.isActive('/mascotas', true) && this.router.url === '/mascotas')) {
        navigator['app'].exitApp();
      }
    });
  }

  logout(){
    this.authService.doLogout();
    this.usuario = new Usuario();
  }
}
