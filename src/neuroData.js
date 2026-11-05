/** Educational concepts only. These paths are hand-authored approximations,
 * NOT segmented nerves or clinical/injection coordinates. See docs/neuroanatomy.md.
 * Coordinates use the existing GLB frame: millimetres, X patient-left,
 * Y superior, Z anterior. Same global transform as BodyParts3D.
 */
export const NEURO_NOTICE =
  "Nervios y tejidos blandos esquemáticos · Trayectos, grosor y límites aproximados; sin precisión clínica ni puntos de punción.";
export const TERRITORY_COLORS = {
  pulp: "#3c8cde",
  soft: "#d85690",
  partial: "#d49b2c",
};
export const NERVES = {
  ian: {
    name: "Alveolar inferior",
    division: "V3",
    color: "#dda62d",
    origin: "División posterior del nervio mandibular (V3).",
    territory:
      "Pulpa de los dientes mandibulares del lado correspondiente. Sus ramas terminales incisiva y mentoniana prolongan el territorio hacia la región anterior, el labio inferior y el mentón.",
    teeth:
      "Todos los dientes inferiores ipsilaterales; puede haber inervación cruzada anterior.",
    techniques: ["ian"],
    notes:
      "El bloqueo del NAI no asegura la anestesia de la encía vestibular de los molares ni de los tejidos linguales. La anestesia lingual concomitante no se presupone en este mapa.",
    paths: [
      [
        [25, 1513, 114],
        [32, 1496, 119],
        [34, 1480, 125],
        [33, 1464, 139],
        [29, 1452, 152],
        [22, 1448, 165],
        [13, 1446, 172],
        [3, 1445, 176],
      ],
    ],
  },
  lingual: {
    name: "Lingual",
    division: "V3",
    color: "#b07bdf",
    origin: "División posterior del nervio mandibular (V3).",
    territory:
      "Sensibilidad general de los dos tercios anteriores de la lengua, suelo de boca y encía lingual mandibular.",
    teeth:
      "Relación con los tejidos linguales de los dientes inferiores; no proporciona anestesia pulpar.",
    techniques: ["lingual"],
    notes:
      "La sensibilidad gustativa viaja con fibras de la cuerda del tímpano (VII); no se representa como función propia de V3 ni se simula aquí.",
    paths: [
      [
        [25, 1513, 114],
        [28, 1491, 125],
        [28, 1474, 136],
        [20, 1461, 149],
        [12, 1460, 160],
        [6, 1462, 171],
      ],
    ],
  },
  buccal: {
    name: "Bucal largo",
    division: "V3",
    color: "#e97852",
    origin:
      "División anterior del nervio mandibular (V3). Es sensitivo, distinto de las ramas bucales motoras del nervio facial.",
    territory:
      "Mucosa de la mejilla y encía/mucoperiostio vestibular de los molares mandibulares.",
    teeth:
      "Molares inferiores como referencia del tejido vestibular; sus pulpas no son su territorio.",
    techniques: ["buccal"],
    notes:
      "Complementa al bloqueo alveolar inferior cuando se requiere anestesia vestibular en la región molar.",
    paths: [
      [
        [27, 1514, 115],
        [34, 1499, 123],
        [40, 1480, 139],
        [36, 1469, 149],
        [32, 1462, 156],
      ],
    ],
  },
  mental: {
    name: "Mentoniano",
    division: "V3",
    color: "#3ca99a",
    origin:
      "Rama terminal del nervio alveolar inferior, que emerge por el foramen mentoniano.",
    territory:
      "Labio inferior, piel del mentón y mucosa/encía vestibular anterior y de la región premolar.",
    teeth:
      "Premolares, canino e incisivos inferiores como referencias regionales. El bloqueo mentoniano NO anestesia sus pulpas.",
    techniques: ["mental", "ian"],
    notes:
      "No debe confundirse con el bloqueo incisivo. El territorio incisivo pulpar no se obtiene por el mero bloqueo del nervio mentoniano.",
    paths: [
      [
        [22, 1448, 165],
        [24, 1451, 175],
        [18, 1455, 185],
        [7, 1456, 191],
      ],
      [
        [22, 1448, 165],
        [19, 1444, 179],
        [9, 1439, 185],
      ],
    ],
  },
  psa: {
    name: "Alveolar superior posterior",
    division: "V2",
    color: "#ce706c",
    origin:
      "Nervio maxilar (V2), antes de su continuación como nervio infraorbitario.",
    territory:
      "Pulpa de molares superiores y tejidos vestibulares de esa región.",
    teeth:
      "Molares superiores. La raíz mesiovestibular del primer molar puede depender del alveolar superior medio.",
    techniques: ["psa"],
    notes:
      "El primer molar se marca como cobertura parcial/variable porque la malla no separa sus raíces. No se afirma anestesia de todo ese diente.",
    paths: [
      [
        [17, 1520, 126],
        [29, 1507, 136],
        [33, 1496, 141],
        [30, 1490, 150],
        [25, 1488, 155],
      ],
    ],
  },
  msa: {
    name: "Alveolar superior medio",
    division: "V2",
    color: "#51a4c8",
    origin: "Rama del nervio infraorbitario (V2), cuando está presente.",
    territory:
      "Plexo dental superior de la región premolar; puede aportar fibras a la raíz mesiovestibular del primer molar.",
    teeth:
      "Premolares superiores y posible raíz mesiovestibular del primer molar.",
    techniques: ["msa", "infraorbital"],
    notes:
      "Es anatómicamente variable y puede estar ausente. La presencia de esta línea esquemática no afirma que exista en todas las personas.",
    paths: [
      [
        [26, 1513, 165],
        [27, 1503, 164],
        [25, 1494, 163],
        [23, 1487, 165],
      ],
    ],
  },
  asa: {
    name: "Alveolar superior anterior",
    division: "V2",
    color: "#c593d8",
    origin:
      "Rama del nervio infraorbitario (V2), dentro del canal infraorbitario.",
    territory:
      "Plexo dental superior anterior y tejidos vestibulares asociados.",
    teeth:
      "Incisivos y canino superiores del lado correspondiente. Puede contribuir a la región premolar si falta el ramo medio.",
    techniques: ["infraorbital"],
    notes:
      "Una infiltración localizada puede actuar sobre ramas terminales, pero no equivale a cubrir toda la región de este mapa.",
    paths: [
      [
        [26, 1513, 165],
        [20, 1504, 178],
        [13, 1497, 182],
        [7, 1488, 184],
        [3, 1485, 184],
      ],
    ],
  },
  infraorbital: {
    name: "Infraorbitario",
    division: "V2",
    color: "#72a953",
    origin:
      "Continuación del nervio maxilar (V2) por el surco y canal infraorbitarios.",
    territory:
      "A través de sus ramas: párpado inferior, ala/lado de la nariz y labio superior. El bloqueo proximal puede alcanzar ramas alveolares anteriores y medias.",
    teeth:
      "Incisivos y canino superiores; cobertura premolar y del primer molar variable según las ramas alcanzadas.",
    techniques: ["infraorbital"],
    notes:
      "La cobertura dental del bloqueo infraorbitario depende de las ramas alveolares; no cubre automáticamente el paladar ni los molares posteriores.",
    paths: [
      [
        [17, 1520, 126],
        [25, 1518, 145],
        [26, 1513, 165],
        [27, 1507, 177],
        [19, 1498, 190],
        [12, 1493, 195],
      ],
      [
        [27, 1507, 177],
        [20, 1511, 188],
      ],
      [
        [27, 1507, 177],
        [30, 1515, 182],
      ],
    ],
  },
  palatine: {
    name: "Palatino mayor",
    division: "V2",
    color: "#db79ad",
    origin:
      "Ramas sensitivas de V2 que transitan por el ganglio pterigopalatino y el conducto palatino.",
    territory:
      "Mucosa, encía y mucoperiostio del paladar duro posterior del lado correspondiente, hasta la línea media.",
    teeth:
      "Región palatina de premolares y molares superiores; no anestesia sus pulpas.",
    techniques: ["palatine"],
    notes:
      "El límite anterior con el territorio nasopalatino tiene solapamiento. Las superficies coloreadas no son fronteras clínicas precisas.",
    paths: [
      [
        [15, 1517, 128],
        [19, 1498, 135],
        [20, 1482, 145],
        [18, 1479, 155],
        [13, 1478, 165],
      ],
    ],
  },
  nasopalatine: {
    name: "Nasopalatino",
    division: "V2",
    color: "#8399dc",
    origin:
      "Ramas sensitivas de V2 a través del ganglio pterigopalatino; desciende por el tabique nasal y el conducto incisivo.",
    territory:
      "Paladar duro anterior, de forma bilateral alrededor de la región incisiva, con solapamiento hacia los caninos.",
    teeth:
      "Incisivos y caninos superiores como referencias palatinas. No se presupone anestesia pulpar.",
    techniques: ["nasopalatine"],
    notes:
      "El trayecto se representa en la línea media. Su mapa palatino es bilateral, independientemente del lado elegido para las demás ramas.",
    paths: [
      [
        [10, 1518, 130],
        [1, 1510, 151],
        [0, 1495, 170],
        [0, 1483, 176],
        [0, 1478, 179],
      ],
      [
        [0, 1478, 179],
        [7, 1478, 175],
      ],
      [
        [0, 1478, 179],
        [-7, 1478, 175],
      ],
    ],
  },
};
export const TECHNIQUES = {
  ian: {
    name: "Bloqueo alveolar inferior",
    nerves: ["ian", "mental"],
    pulp: [31, 32, 33, 34, 35, 36, 37],
    partial: [],
    soft: ["lowerLip", "chin", "lowerVestibular"],
    note: "Se muestra el territorio del NAI. No se presupone bloqueo lingual ni bucal largo. Puede existir inervación cruzada en incisivos.",
  },
  lingual: {
    name: "Bloqueo lingual",
    nerves: ["lingual"],
    pulp: [],
    partial: [],
    soft: ["lingualGingiva", "tongue", "floor"],
    note: "Sensibilidad general de tejidos linguales. Sin anestesia pulpar; no se representa anestesia del gusto.",
  },
  buccal: {
    name: "Bloqueo bucal largo",
    nerves: ["buccal"],
    pulp: [],
    partial: [],
    soft: ["lowerMolarVestibular", "cheek"],
    note: "Tejidos vestibulares de molares inferiores y mejilla. No anestesia la pulpa molar.",
  },
  mental: {
    name: "Bloqueo mentoniano",
    nerves: ["mental"],
    pulp: [],
    partial: [],
    soft: ["lowerLip", "chin", "lowerVestibular"],
    note: "Sin anestesia pulpar. No es equivalente al bloqueo incisivo.",
  },
  psa: {
    name: "Bloqueo alveolar superior posterior",
    nerves: ["psa"],
    pulp: [27],
    partial: [26],
    soft: ["upperMolarVestibular"],
    note: "Primer molar: cobertura parcial/variable, especialmente su raíz mesiovestibular. No se muestran terceros molares porque el atlas no los incluye.",
  },
  msa: {
    name: "Bloqueo alveolar superior medio",
    nerves: ["msa"],
    pulp: [24, 25],
    partial: [26],
    soft: ["upperPremolarVestibular"],
    note: "Ramo medio variable o ausente. El primer molar indica solo una posible contribución a la raíz mesiovestibular.",
  },
  infraorbital: {
    name: "Bloqueo infraorbitario",
    nerves: ["infraorbital", "asa", "msa"],
    pulp: [21, 22, 23],
    partial: [24, 25, 26],
    soft: ["upperAnteriorVestibular", "upperLip", "nose", "eyelid"],
    note: "Premolares y raíz mesiovestibular del primer molar: cobertura variable. No implica cobertura de todo el primer molar ni del paladar.",
  },
  palatine: {
    name: "Bloqueo palatino mayor",
    nerves: ["palatine"],
    pulp: [],
    partial: [],
    soft: ["posteriorPalate"],
    note: "Tejidos palatinos posteriores. Sin anestesia pulpar. Límite anterior aproximado y solapado.",
  },
  nasopalatine: {
    name: "Bloqueo nasopalatino",
    nerves: ["nasopalatine"],
    pulp: [],
    partial: [],
    soft: ["anteriorPalate"],
    bilateral: true,
    note: "Territorio palatino anterior bilateral, con solapamiento hacia los caninos. Sin anestesia pulpar presumida.",
  },
};
export const SOFT_NAMES = {
  lowerLip: "Labio inferior",
  chin: "Mentón",
  lowerVestibular: "Mucosa y encía vestibular anterior/premolar inferior",
  lingualGingiva: "Encía lingual mandibular",
  tongue: "Dos tercios anteriores de la lengua (sensibilidad general)",
  floor: "Suelo de boca",
  lowerMolarVestibular: "Encía vestibular de molares inferiores",
  cheek: "Mucosa de la mejilla",
  upperMolarVestibular: "Encía vestibular molar superior",
  upperPremolarVestibular: "Encía vestibular premolar superior",
  upperAnteriorVestibular: "Encía vestibular anterior superior",
  upperLip: "Labio superior",
  nose: "Región lateral de la nariz",
  eyelid: "Párpado inferior",
  posteriorPalate: "Paladar duro posterior ipsilateral",
  anteriorPalate: "Paladar duro anterior bilateral",
};
// FDI labels are resolved from the original FMA identifiers, not mesh order.
export const FMA_TO_FDI = {
  FMA55681: 11,
  FMA55680: 12,
  FMA55798: 13,
  FMA55689: 14,
  FMA55688: 15,
  FMA55698: 16,
  FMA55697: 17,
  FMA55682: 21,
  FMA55683: 22,
  FMA55799: 23,
  FMA55690: 24,
  FMA55691: 25,
  FMA55699: 26,
  FMA55700: 27,
  FMA57143: 31,
  FMA57141: 32,
  FMA55687: 33,
  FMA55693: 34,
  FMA55692: 35,
  FMA55704: 36,
  FMA55703: 37,
  FMA57142: 41,
  FMA57140: 42,
  FMA55686: 43,
  FMA55694: 44,
  FMA55695: 45,
  FMA55705: 46,
  FMA55706: 47,
};
export function sideTooth(fdi, side) {
  return side === "left" ? fdi : fdi - 10 + (fdi >= 30 ? 20 : 0);
}
export function territoryTeeth(technique, side) {
  const t = TECHNIQUES[technique];
  return {
    pulp: t.pulp.map((f) => sideTooth(f, side)),
    partial: t.partial.map((f) => sideTooth(f, side)),
  };
}
export function sidePoint(point, side) {
  return [side === "left" ? point[0] : -point[0] - 1.3, point[1], point[2]];
}
export const QUIZ_ORDER = [
  "ian",
  "infraorbital",
  "lingual",
  "palatine",
  "mental",
];
