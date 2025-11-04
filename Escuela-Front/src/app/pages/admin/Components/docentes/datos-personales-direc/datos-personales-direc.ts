import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Directivo } from '../../../../../models/DirectivoPersonal';
import { ServiciosDirectorAlumnos } from '../../../Services/servicios-director-alumnos/servicios-director-alumnos';
import { LoginService } from '../../../../../services/login-service';
import { LoadingService } from '../../../../../shared/loading-service';
import { Loading } from "../../../../../shared/loading/loading";

@Component({
  selector: 'app-datos-personales-direc',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Loading],
  templateUrl: './datos-personales-direc.html',
  styleUrl: './datos-personales-direc.scss'
})
export class DatosPersonalesDirec implements OnInit {
  usuario!: Directivo;
  perfil: Directivo = {
    id: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    fechaNacimiento: '',
    sexo: '',
    departamento: '',
    estatus: '',
    telefono: '',
    rol: '',
  };

  registroParaEditar: Directivo | null = null;
  usuariologueado: string = '';

  constructor(private directivoService: ServiciosDirectorAlumnos, private loginser: LoginService, private loadingService: LoadingService) { }

  get nombreCompleto(): string {
    return `${this.perfil.nombre} ${this.perfil.apellidoPaterno}${this.perfil.apellidoMaterno}`.trim();
  }

  ngOnInit(): void {
    this.usuariologueado = this.loginser.Usuario();
    if (this.usuariologueado) {
      this.obtenerPerfil();
    } else {
      console.error('No se encontró UUID del usuario logueado.');
    }
  }
  obtenerPerfil(): void {
    this.loadingService.show();

    this.directivoService.obtenerPerfilUsuario(this.usuariologueado).subscribe({
      next: (data: Directivo) => {
        this.loadingService.hide();

        this.usuario = data;
      },
      error: (err) => {
        this.loadingService.hide();

      }
    });
  }
  
  cerrarModal(usuarioEditado: Directivo | null): void {
    this.registroParaEditar = null;

    if (usuarioEditado) {
      this.usuario = usuarioEditado;
    }
  }

}
