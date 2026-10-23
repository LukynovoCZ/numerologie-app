import { useState } from "react";
import { calculate } from "../engine";
import { vibrationTriangle } from "../engine/vibrations";
import examples from "../data/checks.cs.json";
import type { Input } from "../types";
export function Checks({
  result,
  onExample,
}: {
  result: ReturnType<typeof calculate>;
  onExample: (value: Input) => void;
}) {
  const [ran, setRan] = useState(false);
  const base: Input = {
    birth: "14.09.1990",
    analysis: "23.10.2026",
    year: 2026,
    masters: true,
    method: "raw_digit_sum",
    cycle: "calendar",
    yVowel: true,
    time: "",
    name: "",
  };
  const reports = examples.map((e) => {
    const r = calculate({
        ...base,
        birth: e.birth,
        analysis: e.analysis,
        year: e.year,
      }),
      t = vibrationTriangle(r.birth);
    const actual = {
      life: r.life.value,
      base: r.life.baseValue,
      annual: r.personal.year,
      month: r.personal.month,
      day: r.personal.day,
      counts: Object.values(r.counts).join(","),
      triangle: [
        t.month,
        t.day,
        t.year,
        t.left.value,
        t.right.value,
        t.peak.value,
        t.outer.value,
      ].join(","),
    };
    return {
      example: e,
      actual,
      pass: JSON.stringify(actual) === JSON.stringify(e.expected),
    };
  });
  return (
    <section className="panel checks-panel">
      <span className="eyebrow">TESTOVACÍ STRÁNKA</span>
      <h2>Kontrola výpočtů</h2>
      <p>
        Zvolte kontrolní datum, upravte vstupy vlevo a obnovte rozbor. Níže
        uvidíte výsledky i surová data pro vlastní porovnání. Kontrolní příklady
        mají pevné očekávané hodnoty; nejsou srovnáním s online kalkulačkou
        Najdise.cz.
      </p>
      <div className="example-buttons">
        {examples.map((e) => (
          <button
            key={e.id}
            onClick={() =>
              onExample({
                ...base,
                birth: e.birth,
                analysis: e.analysis,
                year: e.year,
              })
            }
          >
            {e.title}
          </button>
        ))}
      </div>
      <button className="primary" onClick={() => setRan(true)}>
        Spustit kontrolní příklady
      </button>
      {ran && (
        <div role="status">
          <p>
            <strong>
              {reports.filter((r) => r.pass).length} / {reports.length} příkladů
              odpovídá očekávání
            </strong>
          </p>
          {reports.map((r) => (
            <details key={r.example.id}>
              <summary>
                {r.pass ? "✓ Shoda" : "✕ Neshoda"} · {r.example.title}
              </summary>
              <div className="annual-table-wrap">
                <table className="annual-table">
                  <thead>
                    <tr>
                      <th>Výpočet</th>
                      <th>Očekáváno</th>
                      <th>Skutečnost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(r.actual).map(([key, value]) => (
                      <tr key={key}>
                        <th>
                          {
                            (
                              {
                                life: "Životní číslo",
                                base: "Základ",
                                annual: "Kalendářní osobní rok",
                                month: "Osobní měsíc",
                                day: "Osobní den",
                                counts: "Počty číslic 1–9",
                                triangle:
                                  "Uzly: měsíc, den, rok, levý, pravý, vrchol, vnější",
                              } as Record<string, string>
                            )[key]
                          }
                        </th>
                        <td>
                          {String(
                            r.example.expected[
                              key as keyof typeof r.example.expected
                            ],
                          )}
                        </td>
                        <td>{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      )}
      <h3>Aktuálně zobrazený rozbor</h3>
      <p>
        {result.input.birth} · k {result.input.analysis} · metoda{" "}
        {result.method.life}
      </p>
      <div className="facts">
        <span>
          Životní číslo<b>{result.life.steps.join(" → ")}</b>
        </span>
        <span>
          Osobní rok / měsíc / den
          <b>
            {result.personal.year} / {result.personal.month} /{" "}
            {result.personal.day}
          </b>
        </span>
      </div>
      <p>
        Počty číslic 1–9: {Object.values(result.counts).join(", ")}. Neplatné
        datum ověříte například zadáním 31.04.2020; aplikace má zobrazit chybu a
        ponechat poslední platný rozbor.
      </p>
      <details>
        <summary>Surová data aktuálního výpočtu (JSON)</summary>
        <pre className="raw-data">{JSON.stringify(result, null, 2)}</pre>
      </details>
    </section>
  );
}
