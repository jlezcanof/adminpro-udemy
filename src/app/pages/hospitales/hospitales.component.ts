import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;

  cargando: boolean = false;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notification
      .subscribe( () => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales()
      .subscribe( (resp: any) => {
        this.hospitales = resp;
        this.cargando = false;
      });
  }

  buscarHospital(termino: string ) {
    if (termino.length <= 0 ) {
     this.cargarHospitales();
     return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospital(termino)
      .subscribe( (hospitales: Hospital[]) => {
        this.hospitales = hospitales;
        this.cargando = false;
    } );
  }

  actualizarImagen(hospital: Hospital) {
    this._modalUploadService.mostrarModal('hospitales', hospital._id);
 }

  actualizarHospital(hospital: Hospital) {
  this._hospitalService.actualizarHospital(hospital)
    .subscribe();
  }

borrarHospital( hospital: Hospital) {
    swal({
      title: '¿ Esta seguro ?',
      text: 'Está a punto de borrar el hospital ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        this._hospitalService.borrarHospital(hospital._id)
          .subscribe( () => {
            this.cargarHospitales();
          })
        ;
      }
    });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    console.log(desde);

    if (desde >= this._hospitalService.totalHospitales) {
      return;
    }

    if (desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }

  crearHospital() {
    swal({
      title: 'Crear hospital',
      text: 'Ingrese nombre del nuevo hospital',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerModel: true
    })
    .then( (name: string) => {
      if (!name || name.length === 0 ) {
        // button cancel
        return;
      }
      // le pasamos el nombre del hospital para guardar
      this._hospitalService.crearHospital(name)
      .subscribe( () => {
        this.cargarHospitales();
      });
    })
   ;
  }

}
