import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarAsignacion } from './actualizar-asignacion';

describe('ActualizarAsignacion', () => {
  let component: ActualizarAsignacion;
  let fixture: ComponentFixture<ActualizarAsignacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarAsignacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarAsignacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
