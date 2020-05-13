import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/Auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email requerido.' },
      { type: 'pattern', message: 'Por favor, introduce un email correcto' }
    ],
    'password': [
      { type: 'required', message: 'Contraseña requerida.' },
      { type: 'minlength', message: 'La contraseña debe contener al menos 5 caracteres.' }
    ]
  };

  validations_form: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  tryLogin(value){
    if(this.validations_form.valid){
      this.authService.doLogin(value).then(res => {
      
        this.router.navigate(['mascotas'], {replaceUrl:true});
      }, err => {
        this.errorMessage = err.message;
      });
    }
    else{
      this.errorMessage = "Formulario incorrecto"
    }
  }

  googleLogin(){
    this.authService.doLoginGoogle().then(res => {
      alert(res);
      this.router.navigate(['mascotas'], {replaceUrl:true});
    }, err => {
      this.errorMessage = err.message;
      alert("error");
      alert(err);
    });
  }


}
