import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarTutor } from './asignar-tutor';

describe('AsignarTutor', () => {
  let component: AsignarTutor;
  let fixture: ComponentFixture<AsignarTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarTutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarTutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
