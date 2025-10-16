export interface Alumnos {
  id?: string;              
  matricula: string;          
  nombre: string;   
  apellidos: string; 
  telefono: string;
  tutor: string;     
}
export interface MateriaResponse {
  content: Alumnos[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
