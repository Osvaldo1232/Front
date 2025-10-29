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
  nombreAlumno: string;
  nombreGrado: string;
  nombreGrupo: string;
  nombreProfesor: string;
}