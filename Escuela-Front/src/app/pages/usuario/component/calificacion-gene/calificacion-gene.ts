import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-calificacion-gene',
  imports: [CommonModule ],
  templateUrl: './calificacion-gene.html',
  styleUrl: './calificacion-gene.scss'
})
export class CalificacionGene {
grades = [
    { label: 'PRIMER GRADO', score: 10 },
    { label: 'SEGUNDO GRADO', score: 9.8 },
    { label: 'TERCER GRADO', score: 8 },
    { label: 'CUARTO GRADO', score: 7 }
  
  ];

}
