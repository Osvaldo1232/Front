export interface Alumnos {
  id?: string;  
  nombre: string;   
  apellidos: string; 
  email: string;
  password: string;
  fechaNacimiento: string;
  sexo: string;            
  matricula: string;
  curp: string;          
  estatus: string;   
}
export interface InscripcionReciente {
  id: string;
  idGrado: string;
  nombreGrado: string;
  idGrupo: string;
  nombreGrupo: string;
  idCiclo: string;
  ciclo: string;
  nombreProfesorCompleto: string;
  telefonoProfesor: string;
}
