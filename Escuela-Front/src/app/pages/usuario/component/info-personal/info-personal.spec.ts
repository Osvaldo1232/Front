import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPersonal } from './info-personal';

describe('InfoPersonal', () => {
  let component: InfoPersonal;
  let fixture: ComponentFixture<InfoPersonal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPersonal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPersonal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
