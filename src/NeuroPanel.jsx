import React from "react";
import {
  NERVES,
  TECHNIQUES,
  SOFT_NAMES,
  territoryTeeth,
  TERRITORY_COLORS,
  QUIZ_ORDER,
  NEURO_NOTICE,
} from "./neuroData";

export function NeuroPanel({
  enabled,
  setEnabled,
  visibleNerves,
  setVisibleNerves,
  selected,
  onSelect,
  side,
  setSide,
  xray,
  setXray,
  quiz,
  onReveal,
}) {
  return (
    <div className="control-content neuro-panel">
      <div className="section-label">
        RAMAS ODONTOLÓGICAS{" "}
        <button
          className="text-button"
          disabled={quiz.active}
          onClick={() => setEnabled(!enabled)}
        >
          {enabled ? "Ocultar módulo 3D" : "Mostrar módulo 3D"}
        </button>
      </div>
      <p className="neuro-warning">
        Esquemas educativos. No son nervios segmentados ni trayectos clínicos
        exactos.
      </p>
      <label className="neuro-select-label" htmlFor="neuro-side">
        Lado del paciente
      </label>
      <select
        id="neuro-side"
        value={side}
        onChange={(e) => setSide(e.target.value)}
      >
        <option value="left">Izquierdo del paciente</option>
        <option value="right">Derecho del paciente</option>
      </select>
      <label className="neuro-check">
        <input
          type="checkbox"
          checked={xray}
          onChange={(e) => setXray(e.target.checked)}
        />
        Superponer nervios y territorios
      </label>
      <p className="microcopy">
        {xray
          ? "Se ignora la oclusión ósea; en el visor se seleccionan solo nervios. No indica profundidad real."
          : "Usa la pestaña Anatomía para ocultar el cráneo o ajustar su transparencia."}
      </p>
      {quiz.active ? (
        <div className="quiz-list-hidden">
          Identifica la rama directamente en el modelo. La lista se oculta
          durante la actividad.
        </div>
      ) : (
        <>
          <div className="neuro-list">
            {["V3", "V2"].map((division) => (
              <div key={division}>
                <div className="neuro-division">
                  {division === "V3" ? "V3 · Mandibular" : "V2 · Maxilar"}
                </div>
                {Object.entries(NERVES)
                  .filter(([, n]) => n.division === division)
                  .map(([id, n]) => (
                    <div
                      key={id}
                      className={`structure-row ${selected === `neuro-${id}` ? "selected" : ""}`}
                    >
                      <button
                        className="structure-name"
                        onClick={() => onSelect(id)}
                      >
                        <span
                          className="structure-dot"
                          style={{ background: n.color }}
                        />
                        {n.name}
                      </button>
                      <button
                        role="switch"
                        aria-label={`Mostrar nervio ${n.name}`}
                        aria-checked={enabled && visibleNerves[id]}
                        className={`toggle ${enabled && visibleNerves[id] ? "on" : ""}`}
                        onClick={() => {
                          setEnabled(true);
                          setVisibleNerves((v) => ({
                            ...v,
                            [id]: !(enabled && v[id]),
                          }));
                        }}
                      >
                        <span />
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <div className="neuro-list-actions">
            <button
              onClick={() => {
                setEnabled(true);
                setVisibleNerves(
                  Object.fromEntries(
                    Object.keys(NERVES).map((id) => [id, true]),
                  ),
                );
              }}
            >
              Mostrar todos
            </button>
            <button
              onClick={() =>
                setVisibleNerves(
                  Object.fromEntries(
                    Object.keys(NERVES).map((id) => [id, false]),
                  ),
                )
              }
            >
              Ocultar todos
            </button>
          </div>
        </>
      )}
      <button className="neuro-reveal" onClick={onReveal}>
        Ver a través del hueso
      </button>
      <p className="microcopy">{NEURO_NOTICE}</p>
    </div>
  );
}
export function NerveDetails({ id, onTechnique, disabled }) {
  const nerve = NERVES[id];
  return (
    <>
      <h2>{nerve.name}</h2>
      <span className="detail-subtitle">
        {nerve.division} · Trayecto esquemático aproximado
      </span>
      <dl className="nerve-facts">
        <dt>Origen</dt>
        <dd>{nerve.origin}</dd>
        <dt>Territorio de inervación</dt>
        <dd>{nerve.territory}</dd>
        <dt>Órganos dentarios relacionados</dt>
        <dd>{nerve.teeth}</dd>
        <dt>Técnicas relacionadas</dt>
        <dd>
          {nerve.techniques.map((t) => (
            <button
              key={t}
              className="nerve-technique-link"
              disabled={disabled}
              onClick={() => onTechnique(t)}
            >
              {TECHNIQUES[t].name}
            </button>
          ))}
        </dd>
      </dl>
      <details>
        <summary>Límites y variaciones</summary>
        <p>{nerve.notes}</p>
      </details>
    </>
  );
}
export function NeuroLearning({
  side,
  technique,
  setTechnique,
  showTerritory,
  setShowTerritory,
  showPulp,
  setShowPulp,
  showSoft,
  setShowSoft,
  onTechniqueNerves,
  quiz,
  onStart,
  onNext,
  onEnd,
}) {
  const t = TECHNIQUES[technique],
    teeth = territoryTeeth(technique, side),
    target = NERVES[QUIZ_ORDER[quiz.round]];
  return (
    <section className="neuro-learning">
      <div className="territory-card">
        <div className="eyebrow">RELACIÓN NERVIO · DIENTE · TÉCNICA</div>
        <h2>Territorios anestésicos</h2>
        <p className="module-intro">
          Mapa conceptual de cobertura esperada, no predicción del éxito
          clínico.
        </p>
        <label className="neuro-select-label" htmlFor="technique">
          Técnica anestésica
        </label>
        <select
          id="technique"
          value={technique}
          onChange={(e) => setTechnique(e.target.value)}
        >
          {Object.entries(TECHNIQUES).map(([id, t]) => (
            <option value={id} key={id}>
              {t.name}
            </option>
          ))}
        </select>
        <p className="microcopy">
          {t.bilateral
            ? "Paladar anterior bilateral. El selector de lado no limita este mapa."
            : `Lado ${side === "left" ? "izquierdo" : "derecho"} del paciente. Numeración dentaria FDI.`}
        </p>
        <label className="territory-enable">
          <input
            type="checkbox"
            checked={showTerritory}
            onChange={(e) => setShowTerritory(e.target.checked)}
          />
          Visualizar territorio anestésico
        </label>
        <div className="territory-legend">
          <label>
            <input
              type="checkbox"
              checked={showPulp}
              onChange={(e) => setShowPulp(e.target.checked)}
            />
            <i style={{ background: TERRITORY_COLORS.pulp }} />
            Relación pulpar
          </label>
          <label>
            <input
              type="checkbox"
              checked={showSoft}
              onChange={(e) => setShowSoft(e.target.checked)}
            />
            <i style={{ background: TERRITORY_COLORS.soft }} />
            Tejidos blandos
          </label>
          <span>
            <i style={{ background: TERRITORY_COLORS.partial }} />
            Cobertura pulpar parcial o variable
          </span>
        </div>
        <dl className="territory-facts">
          <dt>Pulpa dental</dt>
          <dd>
            {teeth.pulp.length
              ? `Dientes FDI: ${teeth.pulp.join(", ")}.`
              : "Sin anestesia pulpar esperada para esta técnica."}
            {teeth.partial.length > 0 &&
              ` Cobertura parcial/variable: ${teeth.partial.join(", ")}.`}
          </dd>
          <dt>Tejidos blandos (superficies esquemáticas)</dt>
          <dd>{t.soft.map((s) => SOFT_NAMES[s]).join("; ")}.</dd>
        </dl>
        <div className="territory-note">{t.note}</div>
        <p className="microcopy">
          Los dientes se colorean completos para indicar relación pulpar; no se
          representa una pulpa segmentada. Las zonas rosas son mapas de tejidos
          blandos aproximados, no tejidos escaneados.
        </p>
        <button
          className="outline-action"
          disabled={quiz.active}
          onClick={onTechniqueNerves}
        >
          Mostrar nervios de esta técnica
        </button>
      </div>
      <div className="quiz-card">
        <div className="eyebrow">ACTIVIDAD DE IDENTIFICACIÓN</div>
        <h2>Encuentra el nervio</h2>
        <p className="module-intro">
          Selecciona los trayectos sobre el modelo 3D. Sin puntos ni técnicas de
          punción.
        </p>
        {!quiz.active ? (
          <>
            <div className="quiz-illustration">
              V2 <span>·</span> V3
            </div>
            <p>
              5 preguntas · Retroalimentación inmediata. Puedes rotar y acercar
              el modelo.
            </p>
            <button className="primary-button" onClick={onStart}>
              Iniciar actividad
            </button>
          </>
        ) : (
          <>
            <div className="quiz-progress">
              Pregunta {quiz.round + 1} de {QUIZ_ORDER.length} · {quiz.correct}{" "}
              aciertos · {quiz.attempts} intentos
            </div>
            <h3>Identifica: {target.name}</h3>
            <p className="microcopy">
              Haz clic en su línea coloreada dentro del visor. Los nombres de la
              lista permanecen ocultos.
            </p>
            <div
              className={`quiz-feedback ${quiz.last?.correct ? "correct" : ""}`}
              role="status"
            >
              {quiz.last
                ? quiz.last.correct
                  ? `Correcto. ${target.origin}`
                  : `Has seleccionado ${NERVES[quiz.last.id].name}. Inténtalo otra vez; observa el origen y el territorio.`
                : "Esperando tu selección en el modelo…"}
            </div>
            {quiz.answered && (
              <button className="primary-button" onClick={onNext}>
                {quiz.round === QUIZ_ORDER.length - 1
                  ? "Ver resultado"
                  : "Siguiente nervio"}
              </button>
            )}
            <button className="text-button quiz-end" onClick={onEnd}>
              Finalizar actividad
            </button>
          </>
        )}
        {quiz.finished && (
          <div className="quiz-result" role="status">
            Actividad completada: {quiz.correct} de {QUIZ_ORDER.length} nervios
            identificados en {quiz.attempts} intentos. Los aciertos cuentan una
            vez por pregunta.
          </div>
        )}
        <p className="microcopy">
          Los esquemas permiten relacionar estructuras; no evalúan competencia
          clínica.
        </p>
        <details className="neuro-sources">
          <summary>Referencias y procedencia</summary>
          <p>
            Base conceptual: Malamed, <em>Handbook of Local Anesthesia</em>, 7.ª
            ed.; Standring, <em>Gray’s Anatomy</em>, 42.ª ed. Las curvas y
            superficies son dibujos originales aproximados, no geometrías
            obtenidas de esos libros.
          </p>
          <a
            href={`${import.meta.env.BASE_URL}neuro-references.md`}
            target="_blank"
            rel="noreferrer"
          >
            Consultar alcance, fuentes y licencias
          </a>
        </details>
      </div>
    </section>
  );
}
