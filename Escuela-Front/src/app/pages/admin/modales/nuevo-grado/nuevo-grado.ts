import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiciosDirector } from '../../Services/servicios-director';
import {  Grados } from '../../../../models/grado.models';

@Component({
  selector: 'app-nuevo-grado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-grado.html',
  styleUrls: ['./nuevo-grado.scss']
})
export class NuevoGrado {
  @Input() nuevo: any;
  
@Output() cerrar = new EventEmitter<Grados | null>();

  
  constructor(private Servicios: ServiciosDirector) { }

  nombre: string = '';
  estatus: string = 'ACTIVO';

 guardar() {
    const grado: Grados = { nombre: this.nombre, estatus: this.estatus };

    this.Servicios.crearGrado(grado).subscribe({
      next: (res) => {
        const nuevoGrado = { 
        id: res.id,
        nombre: this.nombre,
        estatus: this.estatus
      };
      this.cerrar.emit(nuevoGrado); 
      },
      error: (err) => console.error('Error al crear grado:', err)
    });
  }

  cerrarModal() {
    this.cerrar.emit(null);
  }
}
