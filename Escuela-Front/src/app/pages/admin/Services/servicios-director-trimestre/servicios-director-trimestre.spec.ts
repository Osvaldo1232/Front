import { TestBed } from '@angular/core/testing';

import { ServiciosDirectorTrimestre } from './servicios-director-trimestre';

describe('ServiciosDirectorTrimestre', () => {
  let service: ServiciosDirectorTrimestre;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosDirectorTrimestre);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
