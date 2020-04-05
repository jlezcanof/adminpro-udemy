import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { Router } from '@angular/router';
declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  constructor(
    public _medicoService: MedicoService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
    this._modalUploadService.notification
      .subscribe( resp => this.cargarMedicos());
  }

  cargarMedicos() {
    this._medicoService.cargarMedicos()
    .subscribe( medicos => this.medicos = medicos);
  }

  

  buscarMedico(termino: string ) {
    if (termino.length <= 0 ) { 
      this.cargarMedicos();
      return;
     }

    this._medicoService.buscarMedicos(termino)
      .subscribe( medicos => this.medicos = medicos);
  }

  borrarMedico(medico: Medico) {
    swal({
      title: '¿ Esta seguro ?',
      text: 'Está a punto de borrar el medico ' + medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        this._medicoService.borrarMedico(medico._id)
          .subscribe( () => this.cargarMedicos());
      }
    });
  }

}
