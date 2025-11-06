import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMateria } from './editar-materia';

describe('EditarMateria', () => {
  let component: EditarMateria;
  let fixture: ComponentFixture<EditarMateria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarMateria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarMateria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
