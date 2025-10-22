import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEdicionCalificacionComponent } from './modal-edicion-calificacion'; 

describe('ModalEdicionCalificacionComponent', () => { 
  let component: ModalEdicionCalificacionComponent;
  let fixture: ComponentFixture<ModalEdicionCalificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEdicionCalificacionComponent] 
    })
    .compileComponents();
    fixture = TestBed.createComponent(ModalEdicionCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});