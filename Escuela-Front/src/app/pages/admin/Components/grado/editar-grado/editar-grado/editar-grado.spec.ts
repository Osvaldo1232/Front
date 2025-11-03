import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarGrado } from './editar-grado';

describe('EditarGrado', () => {
  let component: EditarGrado;
  let fixture: ComponentFixture<EditarGrado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarGrado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarGrado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
