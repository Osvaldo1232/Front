import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule  } from '@angular/common';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './profesor.html',
  styleUrl: './profesor.scss' 
})
export class ProfesorComponent { 
  sidebarVisible: boolean = true; 

  constructor(private router: Router) {} 

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  
  logout() {
    this.router.navigate(['/login']);
  }
}