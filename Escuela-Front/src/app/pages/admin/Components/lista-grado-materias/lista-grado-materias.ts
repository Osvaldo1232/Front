import { Component, OnInit } from '@angular/core';
import { Listagradomateria } from '../../../../models/listagradomateria.model';
import { ServiciosDirectorListaGradosMateria } from '../../Services/Servicios-Director-Listas/servicios-director-lista-grados-materia';
import { LoadingService } from '../../../../shared/loading-service';
import { AlertService } from '../../../../shared/alert-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Loading } from '../../../../shared/loading/loading';

@Component({
  selector: 'app-lista-grado-materias',
  imports: [FormsModule, CommonModule, Loading],
  templateUrl: './lista-grado-materias.html',
  styleUrl: './lista-grado-materias.scss'
})
export class ListaGradoMaterias implements OnInit{
  grados: any[] = [];
  cicloEscolar: string = '';
  ListaGM: Listagradomateria[] = [];

  constructor(private servicioListaGradoGrupos:ServiciosDirectorListaGradosMateria, private loadingService: LoadingService, private AlertService: AlertService) {}

  ngOnInit(): void {
    this.cargarCombos();
  }
  cargarCombos(): void {
    this.servicioListaGradoGrupos.obtenerGrado().subscribe({
      next: (data) => this.grados = data,
      error: (err) => console.error('Error al cargar grados', err)
    });
  }
  buscar(): void {
    if (!this.cicloEscolar) {
      alert('Por favor, llena todos los campos antes de buscar');
      return;
    }
    this.loadingService.show();

    this.servicioListaGradoGrupos.ListarGrado(this.cicloEscolar).subscribe({
        next: (ListaGM) => {
        this.ListaGM = ListaGM || [];
        this.loadingService.hide();

        if(ListaGM.length === 0){
          this.AlertService.show(
            'Actualmente no se encontraron alumnos para los criterios seleccionados.',
            'danger',
            'Error'
          );
        }
      },
        error: (err) => {
          console.error('Error al obtener inscripciones', err);
          this.loadingService.hide();
          this.AlertService.show(
          'Ocurrió un error al buscar los alumnos',
          'danger',
          'Error'
        );
        }
      });
  }

  limpiar(): void {
    this.cicloEscolar = '';
    this.ListaGM = [];
  }


}
