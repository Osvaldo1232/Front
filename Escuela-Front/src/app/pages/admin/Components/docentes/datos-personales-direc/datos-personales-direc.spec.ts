import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPersonalesDirec } from './datos-personales-direc';

describe('DatosPersonalesDirec', () => {
  let component: DatosPersonalesDirec;
  let fixture: ComponentFixture<DatosPersonalesDirec>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosPersonalesDirec]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosPersonalesDirec);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
