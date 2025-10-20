import { ComponentFixture, TestBed } from '@angular/core/testing';
// CORRECCIÓN 1: Usar CalificacionesComponent en la importación
import { CalificacionesComponent } from './calificaciones';

// CORRECCIÓN 2: Usar CalificacionesComponent en el bloque describe
describe('CalificacionesComponent', () => { 
  // CORRECCIÓN 3: Usar CalificacionesComponent para la variable component
  let component: CalificacionesComponent; 
  let fixture: ComponentFixture<CalificacionesComponent>;

  beforeEach(async () => {
   await TestBed.configureTestingModule({
      // CORRECCIÓN 4: Usar CalificacionesComponent en imports
      imports: [CalificacionesComponent] 
    })
    .compileComponents();

    // CORRECCIÓN 5: Usar CalificacionesComponent en createComponent
    fixture = TestBed.createComponent(CalificacionesComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});