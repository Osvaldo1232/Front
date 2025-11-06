export interface AsignacionDocente {
  id: string;
  idProfesor: string;
  grado: string;
  grupo: string;
  ciclo: string;
}

export interface MateriaAsignada {
  id: string;
  nombre: string;
  campoFormativo: string;
  grado: string;
  grupo: string;
}

export interface MateriaResponse {
  content: MateriaAsignada[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}


export interface MateriasCamposFormativos {
    idGrado:any;
    nombreGrado: any,
    idMateria: any,
    nombreMateria: any;
    idCampoFormativo: any;
    nombreCampoFormativo: any
}

