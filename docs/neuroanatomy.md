# Implementación del módulo nervioso

La descripción educativa y sus limitaciones se sirven junto a la app en [public/neuro-references.md](../public/neuro-references.md).

- `src/neuroData.js`: diez ramas y nueve técnicas, campos de origen/territorio/órganos/técnicas, mapa FMA → FDI, colores y reglas de lateralidad. Se distinguen dientes con relación pulpar de coberturas parciales/variables. Los datos no contienen puntos de punción.
- `src/NeuroLayer.jsx`: curvas tubulares esquemáticas y superficies aproximadas de territorios blandos, en el marco del GLB existente. Las curvas se seleccionan con raycasting; los territorios no interceptan clics.
- `src/NeuroPanel.jsx`: interruptores individuales, fichas, mapa de territorios y actividad.
- `src/useNeuro.js`: estado del módulo y control de intentos/respuestas de la actividad. Solo una selección de nervio desde la escena puede resolver una pregunta.
- `src/Anatomy.jsx`: conserva el GLB y materiales del atlas; colorea las mallas dentarias por identificador FMA, no por orden de carga. Activa un encuadre de región oral al abrir el módulo.

La transformación común del atlas se conserva. Los trayectos no se han registrado contra forámenes o canales segmentados y **no deben interpretarse como anatomía de precisión**. Las superficies de tejidos blandos son mapas conceptuales, no sustitutos de modelos anatómicos reales. La superposición desactiva la oclusión visual y la selección de huesos para permitir la identificación de nervios; puede desactivarse para explorar profundidad con transparencia.

La suma de nervios mostrados no implica que una sola técnica los bloquee todos. «Mostrar nervios de esta técnica» es una acción separada de la selección individual. El mapa distingue técnicas sin efecto pulpar (mentoniano, bucal, lingual y palatinos) de las técnicas relacionadas con pulpa. El primer molar superior se colorea ámbar cuando su cobertura es parcial o variable, porque la malla dental no permite representar únicamente la raíz mesiovestibular.

## Validación

`npm test` incluye integridad del atlas preexistente, reglas de lateralidad FDI, ausencia de pulpa en bloqueos de tejidos blandos, cambios de color reales en WebGL, diez interruptores, fichas, actividad con clics proyectados sobre las curvas 3D y diseño móvil. La actividad comprueba una respuesta incorrecta y cinco correctas y evita contar una segunda vez un acierto ya registrado.

`npm run build` sigue generando un sitio estático. No se añaden dependencias, servicios ni descargas durante el uso. No se modifica el GLB BodyParts3D ni su manifiesto de integridad.
