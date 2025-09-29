import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-alumnos',
  standalone: true,
   imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule
  ],

   templateUrl: './alumnos.html', // Usa el nombre correcto de archivo
  styleUrls: ['./alumnos.scss']  

 
})
export class Alumnos {
docentes = [
    { id: 1, nombre: 'Juan Pérez', especialidad: 'primero', email: 'juan.perez@escuela.com' },
    { id: 2, nombre: 'María López', especialidad: 'segundo', email: 'maria.lopez@escuela.com' },
    { id: 3, nombre: 'Carlos Sánchez', especialidad: 'tercerno', email: 'carlos.sanchez@escuela.com' }
  ];
}
