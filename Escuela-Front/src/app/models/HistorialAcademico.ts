export interface RegistroHistorial {
  id: string;
  alumno: string;
  cicloEscolar: string;
  grado: string;
  grupo: string;
  calificacion: number;
}

export interface FiltrosHistorial {
  cicloEscolar: string;
  alumno: string;
}
