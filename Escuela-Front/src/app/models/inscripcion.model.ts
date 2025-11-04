export interface Inscripcion {
    id?: string;
    alumnoId: string;
    docenteId: string;
    gradoId: string;
    grupoId: string;
    cicloId: string;
    estatus: string;
    fechaInscripcion?: string;
}