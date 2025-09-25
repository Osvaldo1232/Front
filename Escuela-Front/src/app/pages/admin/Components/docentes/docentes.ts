import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-docentes',
   standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule
  ],
  templateUrl: './docentes.html', // Usa el nombre correcto de archivo
  styleUrls: ['./docentes.scss']  // 👈 Esta es la forma correcta
})
export class DocentesComponent {
  products = [
    { code: 'P001', name: 'Producto 1', category: 'Cat A', quantity: 10 },
    { code: 'P002', name: 'Producto 2', category: 'Cat B', quantity: 5 },
    { code: 'P003', name: 'Producto 3', category: 'Cat C', quantity: 12 }
  ];
}
