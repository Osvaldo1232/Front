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
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AlertService } from '../../../../shared/alert-service';


@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalEdicionPersonales, Loading],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.scss'
})
export class DatosPersonales implements OnInit {
  usuario: Profesor = {
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
  
  usuario1: ProfesorAsigancionCompleta = {
    idGrado: '',
    nombreGrado: '',
    idGrupo: '',
    nombreGrupo: '',
    ciclo: ''
  };

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
    idGrado: '',
    nombreGrado: '',
    idGrupo: '',
    nombreGrupo: '',
    ciclo: ''
  };

  registroParaEditar: Profesor | null = null;
  usuariologueado: string = '';

  constructor(
    private profesorService: ServiciosProfesor, 
    private loginser: LoginService, 
    private loadingService: LoadingService,
    private alertService: AlertService
  ) { }

  get nombreCompleto(): string {
    return `${this.perfil.nombre} ${this.perfil.apellidoPaterno}${this.perfil.apellidoMaterno}`.trim();
  }

  ngOnInit(): void {
    this.usuariologueado = this.loginser.Usuario();

    if (this.usuariologueado) {
      this.cargarDatos();
    } else {
      this.alertService.show('No se encontró usuario logueado', 'danger', 'Error');
    }
  }

  cargarDatos(): void {
    this.loadingService.show();

    forkJoin({
      perfil: this.profesorService.obtenerPerfilUsuario(this.usuariologueado).pipe(
        catchError(error => {
          console.error('Error al obtener perfil:', error);
          return of(this.perfil);
        })
      ),
      asignacion: this.profesorService.obtenerAsignacionDocente(this.usuariologueado).pipe(
        catchError(error => {
          console.error('Error al obtener asignación:', error);
          return of(this.perfil1);
        })
      )
    }).pipe(
      finalize(() => this.loadingService.hide())
    ).subscribe({
      next: (resultado) => {
        this.usuario = resultado.perfil;
        this.usuario1 = resultado.asignacion;
      },
      error: (err) => {
        console.error('Error general:', err);
        this.alertService.show('Ocurrió un error al cargar los datos', 'danger', 'Error');
      }
    });
  }

  editar(registro: any) {
    this.registroParaEditar = { ...registro };
  }

  cerrarModal(usuarioEditado: Profesor | null): void {
    this.registroParaEditar = null;

    if (usuarioEditado) {
      this.alertService.show('Datos actualizados correctamente', 'success', 'Éxito');
      this.cargarDatos();
    }
  }
}