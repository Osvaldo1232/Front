import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Materia } from '../../../../../../../models/materia.model';
import { CampoFormativoModel } from '../../../../../../../models/campo-formativo.model';
import { ServiciosDirectorMaterias } from '../../../../../Services/servicios-director-materias/servicios-director-materias';
import { ServiciosCampoFormativo } from '../../../../../Services/servicios-director-campo-formativo/servicios-director-campo-formativo';
import { AlertService } from '../../../../../../../shared/alert-service';

@Component({
  selector: 'app-nueva-materia',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nueva-materia.html',
  styleUrl: './nueva-materia.scss'
})
export class NuevaMateria implements OnInit {
  @Input() nuevo: boolean = false;
  @Output() cerrar = new EventEmitter<Materia | null>();

  constructor(
    private serviciosMaterias: ServiciosDirectorMaterias,
    private serviciosCampoFormativo: ServiciosCampoFormativo,
    private alertService: AlertService
  ) { }

  // Datos de la materia
  nombre: string = '';
  campoFormativoId: string = '';
  estatus: string = 'ACTIVO';

  // Lista de campos formativos
  camposFormativos: CampoFormativoModel[] = [];

  ngOnInit() {
    this.cargarCamposFormativos();
  }

  cargarCamposFormativos() {
    this.serviciosCampoFormativo.ObtenerCampoFormativo().subscribe({
      next: (res) => {
        this.camposFormativos = res;
        console.log('📋 Campos Formativos cargados:', this.camposFormativos);
      },
      error: (err) => console.error('Error al cargar Campos Formativos:', err)
    });
  }

  guardar() {
    if (!this.nombre.trim() || !this.campoFormativoId) {
      this.alertService.show(
        'Por favor complete todos los campos obligatorios',
        'warning',
        'Advertencia'
      );
      return;
    }

    const materia: Materia = {
      nombre: this.nombre,
      campoFormativoId: this.campoFormativoId,
      estatus: this.estatus
    };

    this.serviciosMaterias.CrearMateria(materia).subscribe({
      next: (res) => {


        console.log('✅ Materia creada:', res.id);

        if(res.id){

        }
        
        this.alertService.show(
          'Materia creada exitosamente',
          'success',
          'Éxito'
        );

        this.limpiarCampos();
        this.cerrar.emit(materia);
      },
      error: (err) => {
        console.error('❌ Error al crear materia:', err);
        
        this.alertService.show(
          'Error al crear la materia',
          'danger',
          'Error'
        );
      }
    });



  }


  AsignarMt(idmateria:any){
    

  }
  cerrarModal() {
    this.limpiarCampos();
    this.cerrar.emit(null);
  }

  limpiarCampos() {
    this.nombre = '';
    this.campoFormativoId = '';
    this.estatus = 'ACTIVO';
  }
}