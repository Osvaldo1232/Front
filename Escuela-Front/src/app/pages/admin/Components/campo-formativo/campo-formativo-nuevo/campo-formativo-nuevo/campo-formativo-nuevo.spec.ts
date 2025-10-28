import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoFormativoNuevo } from './campo-formativo-nuevo';

describe('CampoFormativoNuevo', () => {
  let component: CampoFormativoNuevo;
  let fixture: ComponentFixture<CampoFormativoNuevo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampoFormativoNuevo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampoFormativoNuevo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
