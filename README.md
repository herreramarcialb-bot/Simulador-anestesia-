# Dental Anesthesia 3D

Simulador educativo en español con React, Vite, Three.js y React Three Fiber. Incluye un **atlas craneofacial de BodyParts3D 3.0 / DBCLS**, con geometría anatómica importada en GLB: **22 huesos y 28 dientes permanentes**, 50 mallas y 441.936 triángulos. La anatomía ya no se construye a partir de primitivas geométricas.

## Ejecutar y visualizar

Node.js 22.12 o superior (validado con Node.js 24):

```bash
npm ci
npm run dev
```

Vite escucha en el puerto **5173**. En un entorno remoto utiliza el reenvío de ese puerto de tu editor, si está disponible. Ese reenvío no equivale a un enlace público permanente. Los archivos anatómicos se incluyen en `public/models/bodyparts3d/`; no se descargan desde bibliotecas externas mientras se usa el simulador.

## Explorar el atlas

- Arrastre izquierdo: rotación; rueda: zoom; arrastre derecho: desplazamiento.
- Cráneo, maxilar, mandíbula y dientes seleccionables y con visibilidad independiente.
- Transparencia ósea regulable; los dientes conservan su opacidad para observar las raíces.
- Vistas frontal, lateral y en perspectiva; cámara adaptada al ancho del visor.
- Jeringa ilustrativa tipo carpule con cartucho translúcido, bastidor metálico, anillos, émbolo y aguja fina. Controles X/Y/Z, inclinación y rotación.
- Recorrido educativo y fichas en español, manteniendo la organización de la interfaz.
- Aviso educativo solicitado, visible en la zona inferior, y atribución de las mallas.

**Nervio alveolar inferior:** el conjunto 3.0 descargado no proporciona una malla verificable de este nervio. Se retiraron los trayectos dibujados de la primera versión. Su ficha textual continúa disponible y el interruptor de visibilidad permanece deshabilitado. No se simula un nervio con coordenadas inventadas.

## Procedencia y licencias

**BodyParts3D, (c) The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan.**

Datos anatómicos: **Creative Commons Attribution-ShareAlike 2.1 Japan**, que permite su utilización y redistribución cumpliendo la atribución y la condición de compartir igual para las adaptaciones. Se conservan el aviso original de licencia, los identificadores FMA, enlaces y hashes de las fuentes. No se atribuye a la institución una validación ni un respaldo de esta aplicación.

Consulta [la atribución completa](public/models/bodyparts3d/ATTRIBUTION.md), [el manifiesto de integridad](public/models/bodyparts3d/manifest.json) y [las decisiones de selección del recurso](docs/model-sources.md). La licencia de las mallas es independiente de las licencias del código y las dependencias. La jeringa es una representación original de la aplicación, no un modelo anatómico de DBCLS.

## Reconstruir el GLB

```bash
python3 scripts/build-anatomy.py
```

Solo requiere la biblioteca estándar de Python y acceso HTTPS al espejo indicado en el script. Descarga STL desde una revisión inmutable de GitHub, comprueba sus SHA-256 contra el manifiesto guardado y genera el GLB con los mismos triángulos y relaciones espaciales. Calcula normales suaves y convierte los ejes; no esculpe ni desplaza individualmente huesos o dientes. La caché se guarda en `/tmp/dental-bodyparts3d-3.0`. **No hace falta reconstruirlo para ejecutar o publicar la app.**

## Comprobar y compilar

```bash
npm test
npm run build
npm run preview
```

Las pruebas comprueban la integridad del GLB y su inventario anatómico, píxeles WebGL en Chromium, errores de consola/HTTP, selección directa, controles de visibilidad, transparencia, cámara, jeringa, modo educativo y diseño móvil. Se usa Chromium en `/usr/bin/chromium` si está instalado. En otras máquinas instala primero el navegador de pruebas con `npx playwright install chromium`.

`npm run build` genera `dist/`; `npm run preview` sirve esa compilación en el puerto **4173**. Three.js y el cargador GLB producen un paquete grande; la compilación puede emitir un aviso de tamaño sin impedir su ejecución.

## Publicación

- **Netlify Drop:** ejecuta `npm run build` y carga `dist/`; el servicio genera el enlace HTTPS. Al conectar el repositorio, `netlify.toml` ya define el comando y la carpeta.
- **Vercel:** importa el proyecto como Vite, con `npm run build` y salida `dist`.

No se requieren claves, cuentas dentro del simulador ni variables de entorno. Los recursos usan rutas relativas, compatibles con alojamiento en un subdirectorio. Conserva los archivos de atribución y licencia al publicar. Compilar o publicar el entorno de desarrollo no publica automáticamente el sitio web.

## Límites educativos

Es un atlas de referencia masculino adulto, **no un modelo específico de paciente ni validado para planificar procedimientos**. Los terceros molares no están incluidos; no se añadieron piezas ni trayectos nerviosos supuestos. Los tejidos blandos, variaciones individuales y detalles pequeños como el conducto mandibular pueden no estar representados con precisión suficiente para anestesia clínica.

La jeringa no está calibrada, no detecta colisiones ni simula punción, aspiración, dosis o evaluación técnica. Su posición inicial no recomienda un punto de inyección. Se requiere formación clínica supervisada.

El texto inferior se conserva exactamente como lo solicitó la usuaria:

> SIMULADOR EXCLUSIVAMENTE EDUCATIVO. LOS CASOS SIN FICTICIOS Y NO SUSTITYEN LA VALORACIÓN CLÍNICA PROFESIONAL
