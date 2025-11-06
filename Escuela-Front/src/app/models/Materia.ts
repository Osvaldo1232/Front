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

export interface AsignacionGradoGrupo {
  idProfesor: string;
  nombreProfesor: string;
  rfc: string;
  clave: string;
  nombreGrado: string;
  nombreGrupo: string;
  nombreCiclo: string;
  fechaCreado: string;
}