import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaConfirmacion } from './alerta-confirmacion';

describe('AlertaConfirmacion', () => {
  let component: AlertaConfirmacion;
  let fixture: ComponentFixture<AlertaConfirmacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaConfirmacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaConfirmacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
