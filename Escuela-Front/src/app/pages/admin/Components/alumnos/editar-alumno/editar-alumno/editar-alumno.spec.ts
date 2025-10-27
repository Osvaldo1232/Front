import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAlumno } from './editar-alumno';

describe('EditarAlumno', () => {
  let component: EditarAlumno;
  let fixture: ComponentFixture<EditarAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAlumno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAlumno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
