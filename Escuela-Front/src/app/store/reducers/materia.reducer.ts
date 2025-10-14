import { createReducer, on } from '@ngrx/store';
import * as MateriaActions from '../actions/materia.actions';
import { Materia } from '../../models/materia.model';

export interface MateriaState {
  materias: Materia[];
  error: string | null;
}

export const initialState: MateriaState = {
  materias: [],
  error: null
};

export const materiaReducer = createReducer(
  initialState,
  on(MateriaActions.cargarMateriasSuccess, (state, { materias }) => ({
    ...state,
    materias,
    error: null
  })),
  on(MateriaActions.cargarMateriasFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
