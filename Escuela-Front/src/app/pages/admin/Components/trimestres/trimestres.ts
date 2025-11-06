import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ServiciosDirectorTrimestre } from '../../Services/servicios-director-trimestre/servicios-director-trimestre'; // Ajusta la ruta según tu proyecto
import { Trimestres as TrimestreModel } from '../../../../models/trimestres.model'; // Ajusta la ruta según tu modelo
import { Loading } from '../../../../shared/loading/loading';
import { LoadingService } from '../../../../shared/loading-service';


@Component({
  selector: 'app-trimestres',
  templateUrl: './trimestres.html',
  styleUrls: ['./trimestres.scss'],
  imports: [CommonModule, Loading]
})
export class TrimestresComponent implements OnInit {
  trimestres: TrimestreModel[] = [];
   errorMessage = '';

  constructor(private servicioTrimestre: ServiciosDirectorTrimestre, private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.cargarTrimestres();
  }

  // Obtener los trimestres desde el servicio
  cargarTrimestres(): void {
    this.loadingService.show();
    this.servicioTrimestre.ObtenerTrimestre().subscribe({
      next: (data) => {
        this.trimestres = data;
      this.loadingService.hide(); 
    },
    error: () => {
              this.errorMessage = 'No se pudo cargar la inscripción reciente.';
              this.loadingService.hide(); 
            }
    });
  }





}

