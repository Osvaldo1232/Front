import { TestBed } from '@angular/core/testing';

import { ServiciosDirectorInscripcion } from './servicios-director-inscripcion';

describe('ServiciosDirectorInscripcion', () => {
  let service: ServiciosDirectorInscripcion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosDirectorInscripcion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
