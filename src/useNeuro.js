import { useState } from "react";
import { NERVES, TECHNIQUES, QUIZ_ORDER } from "./neuroData";
const blankQuiz = () => ({
  active: false,
  round: 0,
  attempts: 0,
  correct: 0,
  answered: false,
  last: null,
  finished: false,
});
export function useNeuro({ setSelected, setTab, setOpacity, setVisible }) {
  const [enabled, setEnabled] = useState(false),
    [visited, setVisited] = useState(false);
  const [visibleNerves, setVisibleNerves] = useState(
    Object.fromEntries(
      Object.keys(NERVES).map((id) => [
        id,
        ["ian", "mental", "lingual", "buccal"].includes(id),
      ]),
    ),
  );
  const [side, setSide] = useState("left"),
    [xray, setXray] = useState(false),
    [technique, setTechnique] = useState("ian"),
    [showTerritory, setShowTerritory] = useState(false),
    [showPulp, setShowPulp] = useState(true),
    [showSoft, setShowSoft] = useState(true),
    [quiz, setQuiz] = useState(blankQuiz);
  const enable = (v) => {
    setEnabled(v);
    setVisited(true);
  };
  const onSceneSelect = (key) => {
    if (quiz.active && !key?.startsWith("neuro-")) return;
    setSelected(key);
    if (quiz.active && key?.startsWith("neuro-")) {
      const id = key.slice(6);
      setQuiz((q) => {
        if (!q.active || q.answered) return q;
        const correct = id === QUIZ_ORDER[q.round];
        return {
          ...q,
          attempts: q.attempts + 1,
          correct: q.correct + (correct ? 1 : 0),
          answered: correct,
          last: { id, correct },
        };
      });
    }
  };
  const selectNerve = (id) => {
    enable(true);
    setVisibleNerves((v) => ({ ...v, [id]: true }));
    setSelected(`neuro-${id}`);
  };
  const onReveal = () => {
    enable(true);
    setOpacity(0.22);
    setVisible((v) => ({ ...v, skull: false }));
    setXray(true);
  };
  const onTechniqueNerves = () => {
    enable(true);
    setVisibleNerves(
      Object.fromEntries(
        Object.keys(NERVES).map((id) => [
          id,
          TECHNIQUES[technique].nerves.includes(id),
        ]),
      ),
    );
    setTab("nerves");
  };
  const onStart = () => {
    enable(true);
    setTab("nerves");
    setXray(true);
    setShowTerritory(false);
    setSelected(null);
    setVisibleNerves(
      Object.fromEntries(Object.keys(NERVES).map((id) => [id, true])),
    );
    setQuiz({ ...blankQuiz(), active: true });
  };
  const onNext = () =>
    setQuiz((q) =>
      !q.active || !q.answered
        ? q
        : q.round === QUIZ_ORDER.length - 1
          ? { ...q, active: false, finished: true }
          : { ...q, round: q.round + 1, last: null, answered: false },
    );
  const onEnd = () => setQuiz((q) => ({ ...q, active: false }));
  return {
    enabled,
    setEnabled: enable,
    visited,
    visibleNerves,
    setVisibleNerves,
    side,
    setSide,
    xray,
    setXray,
    technique,
    setTechnique,
    showTerritory,
    setShowTerritory: (v) => {
      enable(true);
      setShowTerritory(v);
    },
    showPulp,
    setShowPulp,
    showSoft,
    setShowSoft,
    quiz,
    selectNerve,
    onSceneSelect,
    onReveal,
    onTechniqueNerves,
    onChooseTechnique: (id) => {
      if (quiz.active) return;
      setTechnique(id);
      setShowTerritory(true);
      enable(true);
      setVisibleNerves(
        Object.fromEntries(
          Object.keys(NERVES).map((n) => [
            n,
            TECHNIQUES[id].nerves.includes(n),
          ]),
        ),
      );
    },
    onStart,
    onNext,
    onEnd,
  };
}
