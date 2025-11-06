import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaMateria } from './nueva-materia';

describe('NuevaMateria', () => {
  let component: NuevaMateria;
  let fixture: ComponentFixture<NuevaMateria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaMateria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaMateria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
