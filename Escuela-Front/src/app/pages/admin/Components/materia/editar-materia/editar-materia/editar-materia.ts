import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Materia } from '../../../../../../models/materia.model';
import { CampoFormativoModel, Combo } from '../../../../../../models/campo-formativo.model';
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
  camposFormativos: Combo[] = [];

  ngOnInit() {
    this.cargarCamposFormativos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['materia'] && this.materia) {
      this.cargarDatosMateria();
    }
  }

  cargarCamposFormativos() {
    this.serviciosCamposFormativos.ObtenerCampoFormativoA().subscribe({
      next: (res) => {
        this.camposFormativos = res;
        console.log('📋 Campos Formativos cargados:', this.camposFormativos);
      },
      error: (err) => console.error('Error al cargar Campos Formativos:', err)
    });
  }

  cargarDatosMateria() {
    if (this.materia) {
      console.log('📥 Cargando datos de materia:', this.materia);
      
      this.nombre = this.materia.nombre;
      this.campoFormativoId = this.materia.campoFormativoId;
      this.estatus = this.materia.estatus;
      
      console.log('✅ Datos cargados en el formulario:', {
        nombre: this.nombre,
        campoFormativoId: this.campoFormativoId,
        estatus: this.estatus
      });
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

    // ✅ INCLUIR EL ID en el body (según el Swagger)
    const materiaActualizada: Materia = {
      id: this.materia.id,           // ✅ INCLUIR ID
      nombre: this.nombre,
      campoFormativoId: this.campoFormativoId,
      estatus: this.estatus
    };

    console.log('📋 Materia ORIGINAL:', this.materia);
    console.log('📤 Materia ACTUALIZADA a enviar:', materiaActualizada);
    console.log('🆔 ID de la materia:', this.materia.id);
    console.log('📝 Campo Formativo seleccionado:', this.campoFormativoId);

    this.serviciosMaterias.ActualizarMateria(this.materia.id, materiaActualizada).subscribe({
      next: (mensaje) => {
        console.log('✅ Respuesta del servidor:', mensaje);
        
        this.alertService.show(
          'Materia actualizada exitosamente',
          'success',
          'Éxito'
        );

        this.cerrar.emit(true);
      },
      error: (err) => {
        console.error('❌ Error completo:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Error response:', err.error);
        
        this.alertService.show(
          err.error || 'Error al actualizar la materia',
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