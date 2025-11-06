import { TestBed } from '@angular/core/testing';

import { ServiciosDirectorMaterias } from './servicios-director-materias';

describe('ServiciosDirectorMaterias', () => {
  let service: ServiciosDirectorMaterias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosDirectorMaterias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
