import { TestBed } from '@angular/core/testing';

import { ServiciosDirectorCalificaciones } from './servicios-director-calificaciones';

describe('ServiciosDirectorCalificaciones', () => {
  let service: ServiciosDirectorCalificaciones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosDirectorCalificaciones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
