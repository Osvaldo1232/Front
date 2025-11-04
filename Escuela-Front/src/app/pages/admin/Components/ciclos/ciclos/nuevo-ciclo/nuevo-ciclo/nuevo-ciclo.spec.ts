import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoCiclo } from './nuevo-ciclo';

describe('NuevoCiclo', () => {
  let component: NuevoCiclo;
  let fixture: ComponentFixture<NuevoCiclo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoCiclo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoCiclo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
