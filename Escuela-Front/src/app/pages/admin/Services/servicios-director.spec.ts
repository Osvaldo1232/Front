import { TestBed } from '@angular/core/testing';

import { ServiciosDirector } from './servicios-director';

describe('ServiciosDirector', () => {
  let service: ServiciosDirector;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosDirector);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
