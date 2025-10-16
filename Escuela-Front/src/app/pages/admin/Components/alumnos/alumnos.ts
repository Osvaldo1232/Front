import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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
  templateUrl: './alumnos.html',
  styleUrls: ['./alumnos.scss']
})
export class Alumnos {
  // Array de alumnos
  alumnos = [
    { id: '1', matricula: '262310001', nombre: 'Juan', apellidos: 'Pérez', telefono: '7221234567', tutor: 'Luis' },
    { id: '2', matricula: '262310002', nombre: 'María', apellidos: 'López', telefono: '7222345678', tutor: 'Ana' },
    { id: '3', matricula: '262310003', nombre: 'Carlos', apellidos: 'Sánchez', telefono: '7223456789', tutor: 'Luis' },
    { id: '4', matricula: '262310004', nombre: 'Ana', apellidos: 'García', telefono: '7224567890', tutor: 'Luis' },
    { id: '5', matricula: '262310005', nombre: 'Luis', apellidos: 'Velázquez', telefono: '7225678901', tutor: 'Ana' },
    { id: '6', matricula: '262310006', nombre: 'Patricia', apellidos: 'Núñez', telefono: '7226789012', tutor: 'Luis' },
    { id: '7', matricula: '262310007', nombre: 'Fernando', apellidos: 'Lara', telefono: '7227890123', tutor: 'Ana' },
    { id: '8', matricula: '262310008', nombre: 'Gabriela', apellidos: 'Mendoza', telefono: '7228901234', tutor: 'Luis' },
    { id: '9', matricula: '262310009', nombre: 'Raúl', apellidos: 'Vega', telefono: '7229012345', tutor: 'Ana' },
    { id: '10', matricula: '262310010', nombre: 'Lucía', apellidos: 'Torres', telefono: '7220123456', tutor: 'Luis' },
    { id: '11', matricula: '262310011', nombre: 'Miguel', apellidos: 'Hernández', telefono: '7221234560', tutor: 'Ana' },
    { id: '12', matricula: '262310012', nombre: 'Sofía', apellidos: 'Reyes', telefono: '7222345601', tutor: 'Luis' },
    { id: '13', matricula: '262310013', nombre: 'Jorge', apellidos: 'Ortiz', telefono: '7223456012', tutor: 'Ana' },
    { id: '14', matricula: '262310014', nombre: 'Diana', apellidos: 'Flores', telefono: '7224560123', tutor: 'Luis' },
    { id: '15', matricula: '262310015', nombre: 'José', apellidos: 'Martínez', telefono: '7225671234', tutor: 'Ana' },
    { id: '16', matricula: '262310016', nombre: 'Laura', apellidos: 'Cruz', telefono: '7226782345', tutor: 'Luis' },
    { id: '17', matricula: '262310017', nombre: 'Ricardo', apellidos: 'Santos', telefono: '7227893456', tutor: 'Ana' },
    { id: '18', matricula: '262310018', nombre: 'María José', apellidos: 'Hernández', telefono: '7228904567', tutor: 'Luis' },
    { id: '19', matricula: '262310019', nombre: 'Ana Sofía', apellidos: 'Ramírez', telefono: '7229015678', tutor: 'Ana' },
    { id: '20', matricula: '262310020', nombre: 'Carlos Alberto', apellidos: 'Gómez', telefono: '7220126789', tutor: 'Luis' },
  ];

  // Señal para la lista filtrada
  alumnosFiltrados = signal(this.alumnos);

  // Paginación
  registrosPorPagina = 15;
  paginaActual = 1;
  searchTerm = '';

  get totalPaginas() {
    return Math.ceil(this.alumnosFiltrados().length / this.registrosPorPagina);
  }

  get totalPaginasArray() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get alumnosPaginados() {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.alumnosFiltrados().slice(inicio, inicio + this.registrosPorPagina);
  }

  // Función que se ejecuta al escribir en el input
  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.alumnosFiltrados.set(
      this.alumnos.filter(a =>
        a.nombre.toLowerCase().includes(term) ||
        a.apellidos.toLowerCase().includes(term) ||
        a.matricula.toLowerCase().includes(term)
      )
    );
    this.paginaActual = 1; // Resetear página al filtrar
  }

  // Botón buscar
  buscar() {
    this.onSearchChange();
  }

  // Botón limpiar
  limpiar() {
    this.searchTerm = '';
    this.alumnosFiltrados.set(this.alumnos);
    this.paginaActual = 1;
  }

  // Cambiar página
  cambiarPagina(num: number) {
    if (num < 1) num = 1;
    if (num > this.totalPaginas) num = this.totalPaginas;
    this.paginaActual = num;
  }
}
