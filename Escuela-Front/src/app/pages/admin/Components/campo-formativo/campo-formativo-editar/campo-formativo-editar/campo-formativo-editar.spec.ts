import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoFormativoEditar } from './campo-formativo-editar';

describe('CampoFormativoEditar', () => {
  let component: CampoFormativoEditar;
  let fixture: ComponentFixture<CampoFormativoEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampoFormativoEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampoFormativoEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
