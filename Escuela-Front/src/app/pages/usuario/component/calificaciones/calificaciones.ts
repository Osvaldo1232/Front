import { Component } from '@angular/core';
import { AlumnoService } from '../../Services/alumno-service';
import { LoginService } from '../../../../services/login-service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../../shared/loading-service';
import { Loading } from '../../../../shared/loading/loading';
import {InscripcionReciente,MateriasCalifica } from '../../../../models/alumnos.model';

@Component({
  selector: 'app-calificaciones',
  imports: [CommonModule,Loading],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.scss',
  standalone:true
})
export class Calificaciones {
materias?: MateriasCalifica[] = [];
inscripcion?: InscripcionReciente;
usuario:any;
ciclo:any;
cali:any;
alumse:any;
datos:InscripcionReciente[]=[];

 constructor(
    private alumnoService: AlumnoService,
    private loginService: LoginService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.usuario= this.loginService.Usuario(); // Obtenemos el UUID del alumno
    if(this.usuario){
      this.AlumnosServ(this.usuario);
    }
}

AlumnosServ(alumnoId:any){
  this.loadingService.show();
  this.alumnoService.obtenerInscripcionReciente(alumnoId).subscribe({
  next: (alumnosrecientes) => {
    this.alumse =alumnosrecientes;
    if(this.alumse ){
        console.log("oihi")

      this.ObtenerMater(this.usuario, this.alumse.idCiclo)
   } else {
        this.loadingService.hide(); // ✅ si no hay datos, ocultamos
      }
  },
  error: (err) => {
    console.error('❌ Error al obtener inscripciones:', err);
    this.loadingService.hide();
  }
});
}

ObtenerMater(almId: string, cicloid: string) {
  this.loadingService.show();
  this.alumnoService.obtenerMaterias(almId, cicloid).subscribe({
    next: (inscripciones) => {
      this.materias = inscripciones; // ✅ ahora sí es array

      console.log(this.materias);
      if(this.materias.length===0){
        console.log("oihi")
      }
      this.loadingService.hide();
    },
    error: (err) => {
      console.error('❌ Error al obtener Calificaciones:', err);
      this.loadingService.hide();
    }
  });
}

}



