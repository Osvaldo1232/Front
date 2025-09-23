import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-docentes',
  imports: [CommonModule, FormsModule, RouterModule , ButtonModule, TableModule],
  templateUrl: './docentes.html',
  styleUrl: './docentes.scss'
})
export class Docentes {
 products!: any[];
}
