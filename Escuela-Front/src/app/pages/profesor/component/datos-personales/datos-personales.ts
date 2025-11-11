import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Profesor, ProfesorAsigancionCompleta } from '../../../../models/Profesor';
import { ServiciosProfesor } from '../../services/servicios-profesor';
import { ModalEdicionPersonales } from '../../modales/modal-edicion-personales/modal-edicion-personales';
import { LoginService } from '../../../../services/login-service';
import { Loading } from '../../../../shared/loading/loading';
import { LoadingService } from '../../../../shared/loading-service';


@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalEdicionPersonales, Loading],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.scss'
})
export class DatosPersonales implements OnInit {
  usuario!: Profesor;
  usuario1!: ProfesorAsigancionCompleta;
  perfil: Profesor = {
    id: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    fechaNacimiento: '',
    sexo: '',
    especialidad: '',
    estatus: '',
    telefono: '',
    rfc: '',
    clavePresupuestal: '',
    grado: '',
    grupo: ''
  };
  perfil1: ProfesorAsigancionCompleta = {
    idGrado:'',
    nombreGrado: '',
    idGrupo:'',
    nombreGrupo: '',
    ciclo: ''
  }


    registroParaEditar: Profesor | null = null;
    usuariologueado: string = '';

    constructor(private profesorService: ServiciosProfesor, private loginser: LoginService, private loadingService: LoadingService) { }

  get nombreCompleto(): string {
      return `${this.perfil.nombre} ${this.perfil.apellidoPaterno}${this.perfil.apellidoMaterno}`.trim();
    }

  ngOnInit(): void {
  this.usuariologueado = this.loginser.Usuario();

  if (this.usuariologueado) {
    this.obtenerPerfil();
    this.obtenerAsignacionDocente();
  } else {
    console.error('No se encontró UUID del usuario logueado.');
  }
}

obtenerAsignacionDocente(): void {
  this.profesorService.obtenerAsignacionDocente(this.usuariologueado).subscribe({
    next: (asignacion: ProfesorAsigancionCompleta) => {
      this.usuario1 = asignacion;
      console.log('Asignación cargada:', this.usuario1);
    },
    error: (err) => {
      console.error("Error al obtener asignación del profesor:", err);
    }
  });
}
  obtenerPerfil(): void {
      this.loadingService.show();

      this.profesorService.obtenerPerfilUsuario(this.usuariologueado).subscribe({
        next: (data: Profesor) => {
          this.loadingService.hide();

          this.usuario = data;
        },
        error: (err) => {
          this.loadingService.hide();

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