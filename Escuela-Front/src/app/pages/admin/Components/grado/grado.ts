import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { NuevoGrado } from '../../modales/nuevo-grado/nuevo-grado';
import { ServiciosDirector } from '../../Services/servicios-director';
import { Grados } from '../../../../models/grado.models';
@Component({
  selector: 'app-grado',
 standalone: true,
  imports: [
   
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule,
    CheckboxModule,
    MultiSelectModule,
    NuevoGrado
  ],
  templateUrl: './grado.html',
  styleUrls: ['./grado.scss'] 
})
export class Grado  implements OnInit{


  nuevom: boolean = false;
 registros: Grados[] = [];
  constructor(private Servicios: ServiciosDirector) { }

   ngOnInit() {
    this.cargarGrados();
  }

  editar(registro:any){
    
  }


nuevo(){
this.nuevom=true;
}

cerrarmodal(event: Grados | null) {
  this.nuevom = false;

  if(event?.id) {
   
   this.cargarGrados();
   
  }
}

cargarGrados() {
    this.Servicios.obtenerGrados().subscribe({
      next: (res) => {
        this.registros = res;
      
      },
      error: (err) => console.error('Error al cargar grados:', err)
    });
  }

 }
