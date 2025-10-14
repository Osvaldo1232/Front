export interface Materia {
  id: string;              
  nombre: string;          
  campoFormativoId: string;   
  estatus: string;      
}
export interface MateriaResponse {
  content: Materia[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
