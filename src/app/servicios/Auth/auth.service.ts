import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private gplus: GooglePlus){
  }

  doRegister(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

  doLogin(value){
   return new Promise<any>((resolve, reject) => {
    
     firebase.auth().signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => {
         resolve(res)
        },
       err => reject(err))
   })
  }

  async doLoginGoogle(){
    //login nativo
    const gplusUser = await this.gplus.login({
      'webClientId' : '209694650255-bt1hl3mgbbt0brt4dqiofgpvhvftqtfa.apps.googleusercontent.com',
      'offline': true,
      'scopes' : 'profile email'
    });
    
    return await firebase.auth().signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
    );

    //login web
    /*return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
        res => {
          resolve(res)
        },
        err => reject(err));
    })*/
  }

  doLogoutGoogle(){
    this.gplus.logout();
  }

  doLogout(){
    try{
      this.doLogoutGoogle();
    }
    catch{
      
    }
    return new Promise((resolve, reject) => {

      if(firebase.auth().currentUser){
        firebase.auth().signOut()
        .then(() => {
          resolve(true);
        }).catch((error) => {
          reject(false);
        });
      }
    })
  }


}
