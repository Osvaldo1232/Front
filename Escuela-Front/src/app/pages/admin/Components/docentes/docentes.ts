import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

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
  templateUrl: './docentes.html', // Usa el nombre correcto de archivo
  styleUrls: ['./docentes.scss']  // 👈 Esta es la forma correcta
})
export class DocentesComponent {
docentes = [
    { id: 1, nombre: 'Juan Pérez', especialidad: 'Matemáticas', email: 'juan.perez@escuela.com' },
    { id: 2, nombre: 'María López', especialidad: 'Historia', email: 'maria.lopez@escuela.com' },
    { id: 3, nombre: 'Carlos Sánchez', especialidad: 'Física', email: 'carlos.sanchez@escuela.com' }
  ];
}
