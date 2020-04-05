import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';
import { HospitalService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService,
    public router: Router,
    public activateRouter: ActivatedRoute
  ) {
    activateRouter.params.subscribe( params => {
      const id = params['id'];

      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }

    });

   }

  ngOnInit() {
    this._hospitalService.cargarHospitales()
    .subscribe( (hospitales) => this.hospitales = hospitales
    );
    this._modalUploadService.notification
      .subscribe( (resp: any) => {
       this.medico.img = resp.medico.img;
      });
  }

  cargarMedico(id: string) {
    this._medicoService.cargarMedico(id)
    .subscribe( medico => {
      this.medico = medico;
      this.medico.hospital = medico.hospital._id;
      this.cambioHospital(this.medico.hospital);
    } );
  }

  guardarMedico(f: NgForm ) {
    if ( f.invalid ) {
      return;
    }
    console.log('medico ' + this.medico);
    this._medicoService.upsertMedico(this.medico)
    .subscribe( medico => {
      this.medico._id = medico._id;
      this.router.navigate(['/medico', medico._id]);
    });
  }

  cambioHospital(id: string) {
    this._hospitalService.obtenerHospital(id)
    .subscribe( hospital => this.hospital = hospital);
  }

  actualizarFoto() {
    this._modalUploadService.mostrarModal('medicos', this.medico._id);
 }

}
