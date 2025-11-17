import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosRiesgo } from './alumnos-riesgo';

describe('AlumnosRiesgo', () => {
  let component: AlumnosRiesgo;
  let fixture: ComponentFixture<AlumnosRiesgo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnosRiesgo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnosRiesgo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
