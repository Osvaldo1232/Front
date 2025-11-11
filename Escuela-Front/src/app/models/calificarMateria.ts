export interface Trimestre {
  id: string;
  nombre: string;
  estatus: string;
}

export interface CalificacionRegistro {
  id?: string;
  idAlumno: string;
  nombreAlumno: string;
  idMateria: string;
  nombreMateria: string;
  idTrimestre: string;
  idCicloEscolar: string;
  idGrado: string;
  promedio: number;
}

export interface CalificacionPorTrimestre {
  idAlumno: string;
  nombreAlumno: string;
  trimestre1: CalificacionRegistro | null;
  trimestre2: CalificacionRegistro | null;
  trimestre3: CalificacionRegistro | null;
}

export interface AlumnoCalificacion {
  idAlumno: string;
  nombreAlumno: string;
  calificacionT1: number | null;
  calificacionT2: number | null;
  calificacionT3: number | null;
  promedioFinal: number | null;
}