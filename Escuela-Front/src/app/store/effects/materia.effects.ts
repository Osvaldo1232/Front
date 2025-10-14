import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MateriaActions from '../actions/materia.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ServiciosDirector } from '../../pages/admin/Services/servicios-director';

@Injectable()
export class MateriaEffects {
  constructor(
    private actions$: Actions,
    private materiaService: ServiciosDirector
  ) {}

  cargarMaterias$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MateriaActions.cargarMaterias),
      mergeMap(() => 
        this.materiaService.getMaterias().pipe(
          map(response => MateriaActions.cargarMateriasSuccess({ materias: response.content })),
          catchError(error => of(MateriaActions.cargarMateriasFailure({ error: error.message })))
        )
      )
    )
  );
}
