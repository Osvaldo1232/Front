import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoAsignacion } from './grafico-asignacion';

describe('GraficoAsignacion', () => {
  let component: GraficoAsignacion;
  let fixture: ComponentFixture<GraficoAsignacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoAsignacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoAsignacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
