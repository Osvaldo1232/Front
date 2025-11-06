import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaGradoMaterias } from './lista-grado-materias';

describe('ListaGradoMaterias', () => {
  let component: ListaGradoMaterias;
  let fixture: ComponentFixture<ListaGradoMaterias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaGradoMaterias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaGradoMaterias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
