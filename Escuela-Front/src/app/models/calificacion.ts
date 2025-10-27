export interface CalificacionRegistro {
  id?: number;
  matricula: string;
  nombreEstudiante: string;
  materia: string;
  grado: string;
  grupo: string;
  trimestre: string;
  ciclo: string;
  calificacion: number; 
}

export interface CalificacionResponse {
  content: CalificacionRegistro[]; 
  totalElements: number;
  totalPages: number;
  number: number; 
  size: number;
  
}