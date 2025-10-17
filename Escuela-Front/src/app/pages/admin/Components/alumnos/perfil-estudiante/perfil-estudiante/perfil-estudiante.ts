import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-estudiante',
  imports: [],
  templateUrl: './perfil-estudiante.html',
  styleUrl: './perfil-estudiante.scss'
})
export class PerfilEstudiante {
 @Input() alumno: {
    id: string;
    matricula: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    tutor: string;
  } = {
    id: '',
    matricula: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    tutor: ''
  };
}
