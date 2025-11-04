import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCiclo } from './editar-ciclo';

describe('EditarCiclo', () => {
  let component: EditarCiclo;
  let fixture: ComponentFixture<EditarCiclo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCiclo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCiclo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
