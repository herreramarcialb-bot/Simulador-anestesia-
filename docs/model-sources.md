# Selección y trazabilidad de los recursos anatómicos

## Recurso incorporado

Se seleccionó **BodyParts3D / Anatomography 3.0 (20110915)** del **Database Center for Life Science (DBCLS)**, distribuido en un espejo de Kevin Mattheus Moerman. No es un cráneo generado con figuras básicas. Las mallas originales contienen superficies anatómicas individualizadas: huesos, suturas, órbitas, arcos cigomáticos, rama mandibular, coronas y raíces dentales.

La procedencia se verificó leyendo el README del espejo, su aviso `LICENSE_content`, la tabla anatómica `parts_list_e.txt` y los archivos STL binarios. La revisión de origen quedó fijada en `f0eeb6e843380cfe6b83797cf8c3e1af74de5e61`. Cada archivo tiene SHA-256 y nombre FMA en el manifiesto local. El artículo original y el identificador del archivo oficial constan en ATTRIBUTION.md.

Los archivos fuente del espejo están en STL, derivados del OBJ original. Se convirtieron a **GLB 2.0 local**, uno de los formatos solicitados. El GLB preserva los 441.936 triángulos sin decimación. La conversión conserva las relaciones entre las 50 estructuras; no mezcla piezas procedentes de diferentes cráneos. Solo cambia los ejes de forma rígida y calcula normales suaves. Una transformación global uniforme adapta las unidades al visor.

La licencia de los datos es **CC BY-SA 2.1 Japan**, indicada tanto en el README como en el aviso conservado. La atribución figura en pantalla, en los archivos servidos junto al GLB y en el README. La versión adaptada de las mallas se redistribuye bajo esa misma licencia. No se aplica por error la licencia MIT del código del espejo a los datos anatómicos.

## Recursos consultados y descartados

- **BodyParts3D 4.3**, espejo `olivercase/body_parts_3d_api`, revisión `fd527e6f4daf732fd814314d9257df5877b844bc`: contiene índices de OBJ y declara CC BY-SA 2.1 Japan. Identifica `FJ3903 / FMA80518` y `FJ3942 / FMA80519` como los troncos alveolares inferiores derecho e izquierdo. Los archivos reales están en Git LFS; en este entorno las descargas no pudieron completarse y verificarse. Un puntero LFS no es una malla y no se ha incluido como si lo fuera. Además, los códigos FMA de su MANIFEST.csv agrupan algunas piezas; los nombres reales de archivo usan identificadores más específicos. No se utilizó esa tabla para atribuir geometrías que no se descargaron.
- **Human Atlas**, `ashemag/human-atlas`: se consultaron README y catálogo `atlas.json`. Ofrece una distribución procesada de BodyParts3D 4.0 en buffers binarios y declara CC BY 4.0. No se encontró un componente del nervio alveolar inferior en su catálogo y no fue necesario reutilizar sus buffers ni adoptar su declaración de licencia.
- **Z-Anatomy**, `LluisV/Z-Anatomy`: se revisó la organización pública del proyecto Unity. No se incorporaron sus modelos ni dependencias; el conjunto BodyParts3D con licencia y mallas verificadas resultó suficiente para esta mejora craneofacial.

No se incorporaron recursos de Sketchfab o NIH 3D ni modelos cuya licencia dependa únicamente de una etiqueta no comprobada. No se descargaron ni redistribuyeron modelos de pago o sin permiso explícito.

## Decisión sobre los nervios

No se conserva la curva manual de la primera versión. Sin malla descargada y verificable, no es correcto presentar un trayecto como anatómicamente fundamentado. La interfaz mantiene la ficha explicativa y señala que **no hay representación nerviosa 3D en esta versión**.

Opciones para una futura integración: obtener las mallas 4.3 con su licencia y hashes, y revisar su registro con el cráneo de referencia; o incorporar un conjunto craneofacial con nervios segmentados y licencia compatible aprobado por la profesora. Cualquier trazo manual requeriría referencias documentadas, revisión docente y etiquetado específico antes de mostrarse; no se utilizó como sustituto aquí.

## Límites de precisión

Tener procedencia verificable no equivale a validación clínica para anestesia. Se trata de una referencia anatómica masculina adulta. No hay tejidos blandos ni 32 dientes completos: la fuente seleccionada proporciona **28 dientes permanentes, sin terceros molares**. No se añadieron piezas duplicadas. La anatomía del conducto mandibular y detalles pequeños pueden ser insuficientes para orientar una punción. La jeringa ilustrativa y su ubicación no representan una técnica recomendada.
