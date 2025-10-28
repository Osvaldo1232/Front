import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoFormativo } from './campo-formativo';

describe('CampoFormativo', () => {
  let component: CampoFormativo;
  let fixture: ComponentFixture<CampoFormativo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampoFormativo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampoFormativo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
