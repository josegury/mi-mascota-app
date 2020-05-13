import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';

export class Usuario{
  constructor(
    public nombre:string = "",
    public email: string= "",
    public urlImagen: string= ""){}

  static fromFirebase(data: any) {
    try{
    return new this(data.displayName,data.email,data.photoURL);
    }catch{
      return new this();
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  COLLECTION_USER = 'usuarios';

  constructor(private db: AngularFirestore, private storage:Storage) { }

  addUsuario(email){
    return this.db.collection(this.COLLECTION_USER).doc(email).set({email:email});
  }

  usuarioLogueado(){
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    
  }


}
