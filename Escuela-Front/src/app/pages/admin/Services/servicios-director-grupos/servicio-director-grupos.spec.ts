import { TestBed } from '@angular/core/testing';

import { ServicioDirectorGrupos } from './servicio-director-grupos';

describe('ServicioDirectorGrupos', () => {
  let service: ServicioDirectorGrupos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioDirectorGrupos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
