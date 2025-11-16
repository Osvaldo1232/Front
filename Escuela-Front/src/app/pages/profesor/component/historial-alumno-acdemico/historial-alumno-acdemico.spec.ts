import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAlumnoAcdemico } from './historial-alumno-acdemico';

describe('HistorialAlumnoAcdemico', () => {
  let component: HistorialAlumnoAcdemico;
  let fixture: ComponentFixture<HistorialAlumnoAcdemico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialAlumnoAcdemico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAlumnoAcdemico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
