import { TestBed } from '@angular/core/testing';

import { ServiciosDirectorAlumnos } from './servicios-director-alumnos';

describe('ServiciosDirectorAlumnos', () => {
  let service: ServiciosDirectorAlumnos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosDirectorAlumnos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
