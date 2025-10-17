import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoDocente } from './nuevo-docente';

describe('NuevoDocente', () => {
  let component: NuevoDocente;
  let fixture: ComponentFixture<NuevoDocente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoDocente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoDocente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
