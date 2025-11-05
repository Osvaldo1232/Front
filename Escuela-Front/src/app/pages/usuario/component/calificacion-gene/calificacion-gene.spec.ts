import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionGene } from './calificacion-gene';

describe('CalificacionGene', () => {
  let component: CalificacionGene;
  let fixture: ComponentFixture<CalificacionGene>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalificacionGene]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalificacionGene);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
