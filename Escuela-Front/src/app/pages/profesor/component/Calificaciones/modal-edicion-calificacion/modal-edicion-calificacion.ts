import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edicion-calificacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal fade" [class.show]="registro" tabindex="-1" aria-modal="true" role="dialog" *ngIf="registro">
      <div class="modal-dialog modal-dialog-centered modal-lg"> <div class="modal-content">
          
          <div class="modal-header bg-vino text-black">
            <h5 class="modal-title titulo-modal">Editar Calificación: {{ registroEdicion.nombreEstudiante }}</h5>
            <button type="button" class="btn-close btn-close-black" (click)="cerrarModal()" aria-label="Cerrar"></button>
          </div>
          
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label required-label">Estudiante:</label>
                <input type="text" class="form-control" [value]="registroEdicion.nombreEstudiante" disabled>
              </div>
              <div class="col-md-3">
                <label class="form-label required-label">Matrícula:</label>
                <input type="text" class="form-control" [value]="registroEdicion.matricula" disabled>
              </div>
              <div class="col-md-3">
                <label class="form-label required-label">Materia:</label>
                <input type="text" class="form-control" [value]="registroEdicion.materia" disabled>
              </div>

              <div class="col-md-3">
                <label class="form-label required-label">Grado:</label>
                <input type="text" class="form-control" [value]="registroEdicion.grado" disabled>
              </div>
              <div class="col-md-3">
                <label class="form-label required-label">Grupo:</label>
                <input type="text" class="form-control" [value]="registroEdicion.grupo" disabled>
              </div>
              <div class="col-md-3">
                <label class="form-label required-label">Trimestre:</label>
                <input type="text" class="form-control" [value]="registroEdicion.trimestre" disabled>
              </div>
              <div class="col-md-3">
                <label class="form-label required-label">Ciclo:</label>
                <input type="text" class="form-control" [value]="registroEdicion.ciclo" disabled>
              </div>

              <div class="col-12 mt-4">
                <label class="form-label required-label">Nueva Calificación:</label>
                <input type="number" class="form-control form-control-lg" 
                       [(ngModel)]="registroEdicion.calificacion" 
                       min="0" max="10" 
                       placeholder="0 - 10">
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-action btn-limpiar" (click)="cerrarModal()">Cancelar</button>
            <button type="button" class="btn btn-action btn-guardar" (click)="guardarCambios()">Guardar</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" *ngIf="registro"></div>
  `,
  styles: [`
    /* Estilos estandarizados (con !important para sobrescribir Bootstrap) */
    .modal.show { display: block; }
    
    .titulo-modal {
        font-weight: 600;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .required-label {
        font-weight: 500;
        color: #495057; 
    }
    .form-control-lg {
        font-size: 1.25rem;
        font-weight: bold;
    }
    
    /* Botones Estandarizados (Vino y Gris) */
    .btn-action {
        font-weight: 600;
        padding: 0.5rem 1.5rem;
        border-radius: 0.5rem; 
    }
    .btn-guardar { 
        background-color: #530909 !important;
        border-color: #530909 !important;
        color: white; 
    }
    .btn-limpiar {
        background-color: #6c757d !important;
        border-color: #6c757d !important;
        color: white;
    }
  `]
})
export class ModalEdicionCalificacionComponent implements OnChanges {
  @Input() registro: any;
  @Output() cerrar = new EventEmitter<any>();

  registroEdicion: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registro'] && this.registro) {
      this.registroEdicion = JSON.parse(JSON.stringify(this.registro));
    }
  }

  guardarCambios(): void {
    this.cerrar.emit(this.registroEdicion);
  }

  cerrarModal(): void {
    this.cerrar.emit(null); 
  }
}