export interface CampoFormativo {
  nombreCampoFormativo: string;
  promedioTrimestre1: number;
  promedioTrimestre2: number;
  promedioTrimestre3: number;
  promedioFinal: number;
}

export interface HistorialAlumno {
  idAlumno: string;
  nombreCompleto: string;
  grado: string;
  grupo: string;
  camposFormativos: CampoFormativo[];
  promedioGeneral: number;
}

export interface RegistroHistorial {
  nombreAlumno: string;
  grado: string;
  grupo: string;
  calificacionTotal: number;
}

// Interfaz para los alumnos del combo
export interface AlumnoCombo {
  id: string;
  idAlumno?: string;
  nombre?: string;
  nombreCompleto?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
}