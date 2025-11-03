import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTutor } from './editar-tutor';

describe('EditarTutor', () => {
  let component: EditarTutor;
  let fixture: ComponentFixture<EditarTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarTutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
