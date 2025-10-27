import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { Materia } from '../../../../models/Materia';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './materias.html',
  styleUrl: './materias.scss'
})
export class Materias implements OnInit{
  materias: Materia[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.cargarMaterias();
  }

  cargarMaterias(): void {
    this.materias = [
      {
        id: '1',
        nombre: 'ESPAÑOL',
        campoFormativo: 'LENGUAS'
      },
      {
        id: '2',
        nombre: 'MATEMATICAS',
        campoFormativo: 'LENGUAS'
      },
      {
        id: '3',
        nombre: 'HISTORIA',
        campoFormativo: 'LENGUAS'
      },
      {
        id: '4',
        nombre: 'ESPAÑOL',
        campoFormativo: 'LENGUAS'
      },
      {
        id: '5',
        nombre: 'ESPAÑOL',
        campoFormativo: 'LENGUAS'
      },
      {
        id: '6',
        nombre: 'ESPAÑOL',
        campoFormativo: 'LENGUAS'
      }
    ];
  }

  abrirCalificaciones(materia: Materia): void {
    console.log('Abrir calificaciones para:', materia);
  }
}
