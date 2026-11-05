# Nervios y territorios anestésicos — alcance y referencias

## Qué se representa

El cráneo, maxilares, mandíbula y dientes siguen siendo las **mismas 50 mallas BodyParts3D 3.0** (DBCLS). Su licencia **CC BY-SA 2.1 Japan** y su atribución se conservan en `models/bodyparts3d/ATTRIBUTION.md`. No se modificó el GLB anatómico.

Las líneas de nervios y las superficies coloreadas de tejidos blandos son **esquemas originales de esta aplicación**, realizados para relacionar conceptos anatómicos. No son nervios segmentados, datos de pacientes, mallas descargadas de un atlas ni geometrías extraídas de los libros citados. No se atribuyen estos dibujos a DBCLS. Las visualizaciones que incorporan el atlas siguen sujetas a sus requisitos de atribución y de compartir igual.

Se muestran diez ramas relacionadas con odontología: alveolar inferior, lingual, bucal largo, mentoniano, alveolares superiores posterior/medio/anterior, infraorbitario, palatino mayor y nasopalatino. El origen V2/V3 se indica en las fichas. No se reconstruyen el encéfalo, el ganglio trigeminal ni todas las ramas del trigémino.

## Bases conceptuales y bibliografía para revisión docente

- Malamed, Stanley F. **Handbook of Local Anesthesia**, 7.ª edición, Elsevier, 2020: anatomía de la inervación odontológica y territorios de técnicas maxilares y mandibulares.
- Standring, Susan (ed.). **Gray’s Anatomy: The Anatomical Basis of Clinical Practice**, 42.ª edición, Elsevier, 2020: relaciones generales de los nervios maxilar y mandibular, sus ramas y los tejidos orales.
- Como recurso complementario: MSD Manual Professional, procedimientos de bloqueo alveolar inferior e infraorbitario. Los enlaces de consulta son https://www.msdmanuals.com/professional/dental-disorders/how-to-do-dental-procedures/how-to-do-an-inferior-alveolar-nerve-block y https://www.msdmanuals.com/professional/dental-disorders/how-to-do-dental-procedures/how-to-do-an-infraorbital-nerve-block-intraoral .

Las relaciones generales se basan en esta anatomía convencional. **Los puntos y límites gráficos son aproximaciones manuales del proyecto, no coordenadas publicadas por esas fuentes.** No se han copiado ilustraciones, ni se citan páginas o figuras que no se hayan comprobado. Este entorno bloqueó el acceso web a NCBI Bookshelf y MSD Manual: no se presenta su consulta en línea como verificada. La bibliografía permite a la docente contrastar el contenido antes de utilizarlo en enseñanza formal.

## Búsqueda de mallas nerviosas

Se volvió a consultar la documentación pública de **BodyParts3D 4.3**, espejo `olivercase/body_parts_3d_api`, revisión `fd527e6f4daf732fd814314d9257df5877b844bc`. El catálogo declara datos DBCLS bajo **CC BY-SA 2.1 Japan** y distribuye OBJ mediante Git LFS. Los índices identifican, entre otras estructuras, los troncos alveolares inferiores derecho e izquierdo (FMA80518/FMA80519). En este entorno no se pudieron descargar y verificar esas geometrías. La licencia del código del espejo (MIT) no se confunde con la de sus datos.

No se concluye que no existan modelos nerviosos. Se concluye que **no se obtuvo un conjunto compatible y verificable para incorporar en esta tarea**. No se usan punteros LFS como si fueran mallas, ni modelos de licencia desconocida. La alternativa esquemática ha sido autorizada expresamente por la usuaria y está identificada en el visor, las fichas y los territorios.

## Convenciones gráficas

- El lado es **del paciente**, no del observador. El selector cambia entre lado izquierdo y derecho. El mapa nasopalatino anterior se muestra bilateral.
- Los esquemas comparten el sistema de coordenadas del atlas para situar regiones generales; su grosor está aumentado para facilitar la selección. Se aplica una simetría aproximada entre lados, no una reconstrucción bilateral individualizada.
- **Azul:** diente relacionado con anestesia pulpar de la técnica. Se colorea el órgano completo porque la malla no separa pulpa ni raíces individuales.
- **Ámbar:** cobertura pulpar parcial o variable. En el primer molar superior no significa que toda la pieza esté anestesiada; puede corresponder a una raíz concreta según la anatomía y el bloqueo.
- **Rosa:** superficies esquemáticas de territorios de tejidos blandos. No son piel, mucosa, lengua o encía segmentadas; sus fronteras no son exactas.
- La opción **Superponer nervios y territorios** ignora la oclusión por hueso para permitir su estudio y selección. No es una afirmación sobre profundidad o posición clínica; en ese modo el clic del visor se reserva para nervios.
- No se dibujan puntos de punción ni se proporcionan coordenadas, profundidades, dosis o instrucciones de inyección al estudiante.

## Distinciones que debe enseñar el módulo

| Técnica conceptual          | Relación pulpar                                                                                                       | Tejidos blandos y advertencias                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Alveolar inferior           | Dientes mandibulares ipsilaterales; variación/inervación cruzada anterior posible                                     | Labio inferior, mentón y región vestibular anterior/premolar por ramas terminales. No se presupone anestesia del lingual o del bucal largo. |
| Lingual                     | Ninguna                                                                                                               | Encía lingual mandibular, suelo de boca y sensibilidad general de los dos tercios anteriores de lengua. El gusto no se atribuye a V3.       |
| Bucal largo                 | Ninguna                                                                                                               | Mucosa de mejilla y encía vestibular de molares inferiores. No confundir con ramas motoras bucales del VII.                                 |
| Mentoniano                  | Ninguna                                                                                                               | Labio inferior, mentón y tejidos vestibulares anteriores/premolares. No equivale al bloqueo incisivo.                                       |
| Alveolar superior posterior | Molares superiores; el primer molar se marca como parcial/variable                                                    | Encía vestibular molar; posible excepción de raíz mesiovestibular del primer molar. Los terceros molares no están en este atlas.            |
| Alveolar superior medio     | Premolares y posible contribución a raíz mesiovestibular del primer molar                                             | Ramo variable, a veces ausente; no se afirma su presencia en toda persona.                                                                  |
| Infraorbitario              | Región anterior superior por ramas alveolares; premolares y raíz mesiovestibular del primer molar se marcan variables | Región infraorbitaria, nariz lateral, labio superior y región vestibular anterior. No se presupone paladar ni molares posteriores.          |
| Palatino mayor              | Ninguna                                                                                                               | Paladar duro posterior ipsilateral, con solapamiento anterior.                                                                              |
| Nasopalatino                | No se presupone                                                                                                       | Paladar duro anterior bilateral, con solapamiento hacia caninos.                                                                            |

El texto de dientes asociados en la ficha de un nervio indica una **relación regional**, que no siempre es inervación pulpar: por ejemplo, un molar se relaciona con el bucal largo a través de su encía vestibular, no de su pulpa. La anestesia pulpar real no se predice por el color; exige evaluación clínica individual.

## Actividad

Cinco preguntas de identificación con selección directa de los trayectos en 3D, incluyendo retroalimentación tras errores. Los botones con nombres se ocultan durante la actividad. Se cuentan intentos y preguntas resueltas, sin conceder puntos repetidos a una pregunta ya resuelta. La actividad no evalúa competencia para realizar inyecciones.
