import { Component } from '@angular/core';
import { AlumnoService, InscripcionReciente, MateriasCalifica } from '../../Services/alumno-service';
import { LoginService } from '../../../../services/login-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calificaciones',
  imports: [CommonModule],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.scss',
  standalone:true
})
export class Calificaciones {
alumno?: MateriasCalifica[] = [];
inscripcion?: InscripcionReciente;
usuario:any;
ciclo:any;
cali:any;
alumse:any;
datos:InscripcionReciente[]=[];

 constructor(
    private alumnoService: AlumnoService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.usuario= this.loginService.Usuario(); // Obtenemos el UUID del alumno
    if(this.usuario){
      this.AlumnosServ(this.usuario);
    }
}

AlumnosServ(alumnoId:any){
  this.alumnoService.obtenerInscripcionReciente(alumnoId).subscribe({
  next: (alumnosrecientes) => {
    this.alumse =alumnosrecientes;
    if(this.alumse ){
      this.ObtenerMater(this.usuario, this.alumse.idCiclo)
    }
  },
  error: (err) => {
    console.error('❌ Error al obtener inscripciones:', err);
  }
});
}

ObtenerMater(almId: string, cicloid: string) {
  this.alumnoService.obtenerMaterias(almId, cicloid).subscribe({
    next: (inscripciones) => {
      this.alumno = inscripciones; // ✅ ahora sí es array
      console.log(this.alumno);
    },
    error: (err) => {
      console.error('❌ Error al obtener Calificaciones:', err);
    }
  });
}

}



