 import { Injectable } from '@angular/core';
 import { Usuario } from '../../models/usuario.model';
 import { HttpClient } from '@angular/common/http';
 import { URL_SERVICIOS } from '../../config/config';
 import { map } from 'rxjs/operators';
 import swal from 'sweetalert';
 import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';


 @Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
    //console.log('construyendo usuarioservice');
  }

  estaLogueado() {
     return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    this.token = '';
    this.usuario = null;
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }
  }

  logout() {
      this.usuario = null;
      this.token = null;

      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      this.router.navigate(['/login']);
  }


  loginGoogle( token: string) {
    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, {token }).pipe(
      map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
      })
    );
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      this.usuario = usuario;
      this.token = token;
  }

  login(usuario: Usuario, recordar: boolean = false ) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';
    console.log(url);
    return this.http.post(url, usuario).pipe(
      map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
      }));

  }

  crearUsuario( usuario: Usuario) {

  const url = URL_SERVICIOS + '/usuario';

  return this.http.post( url, usuario).pipe(
    map((resp: any) => {
     swal('Usuario creado', usuario.email, 'success');
     return resp.usuario;
     }));
  }

  actualizarUsuario( usuarioaActualizar: Usuario) {

    let url = URL_SERVICIOS + '/usuario/' + this.usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuarioaActualizar).pipe(
      map( (resp: any) => {
          // this.usuario = resp.usuario;
          const usuarioDB: Usuario = resp.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
          swal('Usuario actualizado', usuarioaActualizar.nombre, 'success');

          return true;
      })
    );
  }

  cambiarImagen(arhivo: File, id: string) {
    this._subirArchivoService.subirArchivo(arhivo, 'usuarios', id)
    .then( (resp: any) => {
      this.usuario.img = resp.usuario.img;
      swal('Imagen actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario);
    })
    .catch ( error => {
      console.log(error);
      swal('Imagen no actualizada', this.usuario.nombre, 'error');
    });

  }
}
