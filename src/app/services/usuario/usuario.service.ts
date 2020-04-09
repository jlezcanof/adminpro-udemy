 import { Injectable } from '@angular/core';
 import { Usuario } from '../../models/usuario.model';
 import { HttpClient } from '@angular/common/http';
 import { URL_SERVICIOS } from '../../config/config';
 import { map } from 'rxjs/operators';
 import { catchError } from 'rxjs/operators';
//import 'rxjs/add/operator/catch';no existe en angular 8
 import swal from 'sweetalert';
 import { Router } from '@angular/router';
 import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
 import { Observable } from 'rxjs/internal/Observable';




 @Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  renuevaToken() {
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get(url).pipe(
      map( (resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        console.log('Token renovado');
        return true;
      }), catchError( err => {
        this.router.navigate(['/login']);
        swal('No se pudo renovar token', 'No fue posible renovar token', 'error');
        return new Observable();
      })
    );
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
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = null;
    }
  }

  logout() {
      this.usuario = null;
      this.token = null;
      this.menu = [];

      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('menu');

      this.router.navigate(['/login']);
  }


  loginGoogle( token: string) {
    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, {token }).pipe(
      map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      })
    );
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('menu', JSON.stringify(menu));

      this.usuario = usuario;
      this.token = token;
      this.menu = menu;
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
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }), catchError( err => {
        swal('Error al logarse', err.error.mensaje, 'error');
        return new Observable();
        //Observable.throw(err);//throwError//TODO ver esto
      })
      );

  }

  crearUsuario( usuario: Usuario) {

  const url = URL_SERVICIOS + '/usuario';

  return this.http.post( url, usuario).pipe(
    map((resp: any) => {
     swal('Usuario creado', usuario.email, 'success');
     return resp.usuario;
     }), catchError( err => {
      swal(err.error.mensaje, err.error.errors.message, 'error');
      return new Observable();
    }));
  }

  actualizarUsuario( usuarioaActualizar: Usuario) {

    let url = URL_SERVICIOS + '/usuario/' + usuarioaActualizar._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuarioaActualizar).pipe(
      map( (resp: any) => {

          if (usuarioaActualizar._id === this.usuario._id) {
            const usuarioDB: Usuario = resp.usuario;
            this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
          }
          swal('Usuario actualizado', usuarioaActualizar.nombre, 'success');
          return true;
      }), catchError( err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return new Observable();
      })
    );
  }
 
  cambiarImagen(arhivo: File, id: string) {
    this._subirArchivoService.subirArchivo(arhivo, 'usuarios', id)
    .then( (resp: any) => {
      this.usuario.img = resp.usuario.img;
      swal('Imagen actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario, this.menu);
    })
    .catch ( error => {
      console.log(error);
      swal('Imagen no actualizada', this.usuario.nombre, 'error');
    });
  }

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get(url).pipe(
      map( ( (resp: any) => resp.usuarios)
    ));
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url).pipe(
      map( (resp: any) => {
        swal('usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
        return true;
      })
    );
  }
}
