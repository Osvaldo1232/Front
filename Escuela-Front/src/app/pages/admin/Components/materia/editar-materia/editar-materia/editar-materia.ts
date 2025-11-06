import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Materia } from '../../../../../../models/materia.model';
import { CampoFormativoModel } from '../../../../../../models/campo-formativo.model';
import { ServiciosDirectorMaterias } from '../../../../Services/servicios-director-materias/servicios-director-materias';
import { ServiciosCampoFormativo } from '../../../../Services/servicios-director-campo-formativo/servicios-director-campo-formativo';
import { AlertService } from '../../../../../../shared/alert-service';

@Component({
  selector: 'app-editar-materia',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-materia.html',
  styleUrl: './editar-materia.scss'
})
export class EditarMateria implements OnInit, OnChanges {
  @Input() editar: boolean = false;
  @Input() materia: Materia | null = null;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private serviciosMaterias: ServiciosDirectorMaterias,
    private serviciosCamposFormativos: ServiciosCampoFormativo,
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['materia'] && this.materia) {
      this.cargarDatosMateria();
    }
  }

  cargarCamposFormativos() {
    this.serviciosCamposFormativos.ObtenerCampoFormativo().subscribe({
      next: (res) => {
        this.camposFormativos = res;
        console.log('📋 Campos Formativos cargados:', this.camposFormativos);
      },
      error: (err) => console.error('Error al cargar Campos Formativos:', err)
    });
  }

  cargarDatosMateria() {
    if (this.materia) {
      this.nombre = this.materia.nombre;
      this.campoFormativoId = this.materia.campoFormativoId;
      this.estatus = this.materia.estatus;
    }
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

    if (!this.materia?.id) {
      this.alertService.show(
        'Error: No se encontró el ID de la materia',
        'danger',
        'Error'
      );
      return;
    }

    const materiaActualizada: Materia = {
      nombre: this.nombre,
      campoFormativoId: this.campoFormativoId,
      estatus: this.estatus
    };

    this.serviciosMaterias.ActualizarMateria(this.materia.id, materiaActualizada).subscribe({
      next: (mensaje) => {
        console.log('✅ Materia actualizada:', mensaje);
        
        this.alertService.show(
          'Materia actualizada exitosamente',
          'success',
          'Éxito'
        );

        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('❌ Error al actualizar materia:', err);
        
        this.alertService.show(
          'Error al actualizar la materia',
          'danger',
          'Error'
        );
      }
    });
  }

  cerrarModal() {
    this.cerrar.emit(false);
  }
}