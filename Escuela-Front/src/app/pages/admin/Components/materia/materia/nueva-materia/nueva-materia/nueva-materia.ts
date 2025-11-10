import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Materia } from '../../../../../../../models/materia.model';
import { CampoFormativoModel } from '../../../../../../../models/campo-formativo.model';
import { Grados } from '../../../../../../../models/grado.models';
import { AsignacionMateriaGrado } from '../../../../../../../models/asignacion-materia-grado.model';
import { ServiciosDirectorMaterias } from '../../../../../Services/servicios-director-materias/servicios-director-materias';
import { ServiciosCampoFormativo } from '../../../../../Services/servicios-director-campo-formativo/servicios-director-campo-formativo';
import { ServiciosDirector } from '../../../../../Services/servicios-director';
import { AlertService } from '../../../../../../../shared/alert-service';
import { firstValueFrom } from 'rxjs';

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
    private serviciosGrados: ServiciosDirector,
    private serviciosAsignacion: ServiciosDirectorMaterias,
    private alertService: AlertService
  ) { }

  // Datos de la materia
  nombre: string = '';
  campoFormativoId: string = '';
  gradoId: string = ''; // ✅ Solo un grado
  estatus: string = 'ACTIVO';

  // Listas para los selects
  camposFormativos: CampoFormativoModel[] = [];
  grados: Grados[] = [];
  
  guardando: boolean = false;

  ngOnInit() {
    this.cargarCamposFormativos();
    this.cargarGrados();
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

  cargarGrados() {
    this.serviciosGrados.obtenerGrados().subscribe({
      next: (res) => {
        this.grados = res;
        console.log('📚 Grados cargados:', this.grados);
      },
      error: (err) => console.error('Error al cargar Grados:', err)
    });
  }

  async guardar() {
    if (!this.nombre.trim() || !this.campoFormativoId || !this.gradoId) {
      this.alertService.show(
        'Por favor complete todos los campos obligatorios',
        'warning',
        'Advertencia'
      );
      return;
    }

    this.guardando = true;

    try {
      // 1️⃣ CREAR MATERIA
      console.log('📤 Creando materia...');
      const materia: Materia = {
        nombre: this.nombre,
        campoFormativoId: this.campoFormativoId,
        estatus: this.estatus
      };

      const respuestaMateria: any = await firstValueFrom(
        this.serviciosMaterias.CrearMateria(materia)
      );

      const materiaId = respuestaMateria.id;
      console.log('✅ Materia creada con ID:', materiaId);

      // 2️⃣ ASIGNAR GRADO A LA MATERIA
      console.log('📤 Asignando grado...');
      const asignacion: AsignacionMateriaGrado = {
        idMateria: materiaId,
        idGrado: this.gradoId
      };

      await firstValueFrom(
        this.serviciosAsignacion.AsignarMateriaGrado(asignacion)
      );

      console.log('✅ Grado asignado');

      // 3️⃣ ÉXITO
      this.alertService.show(
        'Materia creada y grado asignado exitosamente',
        'success',
        'Éxito'
      );

      this.limpiarCampos();
      this.cerrar.emit(materia);

    } catch (error: any) {
      console.error('❌ Error:', error);
      
      this.alertService.show(
        'Error al crear la materia',
        'danger',
        'Error'
      );
    } finally {
      this.guardando = false;
    }
  }

  cerrarModal() {
    this.limpiarCampos();
    this.cerrar.emit(null);
  }

  limpiarCampos() {
    this.nombre = '';
    this.campoFormativoId = '';
    this.gradoId = '';
    this.estatus = 'ACTIVO';
  }
}