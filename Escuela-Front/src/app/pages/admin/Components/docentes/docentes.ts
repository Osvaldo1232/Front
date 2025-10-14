import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { Materia } from '../../../../models/materia.model';
import { cargarMaterias } from '../../../../store/actions/materia.actions';
import { selectAllMaterias } from '../../../../store/selectors/materia.selectors';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule
  ],
  templateUrl: './docentes.html',
  styleUrls: ['./docentes.scss']
})
export class DocentesComponent implements OnInit {
  private store = inject(Store);
  materias = signal<Materia[]>([]);

  docentes = [
    { id: 1, nombre: 'Juan Pérez', especialidad: 'Matemáticas', email: 'juan.perez@escuela.com' },
    { id: 2, nombre: 'María López', especialidad: 'Historia', email: 'maria.lopez@escuela.com' },
    { id: 3, nombre: 'Carlos Sánchez', especialidad: 'Física', email: 'carlos.sanchez@escuela.com' }
  ];

 

  ngOnInit() {
    // Despachamos la acción para cargar materias una sola vez
    this.store.dispatch(cargarMaterias());

    // Nos suscribimos a los cambios en el store y actualizamos la señal
    this.store.select(selectAllMaterias).subscribe(this.materias.set);
  }
}
