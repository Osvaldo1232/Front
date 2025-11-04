import { TestBed } from '@angular/core/testing';

import { ServiciosDirectorCiclos } from './servicios-director-ciclos';

describe('ServiciosDirectorCiclos', () => {
  let service: ServiciosDirectorCiclos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosDirectorCiclos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
