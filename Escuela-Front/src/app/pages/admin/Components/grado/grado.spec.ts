import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grado } from './grado';

describe('Grado', () => {
  let component: Grado;
  let fixture: ComponentFixture<Grado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Grado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
