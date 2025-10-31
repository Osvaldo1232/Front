import { Injectable, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { AlertaConfirmacion } from './alerta-confirmacion/alerta-confirmacion';

@Injectable({
  providedIn: 'root'
})
export class AlertaConfirmacionService {
  
   constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {}

  mostrar(mensaje: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const componenteRef: ComponentRef<AlertaConfirmacion> = createComponent(AlertaConfirmacion, {
        environmentInjector: this.injector
      });

      componenteRef.instance.mensaje = mensaje;
      componenteRef.instance.mostrar = true;

      componenteRef.instance.onConfirmar = () => {
        resolve(true);
        this.cerrar(componenteRef);
      };

      componenteRef.instance.onCancelar = () => {
        resolve(false);
        this.cerrar(componenteRef);
      };

      this.appRef.attachView(componenteRef.hostView);
      document.body.appendChild(componenteRef.location.nativeElement);
    });
  }

  private cerrar(componenteRef: ComponentRef<AlertaConfirmacion>) {
    componenteRef.instance.mostrar = false;
    setTimeout(() => {
      this.appRef.detachView(componenteRef.hostView);
      componenteRef.destroy();
    }, 200);
  }
}
