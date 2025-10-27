import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEdicionPersonales } from './modal-edicion-personales';

describe('ModalEdicionPersonales', () => {
  let component: ModalEdicionPersonales;
  let fixture: ComponentFixture<ModalEdicionPersonales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEdicionPersonales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEdicionPersonales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
