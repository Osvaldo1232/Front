import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEdicionCalificacion } from './modal-edicion-calificacion';

describe('ModalEdicionCalificacion', () => {
  let component: ModalEdicionCalificacion;
  let fixture: ComponentFixture<ModalEdicionCalificacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEdicionCalificacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEdicionCalificacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
