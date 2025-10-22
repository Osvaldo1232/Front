import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoGrado } from './nuevo-grado';

describe('NuevoGrado', () => {
  let component: NuevoGrado;
  let fixture: ComponentFixture<NuevoGrado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoGrado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoGrado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
