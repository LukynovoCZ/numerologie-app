import { useState } from "react";
import { parseDate } from "../engine";
import { annualVibrations, vibrationTriangle } from "../engine/vibrations";
import { TrianglePeriods } from "./TrianglePeriods";
import { Interpretation } from "./Interpretation";
export function Vibrations({
  birth,
  analysis,
  masters,
  onMastersChange,
}: {
  birth: string;
  analysis: string;
  masters: boolean;
  onMastersChange: (value: boolean) => void;
}) {
  const b = parseDate(birth),
    a = parseDate(analysis),
    annual = annualVibrations(b, a);
  const [chosen, setChosen] = useState<number | null>(null);
  const t = vibrationTriangle(b, masters);
  return (
    <>
      <section className="panel annual-panel">
        <span className="eyebrow">OD NAROZENIN DO NAROZENIN</span>
        <h2>Osobní roční vibrace</h2>
        <div className="annual-current">
          <strong>{annual.current.value}</strong>
          <div>
            <h3>Aktivní vibrace k {analysis}</h3>
            <p>
              Od {annual.current.from} do {annual.current.until} (konec se
              nezahrnuje).
            </p>
          </div>
        </div>
        <p>
          Tato část vždy používá narozeninovou konvenci, nezávisle na
          kalendářním přehledu. U 29. února připadá výročí v nepřestupných
          letech na 28. února.
        </p>
        <h3>Čtyři čtvrtiny aktuální ORV</h3>
        <p>
          Čtvrtiny začínají na narozeniny a po 3, 6 a 9 kalendářních měsících.
          Jde o symbolické kalendářní členění, nikoli o vypočtené fáze Měsíce
          nebo předpověď energie či událostí.
        </p>
        <div className="quarter-cards">
          {annual.quarters.map((q) => (
            <div key={q.index} className={q.active ? "active-quarter" : ""}>
              <strong>
                {q.index}. čtvrtina {q.active ? "· aktuální" : ""}
              </strong>
              <p>
                {q.from} – {q.until}
              </p>
            </div>
          ))}
        </div>
        <h3>Devítiletá řada 1–9</h3>
        <p>
          {annual.cycleFrom} – {annual.cycleUntil}. Vyberte rok pro jeho
          symbolický výklad. Tato řada od ORV 1 je samostatný pohled;
          trojúhelníková období níže začínají ORV 9.
        </p>
        <div className="annual-table-wrap">
          <table className="annual-table">
            <caption>Osobní roční vibrace v aktuální devítileté řadě</caption>
            <thead>
              <tr>
                <th scope="col">Vibrace</th>
                <th scope="col">Od narozenin</th>
                <th scope="col">Do dalších narozenin</th>
              </tr>
            </thead>
            <tbody>
              {annual.periods.map((p) => (
                <tr key={p.year} className={p.active ? "active-period" : ""}>
                  <th scope="row">
                    <button
                      onClick={() => setChosen(p.value)}
                      aria-label={`Výklad roční vibrace ${p.value}`}
                    >
                      {p.value}
                      {p.active ? " · aktuální" : ""}
                    </button>
                  </th>
                  <td>{p.from}</td>
                  <td>{p.until}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Interpretation id={`year:${chosen ?? annual.current.value}`} />
      </section>
      <TrianglePeriods birth={birth} analysis={analysis} masters={masters} />
      <section className="panel triangle-panel">
        <span className="eyebrow">SCHÉMA Z DATA NAROZENÍ</span>
        <h2>Vibrační trojúhelník</h2>
        <p>
          Interaktivní schéma součtů pro {birth}. Pro referenční obrázek
          24.07.1939 vychází základna 7–6–4, vnitřní uzly 4–1–5 a vnější uzel
          11.
        </p>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={masters}
            onChange={(e) => onMastersChange(e.target.checked)}
          />
          Zachovat 11 ve třetím a čtvrtém vrcholu (podle zdroje)
        </label>
        <svg
          className="vibration-triangle"
          viewBox="0 0 440 390"
          role="img"
          aria-labelledby="triangle-title"
          aria-describedby="triangle-desc"
        >
          <title id="triangle-title">Vibrační trojúhelník pro {birth}</title>
          <desc id="triangle-desc">
            Měsíc {t.month}, den {t.day}, rok {t.year}. Levý uzel {t.left.value}
            , pravý {t.right.value}, vrchol {t.peak.value}, vnější uzel{" "}
            {t.outer.value}.
          </desc>
          <g fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M65 300 L220 40 L375 300 Z M65 300 L220 300 L142 170 M220 300 L298 170 M142 170 L298 170" />
            <path
              d="M30 300 Q-10 60 220 5 Q450 60 410 300"
              strokeDasharray="5 6"
            />
          </g>
          {[
            { x: 65, y: 300, value: t.month, label: "Měsíc" },
            { x: 220, y: 300, value: t.day, label: "Den" },
            { x: 375, y: 300, value: t.year, label: "Rok" },
            { x: 142, y: 170, value: t.left.value, label: "Měsíc + den" },
            { x: 298, y: 170, value: t.right.value, label: "Den + rok" },
            { x: 220, y: 40, value: t.peak.value, label: "Součet uzlů" },
          ].map((n) => (
            <g key={n.label}>
              <circle cx={n.x} cy={n.y} r="23" />
              <text
                x={n.x}
                y={n.y + 7}
                textAnchor="middle"
                className="triangle-number"
              >
                {n.value}
              </text>
              <text
                x={n.x}
                y={n.y + 43}
                textAnchor="middle"
                className="triangle-label"
              >
                {n.label}
              </text>
            </g>
          ))}
          <text x="370" y="45" className="triangle-number">
            {t.outer.value}
          </text>
          <text x="310" y="67" className="triangle-label">
            Měsíc + rok
          </text>
        </svg>
        <div className="facts">
          <span>
            Levý uzel
            <b>
              {t.month} + {t.day} → {t.left.steps.join(" → ")}
            </b>
          </span>
          <span>
            Pravý uzel
            <b>
              {t.day} + {t.year} → {t.right.steps.join(" → ")}
            </b>
          </span>
          <span>
            Vrchol
            <b>
              {t.left.value} + {t.right.value} → {t.peak.steps.join(" → ")}
            </b>
          </span>
          <span>
            Vnější uzel
            <b>
              {t.month} + {t.year} → {t.outer.steps.join(" → ")}
            </b>
          </span>
        </div>
        <p className="muted">
          První dva vrcholy se vždy redukují na 1–9. Jedenáctka se podle zdroje
          zachovává pouze ve třetím a čtvrtém vrcholu; 22 se redukuje na 4.
          Vypnutím volby zobrazíte alternativu bez jedenáctek.
        </p>
        <p className="muted">
          Postup ověřen podle textu dodaného uživatelem a stránky{" "}
          <a
            href="https://numerologie.najdise.cz/karmicke-trojuhelniky-devitiletych-vibracnich-cyklu"
            target="_blank"
            rel="noreferrer"
          >
            Najdise.cz
          </a>
          . Jde o ověření výpočetních pravidel vůči sekundárnímu zdroji, nikoli
          o vědecké potvrzení metody nebo přímé ověření knih Robin Stein.
        </p>
      </section>
    </>
  );
}
