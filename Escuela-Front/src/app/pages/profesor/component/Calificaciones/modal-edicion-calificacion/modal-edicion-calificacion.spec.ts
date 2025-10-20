import { ComponentFixture, TestBed } from '@angular/core/testing';

// Corregido: Usar el nombre de la clase completo y la ruta correcta
import { ModalEdicionCalificacionComponent } from './modal-edicion-calificacion'; 

// Corregido: Usar el nombre de la clase completo
describe('ModalEdicionCalificacionComponent', () => { 
  // Corregido: Usar el nombre de la clase completo
  let component: ModalEdicionCalificacionComponent;
  let fixture: ComponentFixture<ModalEdicionCalificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Corregido: Usar el nombre de la clase completo
      imports: [ModalEdicionCalificacionComponent] 
    })
    .compileComponents();

    // Corregido: Usar el nombre de la clase completo
    fixture = TestBed.createComponent(ModalEdicionCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});