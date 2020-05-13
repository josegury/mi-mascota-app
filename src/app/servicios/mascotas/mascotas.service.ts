import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';

export interface ITratamiento{
  tipo:TipoTratamiento;
  nombre: string;
  fecha: string;
  notas:string;
  proximo_tratamiento: string;
}

export interface IMascota{
  nombre: string;
  especie: Especie;
  nacimiento: string;
  peso: number;
  raza: string;
  imagen: any;
}

export interface IPropietario{
  uid_usuario: any;
  uid_mascota: any;
}

export class Mascota implements IMascota{

  
  constructor(public nombre: string, public especie: Especie,public nacimiento: string,public peso: number,public raza: string, public id: string, public imagen: string){}

  getImagen(){
    if(this.imagen != "" && this.imagen != null)
      return this.imagen;
     else
     { 
      switch(this.especie){
        case Especie.gato:
          return "assets/icon/animals/cat.svg";
          break;
        case Especie.otro:
          return "assets/icon/animals/dinosaur.svg";
          break;
        default:
          return "assets/icon/animals/dog.svg";

      }
    }
  }

  static fromIMascota(data: any) {
    return new this(data.nombre,data.especie,data.nacimiento,data.peso,data.raza,data.id,data.imagen);
  }

  toIMascota(){
    let imascota : IMascota = {
      nombre : this.nombre,
      especie : this.especie,
      nacimiento : this.nacimiento,
      peso : this.peso,
      raza : this.raza,
      imagen: this.imagen,
    }
    return imascota;
  }
}
export enum Especie{
  perro = "Perro",
  gato = "Gato",
  otro = "Otro"
}
export enum TipoTratamiento{
  vacunas = "Vacunas",
  desparasitacionesExternas = "Desparasitaciones Externas",
  desparasitacionesInternas = "Desparasitaciones Internas",
  otros = "Otros Tratamientos"
}


@Injectable({
  providedIn: 'root'
})
export class MascotasService {

  private mascotasCollection: AngularFirestoreCollection<Mascota>;
  private mascotas: Observable<IMascota[]>;

  private currentUser;
  private snapshotChangesSubscription: any;
  COLLECTION_PROPIETARIOS = 'propietarios';
  COLLECTION_USER = 'usuarios';
  COLLECTION_MASCOTAS= 'mascotas';
  COLLECTION_TRATAMIENTOS= 'tratamientos';
  ULTIMO_ID_MASCOTA = 'ultima_mascota'

  constructor(private db: AngularFirestore, 
    private storage:Storage) { 
  }

  
  

  getColletcion(){
    return this.db.collection<IMascota>(this.COLLECTION_MASCOTAS);
    }

  getCollectionMascotasUsuario(){
    let currentUser = firebase.auth().currentUser;
    return this.getCollercionMascotaUsuarioByEmail(currentUser.email);
  }

  getCollercionMascotaUsuarioByEmail(email){
    return this.db.collection(this.COLLECTION_USER).doc(email).collection(this.COLLECTION_MASCOTAS);
  }


  getColletcionTratamientos(idMascota){
    return this.getColletcion().doc(idMascota).collection<ITratamiento>(this.COLLECTION_TRATAMIENTOS);
  }

  getMascotas(){
    return this.getCollectionMascotasUsuario().snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id,...data};
        });
      })
    );
  }

  getMascota(id){
    this.storage.set(this.ULTIMO_ID_MASCOTA,id)
    return this.getMascotaSinGuardarUltima(id);
  }
  getMascotaSinGuardarUltima(id){
    return this.getColletcion().doc<IMascota>(id).valueChanges();
  }

  updateMascota(mascota:IMascota, id:string){
    return this.editData(this.getColletcion().doc(id).update(mascota));
    
  }

  addMascota(mascota:IMascota){
    return this.editData(this.getColletcion().add(mascota).then(data => {
      this.getCollectionMascotasUsuario().doc(data.id).set({id:data.id});
    }));
  }

  removeMascota(id){
    return this.editData(this.getColletcion().doc(id).delete().then(data => {
      this.getCollectionMascotasUsuario().doc(id).delete();
    }));
  }

  compartirMascota(idMascota,email){
    this.editData(this.getCollercionMascotaUsuarioByEmail(email).add({id:idMascota}));
  }

  async getUltimaMascota(){
    let id =  await this.storage.get(this.ULTIMO_ID_MASCOTA)
    return this.getColletcion().doc<IMascota>(id).valueChanges();
  }

  async removeUltimaMascotaLocal(){
    return  await this.storage.remove(this.ULTIMO_ID_MASCOTA)
  }

  async getUltimaMascotaId(){
    return  await this.storage.get(this.ULTIMO_ID_MASCOTA)
  }

  getTratamientos(idMascota){
    return this.getColletcionTratamientos(idMascota).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id,...data};
        });
      })
    );
  }

  getTratamiento(idMascota,id){
    return this.getColletcionTratamientos(idMascota).doc<ITratamiento>(id).valueChanges();
  }

  updatTratamiento(idMascota,tratamiento:ITratamiento, id:string){
    return this.editData(this.getColletcionTratamientos(idMascota).doc(id).update(tratamiento));
  }

  addTratamiento(idMascota,tratamiento:ITratamiento){
    return this.editData(this.getColletcionTratamientos(idMascota).add(tratamiento));
  }

  removeTratamiento(idMascota, id){
    return this.editData(this.getColletcionTratamientos(idMascota).doc(id).delete());
  }

  editData(obj){
    // If internet connection is available
    if(navigator.onLine && obj instanceof Promise && typeof obj.then === 'function') {
      return obj;
    }
    else {
    return new Promise((resolve, reject) => {
      resolve();
    });
    }
  }

  uploadImagenMascota( imagen) {
    let currentUser = firebase.auth().currentUser;
    let storageRef = firebase.storage().ref();
    let randomId = Math.random().toString(36).substr(2, 5);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child("images/mascotas/" + currentUser.uid + "-" + randomId + ".jpg");

    return imageRef.putString(imagen, firebase.storage.StringFormat.DATA_URL);
  }
  removeImagenMascota(url:string) {
    let start = url.indexOf("images%2Fmascotas%2F");
    let end = url.indexOf(".jpg");
    let nombre = url.substring(start,end).replace("images%2Fmascotas%2F",'');
    
    var desertRef = firebase.storage().ref().child('images/mascotas/' + nombre + '.jpg');
      // Delete the file
    return desertRef.delete();

  }

  
}
