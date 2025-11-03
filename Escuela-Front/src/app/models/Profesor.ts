export interface Profesor  {
  id?: string; 
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  fechaNacimiento: string; 
  sexo: string;
  especialidad: string;
  estatus: string; 
  telefono: string; 
  rfc: string; 
  clavePresupuestal: string; 
  grado: string; 
  grupo: string;
}
export interface ProfesorUno {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  password: string;
  fechaNacimiento: string;
  sexo: string;
  especialidad: string;
  estatus: string;
  telefono: string;
  rfc: string;
  clavePresupuestal: string;
  rol: string;
}
