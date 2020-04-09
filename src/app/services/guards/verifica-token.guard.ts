import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router) { }

  canActivate(): Promise<boolean> | boolean {
      console.log('token guard');

      const token = this._usuarioService.token;

      const payload = JSON.parse(atob(token.split('.')[1]));

      let expirado = this.expirado(payload.exp);

      if (expirado ) {
        this.router.navigate(['/login']);
        return false;
      }

      return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {

    return new Promise( (resolve, reject) => {

      let tokenExp = new Date(fechaExp * 1000);
      let ahora = new Date();//fecha del navegador web/sistema

      ahora.setTime(ahora.getTime() + (4 * 60 * 60 * 1000));// incrementando 4 horas
      console.log(tokenExp);
      console.log(ahora);

      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        this._usuarioService.renuevaToken()
        .subscribe( () => {
          resolve(true);
        }, () => {
          this.router.navigate(['/login']);
          reject(false);
        });
      }


    });
  }

   expirado(fechaExpiration: number) {
    let ahora = new Date().getTime() / 1000;

    if (fechaExpiration < ahora ) {
      return true;
    } else {
      return false;
    }
  }


}
