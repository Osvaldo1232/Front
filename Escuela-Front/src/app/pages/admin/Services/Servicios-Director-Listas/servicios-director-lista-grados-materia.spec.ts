import { TestBed } from '@angular/core/testing';

import { ServiciosDirectorListaGradosMateria } from './servicios-director-lista-grados-materia';

describe('ServiciosDirectorListaGradosMateria', () => {
  let service: ServiciosDirectorListaGradosMateria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosDirectorListaGradosMateria);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
