import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { HospitalService } from '../hospital/hospital.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _hospitalService: HospitalService,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos() {
    const url = URL_SERVICIOS + '/medico';

    return this.http.get(url).pipe(
      map( (resp: any) => {
        this.totalMedicos = resp.total;
        return resp.medicos;
      })
    );
  }

  upsertMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';
    if (medico._id ) {
      // actualizar
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put( url, medico).pipe(
        map((resp: any) => {
         swal('Medico actualizado', medico.nombre, 'success');
         return resp.medico;
         }));
    } else {
      // crear
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, medico).pipe(
        map((resp: any) => {
         swal('Medico creado', medico.nombre, 'success');
         return resp.medico;
         }));
    }
  }

  buscarMedicos(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get(url).pipe(
      map( ( (resp: any) => {
        this.totalMedicos = resp.medicos.length;
        return resp.medicos;
      })
    ));
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url).pipe(
      map( (resp: any) => {
        swal('Medico borrado', 'Médico ha sido eliminado correctamente', 'success');
        return true;
      })
    );
  }

  cargarMedico(id: string) {
    const url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url).pipe(map( (resp: any) => resp.medico));
  }
}
