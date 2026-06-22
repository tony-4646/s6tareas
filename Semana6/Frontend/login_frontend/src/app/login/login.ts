import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  datosUsuario = {
    Nombre_Usuario: '',
    Contrasena: '',
  };

  constructor(
    private Auth: Auth,
    private router: Router,
  ) {}

  onLogin(event?: Event): void {
    if (event) {
    event.preventDefault(); 
  }

    this.Auth.login(this.datosUsuario).subscribe({
      next: (response) => {
        console.log('Respuesta:', response);
        alert(response.mensaje); 

        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        alert('Usuario o contraseña incorrectos.');
      },
    });
  }
}
