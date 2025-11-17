import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAnios } from './select-anios';

describe('SelectAnios', () => {
  let component: SelectAnios;
  let fixture: ComponentFixture<SelectAnios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAnios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAnios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
