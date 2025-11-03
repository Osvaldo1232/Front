import { TestBed } from '@angular/core/testing';

import { ServiciosDirectorTutores } from './servicios-director-tutores';

describe('ServiciosDirectorTutores', () => {
  let service: ServiciosDirectorTutores;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosDirectorTutores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
