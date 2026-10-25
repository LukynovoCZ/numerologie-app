import { useState } from "react";
import { parseDate } from "../engine";
import { triangleCycles } from "../engine/vibrations";
import { Interpretation } from "./Interpretation";
export function TrianglePeriods({
  birth,
  analysis,
  masters,
}: {
  birth: string;
  analysis: string;
  masters: boolean;
}) {
  const cycles = triangleCycles(parseDate(birth), parseDate(analysis), masters);
  const [index, setIndex] = useState(Math.max(0, cycles.activeIndex));
  const [yearIndex, setYearIndex] = useState<number | null>(null);
  const selected = cycles.periods[index];
  const annual =
    selected.years.find((y) => y.year === yearIndex) ??
    selected.years.find((y) => y.active) ??
    selected.years[0];
  return (
    <section className="panel triangle-periods">
      <span className="eyebrow">ČTYŘI ŽIVOTNÍ OBDOBÍ</span>
      <h2>Trojúhelníky devítiletých cyklů</h2>
      <p>
        První období začíná ve věku 36 − {cycles.baseLifePath} ={" "}
        <strong>{cycles.firstAge} let</strong>. První tři období mají devět let;
        čtvrtá vibrace pokračuje dál. Přechody nastávají na narozeniny a jejich
        ORV je 9.
      </p>
      {cycles.beforeFirst ? (
        <p className="cycle-status" role="status">
          K {analysis} ještě nezačalo první období. Začne{" "}
          {cycles.periods[0].from}; do té doby můžete sledovat osobní roční
          vibrace výše.
        </p>
      ) : (
        <p className="cycle-status" role="status">
          K {analysis} je aktivní {cycles.activeIndex + 1}. období · řídicí
          vibrace <strong>{cycles.periods[cycles.activeIndex].value}</strong>.
        </p>
      )}
      <div className="triangle-period-buttons">
        {cycles.periods.map((p, i) => (
          <button
            key={p.index}
            aria-pressed={index === i}
            onClick={() => {
              setIndex(i);
              setYearIndex(null);
            }}
            aria-label={`${p.index}. období, vibrace ${p.value}`}
          >
            <small>
              {p.index}. období {p.active ? "· aktuální" : ""}
            </small>
            <strong>{p.value}</strong>
            <span>
              {p.startAge}–{p.endAge ?? "∞"} let
            </span>
            <span>
              {p.from} – {p.until ?? "dále"}
            </span>
          </button>
        ))}
      </div>
      <h3>
        {selected.index}. období · vibrace {selected.value}
      </h3>
      <p>
        Od {selected.from}
        {selected.until
          ? ` do ${selected.until} (konec se nezahrnuje)`
          : " dále, bez dalšího přepočítávání řídicí vibrace"}
        . Kontrola ORV na začátku: <strong>{selected.startORV}</strong>.
      </p>
      <Interpretation id={selected.interpretationId} />
      <h3>Roční vibrace uvnitř období</h3>
      <p>
        Pořadí od vstupu je 9 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. U čtvrtého období
        se tato roční řada dále opakuje; tabulka ukazuje devítiletý úsek
        obsahující datum rozboru, případně první úsek, pokud období teprve
        nastane.
      </p>
      <div className="annual-table-wrap">
        <table className="cycle-years-table">
          <caption>{selected.index}. období – roční vibrace</caption>
          <thead>
            <tr>
              <th scope="col">ORV</th>
              <th scope="col">Od narozenin</th>
              <th scope="col">Do narozenin</th>
            </tr>
          </thead>
          <tbody>
            {selected.years.map((y) => (
              <tr key={y.year} className={y.active ? "active-period" : ""}>
                <th scope="row">
                  <button
                    onClick={() => setYearIndex(y.year)}
                    aria-pressed={annual?.year === y.year}
                    aria-label={`Souběh cyklu ${selected.value} a ORV ${y.value}`}
                  >
                    {y.value}
                    {y.active ? " · aktuální" : ""}
                  </button>
                </th>
                <td>{y.from}</td>
                <td>{y.until}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {annual && (
        <div className="combined-reading" aria-live="polite">
          <span className="eyebrow">
            SOUBĚH DLOUHODOBÉHO TÉMATU A OSOBNÍHO ROKU
          </span>
          <p>
            {annual.from} – {annual.until}
          </p>
          <Interpretation
            id={`nineCycle:${selected.value}:year:${annual.value}`}
          />
        </div>
      )}
      <p className="muted">
        Metoda:{" "}
        <a
          href="https://numerologie.najdise.cz/karmicke-trojuhelniky-devitiletych-vibracnich-cyklu"
          target="_blank"
          rel="noreferrer"
        >
          Najdise.cz – karmické trojúhelníky
        </a>
        . Výklady jsou vlastní redakční shrnutí témat zdroje, bez předpovědí
        událostí. Pro věkové hranice používáme jednociferný základ životního
        čísla; nemění je přepínač 11/22/33 v hlavním rozboru.
      </p>
    </section>
  );
}
