import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AuthInterceptor } from './interceptors/auth-interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { materiaReducer } from './store/reducers/materia.reducer';
import { MateriaEffects } from './store/effects/materia.effects';
import { ServiciosDirector } from './pages/admin/Services/servicios-director';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      FormsModule,
      BrowserAnimationsModule
    ),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideStore({ materias: materiaReducer }),
    provideEffects([MateriaEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    ServiciosDirector
  ]
};
