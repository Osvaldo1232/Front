import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { Usuario } from './pages/usuario/usuario';
import { Profesor } from './pages/profesor/profesor';


export const routes: Routes = [
  { path: '', component: Login },
  { path: 'admin', component: Admin },
  { path: 'usuario', component: Usuario },
  { path: 'profesor', component: Profesor },
  { path: '**', redirectTo: '' }
];