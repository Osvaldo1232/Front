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
  calificacionActual: any;
  idGrado: string;
  nombreGrado: string;
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
  };
}

