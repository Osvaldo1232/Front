import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTutor } from './nuevo-tutor';

describe('NuevoTutor', () => {
  let component: NuevoTutor;
  let fixture: ComponentFixture<NuevoTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoTutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoTutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
