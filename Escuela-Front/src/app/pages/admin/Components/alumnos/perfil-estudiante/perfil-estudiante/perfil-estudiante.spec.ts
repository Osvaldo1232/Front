import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilEstudiante } from './perfil-estudiante';

describe('PerfilEstudiante', () => {
  let component: PerfilEstudiante;
  let fixture: ComponentFixture<PerfilEstudiante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilEstudiante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilEstudiante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
