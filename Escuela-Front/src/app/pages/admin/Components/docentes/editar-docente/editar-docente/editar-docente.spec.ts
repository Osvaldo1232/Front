import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDocente } from './editar-docente';

describe('EditarDocente', () => {
  let component: EditarDocente;
  let fixture: ComponentFixture<EditarDocente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarDocente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDocente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
