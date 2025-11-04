export interface Materia {
  id: string;
  nombre: string;
  campoFormativo: string;
}

export interface InscripcionDTO {
  idInscripcion: string;
  idAlumno: string;
  matricula: string;
  curp: string;
  nombre: string;
  gradoNombre: string;
  grupoNombre: string;
  nombreProfesor: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}