export interface CalificacionRegistro {
  id?: number;
  matricula: string;
  nombreEstudiante: string;
  materia: string;
  grado: string;
  grupo: string;
  trimestre: string;
  ciclo: string;
  calificacion: number; // El campo que se edita
}

export interface CalificacionResponse {
  content: CalificacionRegistro[]; // La lista de registros
  totalElements: number;
  totalPages: number;
  number: number; // Página actual (page)
  size: number;
  // ... otros campos de paginación que use tu API
}