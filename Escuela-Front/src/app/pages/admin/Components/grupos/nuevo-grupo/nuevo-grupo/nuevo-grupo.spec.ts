import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoGrupo } from './nuevo-grupo';

describe('NuevoGrupo', () => {
  let component: NuevoGrupo;
  let fixture: ComponentFixture<NuevoGrupo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoGrupo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoGrupo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
