import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { Usuario } from './pages/usuario/usuario';
import { Profesor } from './pages/profesor/profesor';
import { DocentesComponent } from './pages/admin/Components/docentes/docentes';
import { AuthGuard } from './guards/auth-guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized';
import { Alumnos } from './pages/admin/Components/alumnos/alumnos';



export const routes: Routes = [
  { path: 'admin', component: Admin, canActivate: [AuthGuard] ,  canActivateChild: [AuthGuard], data: { roles: ['DIRECTOR'] },
 children: [
      { path: '', redirectTo: 'docentes', pathMatch: 'full' },
      { path: 'docentes', component: DocentesComponent },
      { path: 'alumnos', component: Alumnos },
    ]
},
  { path: 'usuario', component: Usuario, canActivate: [AuthGuard] , data: { roles: ['ESTUDIANTE'] } },
  { path: 'profesor', component: Profesor, canActivate: [AuthGuard], data: { roles: ['PROFESOR'] } },
   { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'login' }
];
