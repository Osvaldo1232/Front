export interface CalificacionAlumno {
  id: string;
  campoFormativo: string;
  grado: string;
  grupo: string;
  trimestre1: number;
  trimestre2: number;
  trimestre3: number;
  calificacionFinal: number;
}

export interface FiltrosAlumno {
  cicloEscolar: string;
  alumno: string;
}
