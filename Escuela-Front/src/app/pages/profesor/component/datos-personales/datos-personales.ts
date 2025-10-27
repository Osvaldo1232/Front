import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Profesor } from '../../../../models/Profesor';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { ModalEdicionPersonales } from '../../modales/modal-edicion-personales/modal-edicion-personales';


@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalEdicionPersonales],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.scss'
})
export class DatosPersonales implements OnInit {
  usuario!: Profesor;
  perfil: Profesor = {
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    fechaNacimiento: '',
    sexo: '',
    especialidad: '',
    estatus: '',
    telefono: '',
    rfc: '',
    clavePresupuestal: '',
    grado: 'N/A',
    grupo: 'N/A'
  };

  uuid = 'ab717484-1533-4cdf-b904-1f85e86bd33e'

  registroParaEditar: Profesor | null = null;

  constructor(private profesorService: ServiciosProfesor) { }

  get nombreCompleto(): string {
    return `${this.perfil.nombre} ${this.perfil.apellidos}`.trim();
  }

  ngOnInit(): void {
    this.obtenerPerfil();
  }

  obtenerPerfil(): void {
    this.profesorService.obtenerPerfilUsuario(this.uuid).subscribe({
      next: (data: Profesor) => {
        this.usuario = data;
        console.log('Datos del profesor:', this.usuario);
      },
      error: (err) => {
        console.error('Error al obtener perfil', err);
      }
    });
  }
  editar(registro: any) {
    this.registroParaEditar = registro;
  }
  cerrarModal(usuarioEditado: Profesor | null): void {
    this.registroParaEditar = null;

    if (usuarioEditado) {
      this.usuario = usuarioEditado;
    }
  }

}