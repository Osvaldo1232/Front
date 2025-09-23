import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
 imports: [CommonModule, FormsModule, RouterModule ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {

}
