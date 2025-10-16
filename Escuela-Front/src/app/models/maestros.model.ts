export interface Materia {
  id?: string;              
  nombre: string;          
  apellidos: string;  
  email: string;
  fechaNacimiento: string;
  rol: string;
  sexo: string;
  especialidad: string;
  rfc: string;
  telefono: string;
  clavepresupuestal: string; 
  estatus: string;      
}
export interface MateriaResponse {
  content: Materia[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
