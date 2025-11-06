import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trimestres } from './trimestres';

describe('Trimestres', () => {
  let component: Trimestres;
  let fixture: ComponentFixture<Trimestres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trimestres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Trimestres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
