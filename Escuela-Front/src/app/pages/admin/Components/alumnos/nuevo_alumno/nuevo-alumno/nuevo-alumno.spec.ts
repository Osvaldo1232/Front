import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoAlumno } from './nuevo-alumno';

describe('NuevoAlumno', () => {
  let component: NuevoAlumno;
  let fixture: ComponentFixture<NuevoAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoAlumno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoAlumno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
