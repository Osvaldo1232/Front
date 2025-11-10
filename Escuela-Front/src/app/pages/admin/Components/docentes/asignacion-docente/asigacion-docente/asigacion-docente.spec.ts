import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsigacionDocente } from './asigacion-docente';

describe('AsigacionDocente', () => {
  let component: AsigacionDocente;
  let fixture: ComponentFixture<AsigacionDocente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsigacionDocente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsigacionDocente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
