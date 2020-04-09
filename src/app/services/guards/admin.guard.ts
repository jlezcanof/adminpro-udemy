import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
//, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService
  ) { }
  canActivate(
    /*next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot*/)/*: Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree*/
    {
    if (this._usuarioService.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      console.log('Bloqueado por el ADMIN GUARD');
      this._usuarioService.logout();
      return false;
    }
  }
  
}
