export interface Alumnos {
  id?: string;  
  nombre: string;   
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  password: string;
  fechaNacimiento: string;
  sexo: string;            
  matricula: string;
  curp: string;          
  estatus: string;   
}
export interface InscripcionReciente {
  id: string;
  idGrado: string;
  nombreGrado: string;
  idGrupo: string;
  nombreGrupo: string;
  idCiclo: string;
  ciclo: string;
  nombreProfesorCompleto: string;
  telefonoProfesor: string;
}
export interface MateriasCalifica {
  idMateria: string;
  nombreMateria: string;
  calificacionActual: number | null;
  idGrado: string;
  nombreGrado: string;
  nombreCampoFormativo: string;
}

export interface AlumnoGGC {
  alumnoId: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  matricula: string;
  curp: string;
  gradoId: string;
  gradoNombre: string;
  grupoId: string;
  grupoNombre: string;
  estatus: string;
} 

export interface Calificacionesgra {
  idGrado: string;
  nombreGrado: string;
  idCiclo: string;
  cicloEscolar: string;
  promedioGeneral: any;
}
export interface CalifTri{
  nombreAlumno: string;
  nombreMateria: string;
  calificacionesPorTrimestre: {
    [trimestre: string]: number; // ejemplo: {"trimestre1": 8, "trimestre2": 9, "trimestre3": 10}
  };}

  export interface CalificacionesAlumno {
  idAlumno: string;
  calificacionesPorGrado: CalificacionPorGrado[];
}

export interface CalificacionPorGrado {
  grado: string;
  materias: MateriaCalificacion[];
  promedioFinalGrado: number;
}

export interface MateriaCalificacion {
  idGrado: string;
  nombreGrado: string;
  idMateria: string;
  nombreMateria: string;
  idCampoFormativo: string;
  nombreCampoFormativo: string;
  promedio: number;
}
export interface DetalleMateria {
  nombreAlumno: string;
  nombreGrado: string;
  nombreMateria: string;
  trimestre1: number | null;
  trimestre2: number | null;
  trimestre3: number | null;
  promedioFinal: number | null;
}

