import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alerta-confirmacion',
  imports: [CommonModule],
  templateUrl: './alerta-confirmacion.html',
  styleUrl: './alerta-confirmacion.scss'
})
export class AlertaConfirmacion {
   @Input() mensaje: string = '';
  @Input() mostrar: boolean = false;
  @Input() onConfirmar!: () => void;
  @Input() onCancelar!: () => void;

  confirmar() {
    this.onConfirmar();
  }

  cancelar() {
    this.onCancelar();
  }
}
