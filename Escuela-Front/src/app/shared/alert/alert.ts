import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class Alert {
 @Input() type: 'success' | 'danger' | 'warning' = 'warning';
  @Input() title: string = 'Servicio no disponible';
  @Input() message: string = '';
  
  private closeCallback?: () => void;

  setCloseCallback(callback: () => void) {
    this.closeCallback = callback;
  }

  close() {
    if (this.closeCallback) {
      this.closeCallback();
    }
  }
}
