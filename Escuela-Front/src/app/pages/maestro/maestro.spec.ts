import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maestro } from './maestro';

describe('Maestro', () => {
  let component: Maestro;
  let fixture: ComponentFixture<Maestro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maestro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Maestro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
