import React, { Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Box,
  Check,
  ChevronRight,
  CircleHelp,
  Eye,
  GraduationCap,
  Info,
  Layers3,
  Maximize2,
  Mouse,
  Move3D,
  RotateCcw,
  Rotate3D,
  Syringe,
  X,
} from "lucide-react";
import { Scene, ModelLoadingStatus } from "./Anatomy";
import "./styles.css";
import { NERVES, NEURO_NOTICE, TECHNIQUES } from "./neuroData";
import { NeuroPanel, NeuroLearning, NerveDetails } from "./NeuroPanel";
import { useNeuro } from "./useNeuro";
const structures = {
  skull: {
    name: "Cráneo",
    color: "#c7b69c",
    subtitle: "BodyParts3D · 19 huesos craneofaciales",
    text: "Mallas anatómicas de la bóveda craneal, base del cráneo y esqueleto facial. Incluyen frontal, parietales, temporales, occipital, esfenoides, etmoides y huesos faciales.",
    detail:
      "Referencia masculina adulta de BodyParts3D 3.0, DBCLS. Se conservan las relaciones espaciales originales. No representa todas las variaciones humanas ni está validada para planificar procedimientos.",
  },
  mandible: {
    name: "Mandíbula",
    color: "#c7b69c",
    subtitle: "Estructura ósea · Arcada inferior",
    text: "Hueso móvil que sostiene la dentición inferior. Su rama y su cuerpo delimitan el trayecto intraóseo del nervio alveolar inferior.",
    detail:
      "El foramen mandibular, en la cara medial de la rama, es la entrada al conducto mandibular. Su localización varía entre personas.",
  },
  maxilla: {
    name: "Maxilar",
    color: "#d5c6b0",
    subtitle: "Estructura ósea · Arcada superior",
    text: "Hueso que sostiene los dientes superiores y participa en la formación del paladar y del piso de la órbita.",
    detail:
      "La anestesia del nervio alveolar inferior no anestesia la dentición superior.",
  },
  teeth: {
    name: "Dientes",
    color: "#e9e5d6",
    subtitle: "BodyParts3D · 28 dientes permanentes",
    text: "Mallas anatómicas individuales de incisivos, caninos, premolares y molares, conservadas en su posición original en el atlas.",
    detail:
      "El conjunto incluye 28 piezas permanentes; no incluye terceros molares. Es una referencia anatómica, no una reproducción de la dentición de cada paciente.",
  },
  syringe: {
    name: "Jeringa odontológica",
    color: "#88aab0",
    subtitle: "Instrumental · Representación virtual",
    text: "Representación virtual de una jeringa tipo carpule: cartucho translúcido, bastidor metálico, émbolo y aguja fina. Proporciones ilustrativas, no calibradas.",
    detail:
      "Los controles permiten explorar su posición y orientación. No se simulan penetración, aspiración, dosis ni interacción con tejidos.",
  },
};
const lessons = [
  {
    title: "Reconoce la anatomía",
    text: "El nervio alveolar inferior es una rama de V3. Identifica la rama mandibular en el atlas. Las curvas de la pestaña Nervios son aproximaciones educativas, no nervios segmentados ni trayectos clínicamente exactos.",
    tip: "Activa el nervio alveolar inferior en la pestaña Nervios y explora su relación conceptual con la mandíbula.",
  },
  {
    title: "Explora las referencias",
    text: "El foramen mandibular se encuentra en la cara medial de la rama. En clínica, el pliegue pterigomandibular y la escotadura coronoidea son referencias relevantes; los tejidos blandos no están incluidos aquí.",
    tip: "Oculta el cráneo y el maxilar; utiliza la vista lateral y la transparencia para explorar la mandíbula.",
  },
  {
    title: "Comprende el bloqueo",
    text: "El objetivo conceptual es depositar el anestésico en proximidad del nervio antes de su entrada al foramen mandibular. Este modelo no define un punto de punción, profundidad ni angulación clínica.",
    tip: "Mueve la jeringa para observar relaciones espaciales. Su posición inicial no es una posición de inyección recomendada.",
  },
  {
    title: "Relaciona el territorio sensitivo",
    text: "El bloqueo puede anestesiar dientes mandibulares del lado tratado, labio inferior y mentón. El nervio bucal suele requerir consideración independiente para los tejidos vestibulares de molares.",
    tip: "El éxito clínico exige evaluación individual, formación supervisada y protocolos de seguridad.",
  },
];
const initialSyringe = { x: 3.8, y: -1.0, z: 3.5, pitch: 0, yaw: -20 };
class Boundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="canvas-error">
        <Info />
        <h3>No se pudo iniciar la vista 3D</h3>
        <p>
          Comprueba que los archivos del modelo estén disponibles y activa WebGL
          o la aceleración gráfica del navegador. Después recarga la página.
        </p>
        <button onClick={() => location.reload()}>Recargar</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
