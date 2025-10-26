import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoAlumnoModal } from './nuevo-alumno-modal';

describe('NuevoAlumnoModal', () => {
  let component: NuevoAlumnoModal;
  let fixture: ComponentFixture<NuevoAlumnoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoAlumnoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoAlumnoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
