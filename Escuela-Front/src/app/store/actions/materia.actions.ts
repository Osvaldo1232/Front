import { createAction, props } from '@ngrx/store';
import { Materia } from '../../models/materia.model';

export const cargarMaterias = createAction('[Materia] Cargar Materias');

export const cargarMateriasSuccess = createAction(
  '[Materia] Cargar Materias Success',
  props<{ materias: Materia[] }>()
);

export const cargarMateriasFailure = createAction(
  '[Materia] Cargar Materias Failure',
  props<{ error: string }>()
);
