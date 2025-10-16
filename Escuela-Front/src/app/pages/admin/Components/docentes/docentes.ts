import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { Materia } from '../../../../models/materia.model';
import { cargarMaterias } from '../../../../store/actions/materia.actions';
import { selectAllMaterias } from '../../../../store/selectors/materia.selectors';

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
  templateUrl: './docentes.html',
  styleUrls: ['./docentes.scss']
})
export class DocentesComponent implements OnInit {
  private store = inject(Store);
  materias = signal<Materia[]>([]);

  terminoBusqueda: string = '';

  usuarios = [
    {
      id: "1", nombre: "Ana", apellidos: "Ramírez López", email: "ana.ramirez@example.com",
      fechaNacimiento: "1990-05-12", rol: "Docente", sexo: "Femenino", especialidad: "Matemáticas",
      rfc: "RALM900512AB1", telefono: "5523456789", clavepresupuestal: "CP-001", estatus: "Activo"
    },
    {
      id: "2", nombre: "Carlos", apellidos: "Gómez Torres", email: "carlos.gomez@example.com",
      fechaNacimiento: "1985-08-20", rol: "Administrador", sexo: "Masculino", especialidad: "Sistemas",
      rfc: "GOTC850820CD2", telefono: "5512345678", clavepresupuestal: "CP-002", estatus: "Activo"
    },
    {
      id: "3", nombre: "María", apellidos: "Hernández Ruiz", email: "maria.hernandez@example.com",
      fechaNacimiento: "1992-03-18", rol: "Docente", sexo: "Femenino", especialidad: "Lengua Española",
      rfc: "HERJ920318EF3", telefono: "5545678901", clavepresupuestal: "CP-003", estatus: "Activo"
    },
    {
      id: "4", nombre: "José", apellidos: "Martínez Pérez", email: "jose.martinez@example.com",
      fechaNacimiento: "1980-11-05", rol: "Director", sexo: "Masculino", especialidad: "Gestión Educativa",
      rfc: "MAPJ801105GH4", telefono: "5556789012", clavepresupuestal: "CP-004", estatus: "Activo"
    },
    {
      id: "5", nombre: "Laura", apellidos: "Cruz Díaz", email: "laura.cruz@example.com",
      fechaNacimiento: "1995-07-09", rol: "Docente", sexo: "Femenino", especialidad: "Ciencias Naturales",
      rfc: "CRUD950709IJ5", telefono: "5589012345", clavepresupuestal: "CP-005", estatus: "Activo"
    },
    {
      id: "6", nombre: "Ricardo", apellidos: "Santos Vega", email: "ricardo.santos@example.com",
      fechaNacimiento: "1988-01-22", rol: "Docente", sexo: "Masculino", especialidad: "Educación Física",
      rfc: "SAVR880122KL6", telefono: "5576543210", clavepresupuestal: "CP-006", estatus: "Inactivo"
    },
    {
      id: "7", nombre: "Diana", apellidos: "Flores Mendoza", email: "diana.flores@example.com",
      fechaNacimiento: "1993-04-30", rol: "Subdirectora", sexo: "Femenino", especialidad: "Orientación Educativa",
      rfc: "FLMD930430MN7", telefono: "5543210987", clavepresupuestal: "CP-007", estatus: "Activo"
    },
    {
      id: "8", nombre: "Jorge", apellidos: "Ortiz Navarro", email: "jorge.ortiz@example.com",
      fechaNacimiento: "1982-09-15", rol: "Docente", sexo: "Masculino", especialidad: "Historia",
      rfc: "ORNJ820915OP8", telefono: "5567890123", clavepresupuestal: "CP-008", estatus: "Activo"
    },
    {
      id: "9", nombre: "Sofía", apellidos: "Reyes Campos", email: "sofia.reyes@example.com",
      fechaNacimiento: "1997-12-01", rol: "Docente", sexo: "Femenino", especialidad: "Inglés",
      rfc: "RECS971201PQ9", telefono: "5590123456", clavepresupuestal: "CP-009", estatus: "Activo"
    },
    {
      id: "10", nombre: "Luis", apellidos: "Velázquez García", email: "luis.velazquez@example.com",
      fechaNacimiento: "1994-02-10", rol: "Coordinador", sexo: "Masculino", especialidad: "Tecnologías de la Información",
      rfc: "VEGL940210QR0", telefono: "5511223344", clavepresupuestal: "CP-010", estatus: "Activo"
    },
    {
      id: "11", nombre: "Patricia", apellidos: "Núñez Herrera", email: "patricia.nunez@example.com",
      fechaNacimiento: "1989-06-25", rol: "Docente", sexo: "Femenino", especialidad: "Biología",
      rfc: "NUHP890625RS1", telefono: "5520987654", clavepresupuestal: "CP-011", estatus: "Activo"
    },
    {
      id: "12", nombre: "Fernando", apellidos: "Lara Jiménez", email: "fernando.lara@example.com",
      fechaNacimiento: "1984-10-02", rol: "Docente", sexo: "Masculino", especialidad: "Educación Artística",
      rfc: "LAJF841002TP2", telefono: "5547658902", clavepresupuestal: "CP-012", estatus: "Activo"
    },
    {
      id: "13", nombre: "Gabriela", apellidos: "Mendoza Ortiz", email: "gabriela.mendoza@example.com",
      fechaNacimiento: "1996-11-11", rol: "Docente", sexo: "Femenino", especialidad: "Química",
      rfc: "MEOG961111YU3", telefono: "5598765432", clavepresupuestal: "CP-013", estatus: "Inactivo"
    },
    {
      id: "14", nombre: "Raúl", apellidos: "Vega Castillo", email: "raul.vega@example.com",
      fechaNacimiento: "1991-01-15", rol: "Docente", sexo: "Masculino", especialidad: "Computación",
      rfc: "VECR910115QA4", telefono: "5532109876", clavepresupuestal: "CP-014", estatus: "Activo"
    },
    {
      id: "15", nombre: "Lucía", apellidos: "Torres Aguilar", email: "lucia.torres@example.com",
      fechaNacimiento: "1993-09-03", rol: "Docente", sexo: "Femenino", especialidad: "Geografía",
      rfc: "TOAL930903RE5", telefono: "5578904321", clavepresupuestal: "CP-015", estatus: "Activo"
    }
  ];

  registrosPorPagina = 9;
  paginaActual = 1;

  get usuariosFiltrados() {
    if (!this.terminoBusqueda.trim()) return this.usuarios;
    const termino = this.terminoBusqueda.toLowerCase();
    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(termino) ||
      u.apellidos.toLowerCase().includes(termino) ||
      u.email.toLowerCase().includes(termino) ||
      u.especialidad.toLowerCase().includes(termino)
    );
  }

  get usuariosPaginados() {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.usuariosFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.usuariosFiltrados.length / this.registrosPorPagina);
  }

  get totalPaginasArray() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  irAPagina(num: number) {
    this.paginaActual = num;
  }

  buscar() {
    this.paginaActual = 1;
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.paginaActual = 1;
  }

  ngOnInit() {
    this.store.dispatch(cargarMaterias());
    this.store.select(selectAllMaterias).subscribe(this.materias.set);
  }
}