function App() {
  const [visible, setVisible] = useState({
    skull: true,
    mandible: true,
    maxilla: true,
    teeth: true,
    syringe: true,
  });
  const [opacity, setOpacity] = useState(1);
  const [selected, setSelected] = useState("skull");
  const [syringe, setSyringe] = useState(initialSyringe);
  const [tab, setTab] = useState("anatomy");
  const [mode, setMode] = useState("explore");
  const [step, setStep] = useState(0);
  const [view, setView] = useState("perspectiva");
  const [viewKey, setViewKey] = useState(0);
  const [help, setHelp] = useState(false);
  const [focus, setFocus] = useState(false);
  const toggle = (key) => {
    setVisible((v) => ({ ...v, [key]: !v[key] }));
  };
  const reset = () => {
    setView("perspectiva");
    setViewKey((v) => v + 1);
    setSyringe({ ...initialSyringe });
  };
  const neuro = useNeuro({ setSelected, setTab, setOpacity, setVisible });
  const nerveId = selected?.startsWith("neuro-") ? selected.slice(6) : null;
  const item = structures[selected];
  return (
    <div className={`app ${focus ? "focus-mode" : ""}`}>
      <aside className="rail">
        <div className="brand-icon">
          <Activity size={23} />
        </div>
        <button
          className={mode === "explore" ? "active" : ""}
          aria-label="Explorar anatomía"
          title="Explorar anatomía"
          onClick={() => setMode("explore")}
        >
          <Box />
        </button>
        <button
          className={mode === "education" ? "active" : ""}
          aria-label="Modo educativo"
          title="Modo educativo"
          onClick={() => setMode("education")}
        >
          <GraduationCap />
        </button>
        <div className="rail-bottom">
          <button aria-label="Ayuda" onClick={() => setHelp(true)}>
            <CircleHelp />
          </button>
          <span>DA</span>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <a className="wordmark" href="./">
            Dental Anesthesia <b>3D</b>
            <small>LABORATORIO VIRTUAL DE ODONTOLOGÍA</small>
          </a>
          <div className="top-right">
            <span className="status-dot" /> Espacio de aprendizaje{" "}
            <span className="avatar">EO</span>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">APRENDE. EXPLORA. COMPRENDE.</div>
              <h1>
                La anatomía, desde otra perspectiva<span>.</span>
              </h1>
              <p>
                Explora las estructuras que dan sentido a la anestesia
                odontológica.
              </p>
            </div>
            <button
              className={`education-button ${mode === "education" ? "chosen" : ""}`}
              onClick={() =>
                setMode((m) => (m === "explore" ? "education" : "explore"))
              }
            >
              <BookOpen size={17} />
              {mode === "education" ? "Volver a explorar" : "Modo educativo"}
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="workspace">
            <section className="viewer-card">
              <div className="viewer-toolbar">
                <div>
                  <span className="live-dot" />
                  <strong>Explorador anatómico</strong>
                  <span className="badge">3D INTERACTIVO</span>
                </div>
                <button
                  title="Restablecer vista y jeringa"
                  aria-label="Restablecer vista y jeringa"
                  onClick={reset}
                >
                  <RotateCcw size={17} />
                </button>
              </div>
              <div className="canvas-wrap">
                <div className="scene-label">
                  <span>ANATOMÍA DENTAL</span>
                  <strong>
                    {mode === "education"
                      ? "Bloqueo alveolar inferior"
                      : "Atlas craneofacial humano"}
                  </strong>
                  <small>BodyParts3D · Referencia anatómica adulta</small>
                </div>
                {neuro.enabled && (
                  <div className="neuro-scene-notice">
                    {NEURO_NOTICE}
                    {neuro.xray && (
                      <strong> Superposición sin profundidad real.</strong>
                    )}
                  </div>
                )}
                {neuro.enabled && neuro.showTerritory && (
                  <div className="territory-scene-key">
                    <strong>{TECHNIQUES[neuro.technique].name}</strong>
                    <small>
                      {TECHNIQUES[neuro.technique].bilateral
                        ? "Paladar anterior bilateral"
                        : `Lado ${neuro.side === "left" ? "izquierdo" : "derecho"} del paciente`}
                    </small>
                    <span>
                      <i className="pulp-swatch" />
                      Pulpar <i className="soft-swatch" />
                      Tejidos blandos <i className="partial-swatch" />
                      Parcial/variable
                    </span>
                  </div>
                )}
                <ModelLoadingStatus />
                <Boundary>
                  <Suspense
                    fallback={
                      <div className="loading">Preparando la anatomía…</div>
                    }
                  >
                    <Scene
                      visible={visible}
                      boneOpacity={opacity}
                      selected={selected}
                      onSelect={neuro.onSceneSelect}
                      neuro={neuro}
                      syringe={syringe}
                      view={view}
                      viewKey={viewKey}
                    />
                  </Suspense>
                </Boundary>
                <div className="orientation">
                  <span>Y</span>
                  <div>
                    ↗ <b>Z</b> <i>→ X</i>
                  </div>
                </div>
                <div className="scene-actions">
                  <button
                    onClick={() => setFocus((v) => !v)}
                    aria-label={
                      focus ? "Salir de vista ampliada" : "Ampliar visor"
                    }
                    title="Ampliar visor"
                  >
                    <Maximize2 size={17} />
                  </button>
                </div>
                <div className="view-switch">
                  {[
                    ["perspectiva", "Perspectiva"],
                    ["frontal", "Frontal"],
                    ["lateral", "Lateral"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      className={view === key ? "active" : ""}
                      onClick={() => {
                        setView(key);
                        setViewKey((k) => k + 1);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="viewer-footer">
                <span>
                  <Mouse size={15} /> Arrastra para rotar
                </span>
                <span>
                  <Move3D size={15} /> Rueda para acercar
                </span>
                <span className="select-hint">
                  <span className="tiny-yellow" /> Haz clic para explorar
                </span>
              </div>
            </section>
            <aside className="control-card">
              <div className="panel-tabs">
                <button
                  className={tab === "anatomy" ? "active" : ""}
                  onClick={() => setTab("anatomy")}
                >
                  <Layers3 size={16} /> Anatomía
                </button>
                <button
                  className={tab === "nerves" ? "active" : ""}
                  onClick={() => {
                    setTab("nerves");
                    neuro.setEnabled(true);
                  }}
                >
                  Nervios
                </button>
                <button
                  className={tab === "syringe" ? "active" : ""}
                  onClick={() => setTab("syringe")}
                >
                  <Syringe size={16} /> Jeringa
                </button>
              </div>
              {tab === "nerves" ? (
                <NeuroPanel
                  {...neuro}
                  selected={selected}
                  onSelect={neuro.selectNerve}
                />
              ) : tab === "anatomy" ? (
                <div className="control-content">
                  <div className="section-label">
                    ESTRUCTURAS{" "}
                    <span>
                      {Object.values(visible).filter(Boolean).length} visibles
                    </span>
                  </div>
                  <p className="panel-intro">
                    Selecciona una estructura para conocerla.
                  </p>
                  <div className="structure-list">
                    {Object.entries(structures).map(([key, data]) => (
                      <div
                        className={`structure-row ${selected === key ? "selected" : ""}`}
                        key={key}
                      >
                        <button
                          className="structure-name"
                          onClick={() => {
                            setSelected(key);
                            setVisible((v) => ({ ...v, [key]: true }));
                          }}
                        >
                          <span
                            className="structure-dot"
                            style={{ background: data.color }}
                          />
                          {data.name}
                        </button>
                        <button
                          role="switch"
                          aria-checked={visible[key]}
                          aria-label={`Mostrar ${data.name}`}
                          className={`toggle ${visible[key] ? "on" : ""}`}
                          onClick={() => toggle(key)}
                        >
                          <span />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="opacity-section">
                    <div>
                      <label htmlFor="bone-opacity">Transparencia ósea</label>
                      <span>{Math.round((1 - opacity) * 100)}%</span>
                    </div>
                    <input
                      id="bone-opacity"
                      type="range"
                      min="0.12"
                      max="1"
                      step=".01"
                      value={opacity}
                      onChange={(e) => setOpacity(+e.target.value)}
                    />
                    <div className="range-labels">
                      <span>Transparente</span>
                      <span>Sólido</span>
                    </div>
                  </div>
                  <div className="hint-box">
                    <Eye size={17} />
                    <p>
                      Explora huesos y raíces con transparencia. La pestaña
                      Nervios muestra esquemas y territorios educativos.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="control-content syringe-controls">
                  <div className="section-label">
                    JERINGA VIRTUAL
                    <button
                      className="text-button"
                      onClick={() => setSyringe({ ...initialSyringe })}
                    >
                      Restablecer
                    </button>
                  </div>
                  <p className="panel-intro">
                    Explora su posición y orientación en el espacio.
                  </p>
                  {[
                    ["x", "Posición X", -5, 5, 0.1, ""],
                    ["y", "Altura Y", -4, 4, 0.1, ""],
                    ["z", "Profundidad Z", -4, 5, 0.1, ""],
                    ["pitch", "Inclinación", -90, 90, 1, "°"],
                    ["yaw", "Rotación", -180, 180, 1, "°"],
                  ].map(([key, label, min, max, delta, unit]) => (
                    <div className="syringe-range" key={key}>
                      <label htmlFor={key}>
                        {label}
                        <span aria-hidden="true">
                          {syringe[key].toFixed(unit ? 0 : 1)}
                          {unit}
                        </span>
                      </label>
                      <input
                        id={key}
                        aria-label={label}
                        type="range"
                        min={min}
                        max={max}
                        step={delta}
                        value={syringe[key]}
                        onChange={(e) => {
                          setVisible((v) => ({ ...v, syringe: true }));
                          setSyringe((s) => ({ ...s, [key]: +e.target.value }));
                        }}
                      />
                    </div>
                  ))}
                  <div className="hint-box">
                    <Info size={17} />
                    <p>
                      Movimiento libre de exploración. Sin simulación de punción
                      ni validación de técnica.
                    </p>
                  </div>
                </div>
              )}
              <div className="selection-detail">
                <div className="section-label">
                  <span className="tiny-yellow" /> ESTRUCTURA SELECCIONADA
                </div>
                {nerveId && NERVES[nerveId] ? (
                  <NerveDetails
                    id={nerveId}
                    onTechnique={neuro.onChooseTechnique}
                    disabled={neuro.quiz.active}
                  />
                ) : item ? (
                  <>
                    <h2>{item.name}</h2>
                    <span className="detail-subtitle">{item.subtitle}</span>
                    <p>{item.text}</p>
                    <details key={selected}>
                      <summary>
                        Más información <ChevronRight size={14} />
                      </summary>
                      <p>{item.detail}</p>
                    </details>
                  </>
                ) : (
                  <p>
                    Selecciona una estructura en el modelo o en la lista para
                    explorar su anatomía.
                  </p>
                )}
              </div>
            </aside>
          </div>
          {neuro.visited && <NeuroLearning {...neuro} />}
          {mode === "education" ? (
            <section className="lesson-card">
              <div className="lesson-heading">
                <div className="lesson-icon">
                  <GraduationCap />
                </div>
                <div>
                  <span className="eyebrow">
                    RECORRIDO EDUCATIVO · {step + 1} DE 4
                  </span>
                  <h2>Bloqueo del nervio alveolar inferior</h2>
                </div>
                <button
                  className="icon-button"
                  aria-label="Cerrar modo educativo"
                  onClick={() => setMode("explore")}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="lesson-steps">
                {lessons.map((l, i) => (
                  <button
                    className={step === i ? "active" : ""}
                    key={l.title}
                    onClick={() => setStep(i)}
                  >
                    <span>{i < step ? <Check size={13} /> : i + 1}</span>
                    {l.title}
                  </button>
                ))}
              </div>
              <h3>{lessons[step].title}</h3>
              <p>{lessons[step].text}</p>
              <div className="lesson-bottom">
                <span>
                  <Info size={16} />
                  {lessons[step].tip}
                </span>
                <button
                  onClick={() => {
                    setStep((s) => (s + 1) % 4);
                    neuro.selectNerve("ian");
                  }}
                >
                  {step === 3 ? "Reiniciar recorrido" : "Siguiente"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>
          ) : (
            <section className="learn-banner">
              <div className="lesson-icon">
                <GraduationCap size={24} />
              </div>
              <div>
                <span className="eyebrow">DEL MODELO AL CONOCIMIENTO</span>
                <h2>Comprende el bloqueo alveolar inferior</h2>
                <p>
                  Un recorrido guiado por la anatomía y los fundamentos de esta
                  técnica.
                </p>
              </div>
              <button
                onClick={() => {
                  setMode("education");
                  setStep(0);
                }}
              >
                Iniciar recorrido <ArrowRight size={16} />
              </button>
              <div className="banner-decoration">+</div>
            </section>
          )}
          <div className="educational-notice">
            SIMULADOR EXCLUSIVAMENTE EDUCATIVO. LOS CASOS SIN FICTICIOS Y NO
            SUSTITYEN LA VALORACIÓN CLÍNICA PROFESIONAL
          </div>
          <div className="model-credits">
            <strong>Modelo anatómico: BodyParts3D 3.0</strong> · © Database
            Center for Life Science (DBCLS) ·{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/2.1/jp/"
              target="_blank"
              rel="noreferrer"
            >
              CC BY-SA 2.1 Japan
            </a>
            <span>
              Conversión STL → GLB y normales suavizadas. 50 mallas · 28
              dientes, sin terceros molares. Los nervios y tejidos blandos son
              esquemas educativos originales, no mallas de DBCLS.{" "}
              <a
                href={`${import.meta.env.BASE_URL}models/bodyparts3d/ATTRIBUTION.md`}
                target="_blank"
                rel="noreferrer"
              >
                Procedencia y adaptaciones
              </a>
            </span>
          </div>
          <footer className="page-footer">
            <span>
              <Info size={14} /> Referencia anatómica educativa. No sustituye la
              formación clínica supervisada ni sirve para planificar
              tratamientos.
            </span>
            <span>
              DENTAL ANESTHESIA 3D <b>·</b> v1.0
            </span>
          </footer>
        </main>
      </div>
      {help && (
        <div className="modal-backdrop" onClick={() => setHelp(false)}>
          <section
            className="help-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Ayuda del simulador"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              aria-label="Cerrar ayuda"
              onClick={() => setHelp(false)}
            >
              <X />
            </button>
            <div className="lesson-icon">
              <Rotate3D />
            </div>
            <h2>Tu laboratorio de anatomía</h2>
            <p>
              Arrastra el modelo con el botón izquierdo para rotarlo. Usa la
              rueda para acercar y alejar, y el botón derecho para desplazar la
              vista.
            </p>
            <p>
              Selecciona un hueso o un diente en la escena o desde la lista. El
              módulo Nervios añade esquemas aproximados y mapas de territorios,
              diferenciados de las mallas óseas del atlas. Los interruptores
              controlan la visibilidad; el deslizador permite ver a través del
              hueso.
            </p>
            <p>
              La pestaña Jeringa ofrece cinco controles de movimiento. Las
              vistas y el botón de restablecer ayudan a recuperar la
              orientación.
            </p>
            <strong>
              Atlas anatómico de referencia, no validado para procedimientos. No
              representa una técnica de inyección clínicamente segura.
            </strong>
            <button className="primary-button" onClick={() => setHelp(false)}>
              Comenzar a explorar <ArrowRight size={16} />
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
