import { TestBed } from '@angular/core/testing';
import { ServiciosProfesor } from './servicios-profesor.js';

describe('ServiciosProfesor', () => {
  let service: ServiciosProfesor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosProfesor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
