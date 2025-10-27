import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector, EmbeddedViewRef, EnvironmentInjector, createComponent } from '@angular/core';

import { Alert } from './alert/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
 constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  show(message: string, type: 'success' | 'danger' | 'warning' = 'warning', title?: string) {
    const componentRef = createComponent(Alert, {
      environmentInjector: this.injector
    });

    componentRef.instance.message = message;
    componentRef.instance.type = type;
    if (title) {
      componentRef.instance.title = title;
    }

    // Callback para cerrar
    componentRef.instance.setCloseCallback(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    this.appRef.attachView(componentRef.hostView);
    const domElem = componentRef.location.nativeElement;
    document.body.appendChild(domElem);
  }
}
