# Dental Anesthesia 3D

Simulador web educativo en español para estudiantes de odontología, construido con React 19, Vite, Three.js y React Three Fiber. No necesita servidor de datos, cuentas, claves ni modelos descargados de terceros.

## Ejecutar y ver la aplicación

Requisito: Node.js 22.12 o superior (validado con Node.js 24).

```bash
npm ci
npm run dev
```

Abre en tu navegador la dirección que muestra Vite (habitualmente el puerto 5173). En un entorno remoto, usa el reenvío de puertos de tu editor para el puerto **5173**. La disponibilidad del reenvío depende de la plataforma; no es un enlace público permanente.

## Funciones

- Mandíbula, maxilar, 28 dientes esquemáticos y trayecto bilateral del nervio alveolar inferior.
- Órbita con arrastre izquierdo, zoom con rueda y desplazamiento con arrastre derecho.
- Selección de estructuras en la escena o en la lista, con explicaciones en español.
- Interruptores independientes para huesos, dientes, nervio y jeringa.
- Transparencia ósea regulable; vistas frontal, lateral y en perspectiva.
- Jeringa tipo carpule con posición X/Y/Z, inclinación y rotación; restablecimiento de controles.
- Recorrido educativo de cuatro pasos sobre el bloqueo alveolar inferior.
- Diseño adaptable a escritorio y móvil; visor ampliable y ayuda integrada.

## Comprobar y compilar

```bash
npm run build
npm run preview
npm test
```

Las pruebas Playwright comprueban píxeles WebGL de la escena, cambios visuales al ocultar el nervio y cambiar la cámara, selección, transparencia, jeringa, recorrido educativo y diseño móvil. Usan Chromium del sistema si existe en `/usr/bin/chromium`; en otras máquinas, instala primero el navegador con `npx playwright install chromium`. No se necesitan estas herramientas de prueba para publicar la aplicación.

## Publicar un enlace para compartir

La compilación genera un sitio estático en `dist/`.

**Netlify:** ejecuta `npm run build` y carga la carpeta `dist` en Netlify Drop. El servicio proporciona un enlace HTTPS compartible. También puedes conectar este repositorio a Netlify; `netlify.toml` contiene el comando y el directorio de publicación.

**Vercel:** importa el repositorio, selecciona Vite y utiliza `npm run build` con directorio de salida `dist`. No se requieren variables de entorno.

La app usa rutas de recursos relativas para admitir también alojamiento en un subdirectorio. La creación de una compilación local no equivale a una publicación: el enlace público solo existe después de desplegarla en un servicio de alojamiento.

## Alcance anatómico y educativo

**El modelo es esquemático y no está validado clínicamente.** La geometría se genera en `src/Anatomy.jsx`; no procede de segmentación de imágenes médicas. Las proporciones, raíces, trayectos nerviosos y referencias son simplificaciones. El maxilar no reproduce el cráneo completo; los tejidos blandos y las variaciones anatómicas no están representados.

La jeringa tiene movimiento libre, sin colisiones, punción, aspiración, dosis ni evaluación de técnica. Su posición inicial no indica una posición de inyección recomendada. El recorrido explica relaciones anatómicas; no prescribe profundidades, dosis ni angulaciones. No debe utilizarse para planificar tratamientos o practicar procedimientos sin supervisión. Antes de ampliar a una simulación clínica se requiere revisión por docentes y un modelo anatómico validado.

## Estructura

- `src/main.jsx`: interfaz, estado, paneles y recorrido educativo.
- `src/Anatomy.jsx`: geometría anatómica, jeringa, iluminación y cámara.
- `src/styles.css`: estilos y diseño adaptable.
- `tests/simulator.spec.js`: pruebas funcionales de navegador.
