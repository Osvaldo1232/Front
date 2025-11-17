export interface MateriaCalificacion {
  nombreMateria: string;
  calificacion: number;
}

export interface AlumnoCalificaciones {
  idAlumno: string;
  nombreAlumno: string;
  materias: MateriaCalificacion[];
}