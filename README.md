# 🚀 Frontend Application — Arquitectura & Guía Técnica

Un frontend moderno, modular y escalable construido con **Angular**, aplicando principios SOLID, comunicación reactiva y buenas prácticas de desarrollo web empresarial.

---

## 📌 Tabla de Contenidos
- [Descripción General](#-descripción-general)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura de Software](#-arquitectura-de-software)
- [Patrones de Diseño & Principios Aplicados](#-patrones-de-diseño--principios-aplicados)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración e Instalación](#-configuración-e-instalación)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estrategia de Despliegue & Optimización](#-estrategia-de-despliegue--optimización)

---

## 📖 Descripción General

Este repositorio contiene la capa de cliente (Frontend) diseñada para ofrecer una interfaz de usuario interactiva, responsiva y de alto rendimiento. Se enfoca en una separación clara de responsabilidades:
* **Consumo eficiente de APIs REST**: Comunicación asíncrona optimizada mediante clientes HTTP reactivos.
* **Gestión de estado predictiva**: Flujo de datos unidireccional y control eficiente de eventos de UI.
* **Componentes reutilizables y desacoplados**: Arquitectura diseñada para facilitar el mantenimiento y la escalabilidad a largo plazo.

---

## 🛠 Stack Tecnológico

| Categoría | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Framework Base** | **Angular** | Framework SPA basado en TypeScript para aplicaciones enterprise. |
| **Lenguaje** | **TypeScript** | Superset tipado de JavaScript que garantiza detección de errores en compilación. |
| **Programación Reactiva** | **RxJS** | Manejo de flujos asíncronos y eventos mediante `Observables`. |
| **Estilos & UI** | **SCSS / CSS3 / HTML5** | Arquitectura de estilos modular con preprocesador SCSS. |
| **Consumo HTTP** | **HttpClient** | Manejo de peticiones con interceptores y transformaciones reactivas. |
| **Herramientas & Bundling** | **Angular CLI / Node.js** | Entorno de desarrollo, construcción modular y empaquetado optimizado. |

---

## 📐 Arquitectura de Software

La aplicación sigue una **Arquitectura Modular por Dominios (Feature-based Modular Architecture)** combinada con **Clean Frontend Architecture**.

```
               ┌──────────────────────────────────────────┐
               │           Presentation Layer             │
               │    (Views, Smart/Dumb Components)        │
               └────────────────────┬─────────────────────┘
                                    │
                                    ▼
               ┌──────────────────────────────────────────┐
               │          State & Service Layer           │
               │   (RxJS State / Services / HTTP Clients) │
               └────────────────────┬─────────────────────┘
                                    │
                                    ▼
               ┌──────────────────────────────────────────┐
               │             Core & Infrastructure        │
               │  (Interceptors, Guards, Models, Utils)   │
               └────────────────────┬─────────────────────┘
```

---

## 🧩 Patrones de Diseño & Principios Aplicados

1. **Separación de Responsabilidades (SoC):** La vista solo se encarga de renderizar la UI. La lógica de negocio y las peticiones asíncronas residen exclusivamente en los servicios.
2. **Smart vs. Presentational Components:**
   * **Smart Components (Containers):** Manejan la lógica de negocio, se conectan con servicios y gestionan el flujo de datos.
   * **Presentational Components (Dumb):** Solo reciben datos vía `@Input()` y emiten eventos al padre vía `@Output()`.
3. **Manejo de Memoria (Unsubscribe Pattern):** Uso de pipes de suscripción explícitos (`async` pipe) o ciclo de vida `takeUntilDestroyed` / `Subject` de control para prevenir fugas de memoria (*memory leaks*).
4. **Intercepción Centralizada de HTTP:** Middleware para la inyección automática de tokens de autenticación (JWT) y manejo global de errores de red.

---

## 📂 Estructura del Proyecto

```bash
src/
├── app/
│   ├── core/                  # Módulo Core (Servicios singleton, Interceptores, Guards, Modelos globales)
│   │   ├── guards/            # Protección de rutas (Auth, Roles, etc.)
│   │   ├── interceptors/      # Middleware HTTP (Tokens, Handling de Errores)
│   │   ├── models/            # Interfaces y DTOs globales
│   │   └── services/          # Servicios core del sistema
│   │
│   ├── modules / features/    # Módulos de funcionalidad (Lazy Loading)
│   │   ├── auth/              # Flujo de autenticación (Login, Register)
│   │   └── dashboard/         # Vistas principales del sistema
│   │
│   ├── shared/                # Recursos compartidos entre módulos
│   │   ├── components/        # Componentes reutilizables (Botones, Modales, Spinners)
│   │   ├── pipes/             # Transformadores de formato de datos
│   │   └── directives/        # Directivas personalizadas para comportamiento DOM
│   │
│   ├── app.component.ts       # Componente raíz
│   └── app.routes.ts          # Configuración principal de rutas
│
├── assets/                    # Imágenes, fuentes e íconos estáticos
├── environments/              # Variables de entorno (dev, prod, staging)
└── styles.scss                # Estilos globales y variables SCSS
```

---

## ⚡ Configuración e Instalación

### Requisitos Previos
* **Node.js**: `>= 18.x.x`
* **npm**: `>= 9.x.x`
* **Angular CLI**: Instalado de forma global (`npm i -g @angular/cli`)

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Osvaldo1232/Front.git
   cd Front
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   ng serve
   ```
   Accede a la aplicación navegando a `http://localhost:4200/`.

---

## 🛠 Scripts Disponibles

En el directorio del proyecto puedes ejecutar:

```bash
# Servidor de desarrollo con recarga en vivo
ng serve

# Compilación de producción (Genera artefactos optimizados en /dist)
ng build --configuration production

# Ejecución de pruebas unitarias
ng test

# Análisis de linter y calidad de código
ng lint
```

---

## 📦 Estrategia de Despliegue & Optimización

* **Lazy Loading / Code Splitting:** Carga diferida de módulos para minimizar el tamaño inicial del bundle (*Initial Chunk Size*).
* **Tree Shaking & AOT:** Compilación *Ahead-Of-Time* activa en `build` para eliminar código no utilizado y acelerar la primera renderización (FCP).
* **Cache Busting:** Generación automática de hashes en artefactos de compilación para invalidación eficiente de caché en navegadores.
