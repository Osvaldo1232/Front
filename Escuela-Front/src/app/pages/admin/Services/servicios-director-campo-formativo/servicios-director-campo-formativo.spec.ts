import { TestBed } from '@angular/core/testing';

import { ServiciosCampoFormativo } from './servicios-director-campo-formativo';

describe('ServiciosDirectorCampoFormativo', () => {
  let service: ServiciosCampoFormativo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosCampoFormativo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
