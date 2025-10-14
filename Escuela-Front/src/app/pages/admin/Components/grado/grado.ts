import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';


@Component({
  selector: 'app-grado',
 standalone: true,
  imports: [
   
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TableModule,
    CheckboxModule,
    MultiSelectModule
  ],
  templateUrl: './grado.html',
  styleUrls: ['./grado.scss'] 
})
export class Grado {


 }
