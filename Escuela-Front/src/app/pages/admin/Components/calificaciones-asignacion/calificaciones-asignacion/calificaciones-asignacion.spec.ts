import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionesAsignacion } from './calificaciones-asignacion';

describe('CalificacionesAsignacion', () => {
  let component: CalificacionesAsignacion;
  let fixture: ComponentFixture<CalificacionesAsignacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalificacionesAsignacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalificacionesAsignacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
