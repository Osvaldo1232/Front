import { TestBed } from '@angular/core/testing';

import { ServiciosDirectorCampoFormativo } from './servicios-director-campo-formativo';

describe('ServiciosDirectorCampoFormativo', () => {
  let service: ServiciosDirectorCampoFormativo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosDirectorCampoFormativo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
