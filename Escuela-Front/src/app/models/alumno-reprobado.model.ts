export interface MateriaReprobada {
  nombreMateria: string;
  promedio: number;
}

export interface AlumnoReprobado {
  idAlumno: string;
  nombreCompleto: string;
  grado: string;
  grupo: string;
  ciclo: string;
  materias: MateriaReprobada[];
}