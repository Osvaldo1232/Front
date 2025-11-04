export interface Directivo  {
  id?: string; 
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  fechaNacimiento: string; 
  sexo: string;
  departamento: string;
  estatus: string; 
  telefono: string; 
  rol: string; 
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
