import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionGrado } from './asignacion-grado';

describe('AsignacionGrado', () => {
  let component: AsignacionGrado;
  let fixture: ComponentFixture<AsignacionGrado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionGrado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignacionGrado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
