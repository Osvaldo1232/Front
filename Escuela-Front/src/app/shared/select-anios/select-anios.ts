import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-anios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-anios.html',
  styleUrl: './select-anios.scss'
})
export class SelectAnios implements OnInit {
   @Input() cantidad: number = 50; // años hacia adelante desde el actual
  @Input() selected: number | null = null; // año inicio
  @Output() selectedChange = new EventEmitter<number>(); // two-way binding
  @Input() disabled: boolean = false; // 👈 Esto es necesario


  anios: number[] = [];
  anioFin: number | null = null;

  ngOnInit(): void {
    const actual = new Date().getFullYear();
    this.anios = Array.from({ length: this.cantidad }, (_, i) => actual + i);
    if (this.selected) {
      this.actualizarAnioFin();
    }
  }

onChange(event: Event) {
  const target = event.target as HTMLSelectElement | null;
  if (!target) return;

  const value = target.value;
  this.selected = Number(value);
  this.actualizarAnioFin();
  this.selectedChange.emit(this.selected);
}

  private actualizarAnioFin() {
    if (this.selected) {
      this.anioFin = this.selected + 1;
    } else {
      this.anioFin = null;
    }
  }

}