import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { Usuario } from './pages/usuario/usuario';
import { ProfesorComponent } from './pages/profesor/profesor'; // <<-- CORREGIDO a Component
import { DocentesComponent } from './pages/admin/Components/docentes/docentes';
import { AuthGuard } from './guards/auth-guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized';
import { Alumnos } from './pages/admin/Components/alumnos/alumnos';
import { Grado } from './pages/admin/Components/grado/grado';
import { Calificaciones } from './pages/usuario/component/calificaciones/calificaciones'; // Calificaciones Estudiante
import { Historial } from './pages/usuario/component/historial/historial';
import { Grupos } from './pages/admin/Components/grupos/grupos';
import { NuevoAlumno } from './pages/admin/Components/alumnos/nuevo_alumno/nuevo-alumno/nuevo-alumno';
import { PerfilEstudiante } from './pages/admin/Components/alumnos/perfil-estudiante/perfil-estudiante/perfil-estudiante';
import { NuevoDocente } from './pages/admin/Components/docentes/nuevo-docente/nuevo-docente/nuevo-docente';
import { CalificacionesComponent } from './pages/profesor/component/Calificaciones/calificaciones';// Calificaciones Profesor


export const routes: Routes = [
    {
        path: 'admin', component: Admin, canActivate: [AuthGuard], canActivateChild: [AuthGuard], data: { roles: ['DIRECTOR'] },
        children: [
            { path: '', redirectTo: 'docentes', pathMatch: 'full' },
            { path: 'docentes', component: DocentesComponent },
            { path: 'nuevo-docente', component: NuevoDocente },
            { path: 'alumnos', component: Alumnos },
            { path: 'nuevo-alumno', component: NuevoAlumno },
            { path: 'perfil-estudiante', component: PerfilEstudiante },
            { path: 'grados', component: Grado },
            { path: 'grupos', component: Grupos },
        ]
    },
    {
        path: 'usuario', component: Usuario, canActivate: [AuthGuard], canActivateChild: [AuthGuard], data: { roles: ['ESTUDIANTE'] },

        children: [
            { path: '', redirectTo: 'calificaciones', pathMatch: 'full' },
            { path: 'calificaciones', component: Calificaciones },
            { path: 'historial', component: Historial },


        ]
    },

    {
        path: 'profesor',
        component: ProfesorComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        data: { roles: ['PROFESOR'] },
        children: [
            { path: '', redirectTo: 'registro-calificaciones', pathMatch: 'full' },
            { path: 'registro-calificaciones', component: CalificacionesComponent },
            { path: 'Historial', component: CalificacionesComponent },
            { path: 'Historial1', component: CalificacionesComponent },
            { path: 'Historial2', component: CalificacionesComponent },
            { path: 'Historial3', component: CalificacionesComponent },
            { path: 'Historial4', component: CalificacionesComponent },
        ]
    },

    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'login', component: Login },
    { path: '**', redirectTo: 'login' }
];