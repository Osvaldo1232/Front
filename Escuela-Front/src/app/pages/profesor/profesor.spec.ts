import { ComponentFixture, TestBed } from '@angular/core/testing';
// Importamos la clase con el nombre correcto: ProfesorComponent
import { ProfesorComponent } from './profesor'; 

// Usamos el nombre completo del componente en el bloque de descripción
describe('ProfesorComponent', () => { 
  // La variable del componente debe ser de tipo ProfesorComponent
  let component: ProfesorComponent; 
  let fixture: ComponentFixture<ProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // El standalone component se importa con el nombre completo
      imports: [ProfesorComponent] 
    })
    .compileComponents();

    // Al crear el componente, usamos el nombre completo
    fixture = TestBed.createComponent(ProfesorComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
