export interface RegistroHistorial {
  id: string;
  nombreAlumno: string;
  cicloEscolar: string;
  grado: string;
  grupo: string;
  calificacionTotal: number;
}

export interface FiltrosHistorial {
  cicloEscolar: string;
  alumno: string;
}
