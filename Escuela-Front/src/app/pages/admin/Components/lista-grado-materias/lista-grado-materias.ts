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
export class ListaGradoMaterias implements OnInit {
  grados: any[] = [];
  cicloEscolar: string = '';
  ListaGM: Listagradomateria[] = [];

  constructor(
    private servicioListaGradoGrupos: ServiciosDirectorListaGradosMateria,
    private loadingService: LoadingService,
    private AlertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadingService.show();
    this.cargarCombos();
  }

  cargarCombos(): void {
    this.servicioListaGradoGrupos.obtenerGrado().subscribe({
      next: (data) => {
        this.grados = data;

        if (this.grados.length > 0) {
          // ✅ Buscar el primer grado con materias asignadas
          this.precargarGradoConMaterias();
        } else {
          this.loadingService.hide();
        }
      },
      error: (err) => {
        console.error('Error al cargar grados', err);
        this.loadingService.hide();
      }
    });
  }

  /**
   * Busca automáticamente el primer grado que tenga materias asignadas.
   */
  private precargarGradoConMaterias(): void {
    let encontrado = false;

    // Recorremos los grados uno a uno hasta encontrar el que tenga materias
    for (const grado of this.grados) {
      this.servicioListaGradoGrupos.ListarGrado(grado.id).subscribe({
        next: (materias) => {
          if (!encontrado && materias && materias.length > 0) {
            encontrado = true;
            this.cicloEscolar = grado.id;
            this.ListaGM = materias;
            this.loadingService.hide();
          }
        },
        error: (err) => console.error('Error al buscar materias del grado', err)
      });
    }

    // Si ninguno tiene materias después de unos segundos, ocultamos el loader
    /* setTimeout(() => {
      if (!encontrado) {
        this.loadingService.hide();
        this.AlertService.show(
          'No se encontraron grados con materias asignadas.',
          'warning',
          'Aviso'
        );
      }
    }, 2000); */
  }

  buscar(): void {
    if (!this.cicloEscolar) {
      alert('Por favor, selecciona un grado antes de buscar');
      return;
    }

    this.loadingService.show();

    this.servicioListaGradoGrupos.ListarGrado(this.cicloEscolar).subscribe({
      next: (ListaGM) => {
        this.ListaGM = ListaGM || [];
        this.loadingService.hide();

        if (ListaGM.length === 0) {
          this.AlertService.show(
            'Actualmente no se encontraron materias para el grado seleccionado.',
            'danger',
            'Sin resultados'
          );
        }
      },
      error: (err) => {
        console.error('Error al obtener materias', err);
        this.loadingService.hide();
        this.AlertService.show(
          'Ocurrió un error al buscar las materias',
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
