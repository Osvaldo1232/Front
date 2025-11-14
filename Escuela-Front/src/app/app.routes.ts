import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { Usuario } from './pages/usuario/usuario';
import { ProfesorComponent } from './pages/profesor/profesor';
import { DocentesComponent } from './pages/admin/Components/docentes/docentes';
import { AuthGuard } from './guards/auth-guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized';
import { AlumnosComponent } from './pages/admin/Components/alumnos/alumnos';
import { Grado } from './pages/admin/Components/grado/grado';
import { Calificaciones } from './pages/usuario/component/calificaciones/calificaciones';
import { Historial } from './pages/usuario/component/historial/historial';
import { GruposComponent } from './pages/admin/Components/grupos/grupos';
import { NuevoAlumno } from './pages/admin/Components/alumnos/nuevo_alumno/nuevo-alumno/nuevo-alumno';
import { PerfilEstudiante } from './pages/admin/Components/alumnos/perfil-estudiante/perfil-estudiante/perfil-estudiante';
import { NuevoDocente } from './pages/admin/Components/docentes/nuevo-docente/nuevo-docente/nuevo-docente';
import { CalificacionesComponent } from './pages/profesor/component/Calificaciones/calificaciones';
import { DatosPersonales } from './pages/profesor/component/datos-personales/datos-personales';
import { Materias } from './pages/profesor/component/materias/materias';
import { HistorialAcademico } from './pages/profesor/component/historial-academico/historial-academico';
import { InfoPersonalComponent } from './pages/usuario/component/info-personal/info-personal';
import { CampoFormativo } from "./pages/admin/Components/campo-formativo/campo-formativo";
import { TutoresComponent } from './pages/admin/Components/tutores/tutores/tutores';
import { DatosPersonalesDirec } from './pages/admin/Components/docentes/datos-personales-direc/datos-personales-direc';
import { Alumnos } from './pages/profesor/component/alumnos/alumnos';
import { CiclosEscolaresComponent } from './pages/admin/Components/ciclos/ciclos/ciclos';
import { CalificacionGene } from './pages/usuario/component/calificacion-gene/calificacion-gene';
import { AsignacionGrado } from './pages/admin/Components/asignacion-grado/asignacion-grado';
import { TrimestresComponent } from './pages/admin/Components/trimestres/trimestres';
import { MateriasComponent } from './pages/admin/Components/materia/materia/materia';
import { ListaGradoMaterias } from './pages/admin/Components/lista-grado-materias/lista-grado-materias';


export const routes: Routes = [
    {
        path: 'admin', component: Admin, canActivate: [AuthGuard], canActivateChild: [AuthGuard], data: { roles: ['DIRECTOR'] },
        children: [
            { path: '', redirectTo: 'docentes', pathMatch: 'full' },
            { path: 'docentes', component: DocentesComponent },
            { path: 'nuevo-docente', component: NuevoDocente },
            { path: 'alumnos', component: AlumnosComponent },
            { path: 'nuevo-alumno', component: NuevoAlumno },
            { path: 'perfil-estudiante', component: PerfilEstudiante },
            { path: 'grados', component: Grado },
            { path: 'grupos', component: GruposComponent },
            { path: 'campoformativo', component: CampoFormativo },
            { path: 'tutores', component: TutoresComponent },
            { path: 'asignaciongradogrupo', component: AsignacionGrado },
            { path: 'datos-personalesdirec', component: DatosPersonalesDirec },
            { path: 'ciclos', component: CiclosEscolaresComponent },
            { path: 'trimestres', component: TrimestresComponent },
            { path: 'materias', component: MateriasComponent },
            { path: 'lista-grado-materias', component: ListaGradoMaterias },


        ]
    },
    {
        path: 'usuario', component: Usuario, canActivate: [AuthGuard], canActivateChild: [AuthGuard], data: { roles: ['ESTUDIANTE'] },

        children: [
            { path: '', redirectTo: 'calificaciones', pathMatch: 'full' },
            { path: 'calificaciones', component: Calificaciones },
            { path: 'historial', component: Historial },
            { path: 'info-personal', component: InfoPersonalComponent },
            {path: 'calificacion-gene/:idMateria',component:CalificacionGene}
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
            { path: 'datos-personales', component: DatosPersonales },
            { path: 'materias', component: Materias },
            { path: 'Historial-academico', component: HistorialAcademico },
            { path: 'Historial-alumno', component: Historial },
            { path: 'alumnoss', component: Alumnos },
            { path: 'calificaciones/:idMateria', component: CalificacionesComponent}
            
        ]
    },

    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'login', component: Login },
    { path: '**', redirectTo: 'login' }
];