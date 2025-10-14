import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MateriaState } from '../reducers/materia.reducer';

export const selectMateriaState = createFeatureSelector<MateriaState>('materias');

export const selectAllMaterias = createSelector(
  selectMateriaState,
  (state: MateriaState) => state.materias
);
