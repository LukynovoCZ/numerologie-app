import { useState } from "react";
import {
  ArrowUpRight,
  Download,
  Moon,
  Sun,
  Sparkles,
  Copy,
  Printer,
  ArrowRight,
} from "lucide-react";
import { calculate, today, parseDate } from "./engine";
import { annualVibrations, vibrationTriangle } from "./engine/vibrations";
import type { Input } from "./types";
import { layout } from "./config/rules";
import { Vibrations } from "./components/Vibrations";
import { Checks } from "./components/Checks";
import { Interpretation } from "./components/Interpretation";
import cs from "./data/locale.cs.json";
import sources from "./data/sources.json";
const storageKey = "numerologie:input:v1";
const defaults: Input = {
  birth: "14.09.1990",
  analysis: today(),
  year: new Date().getFullYear(),
  time: "",
  name: "",
  masters: true,
  method: "raw_digit_sum",
  cycle: "calendar",
  yVowel: true,
};
function load(): Input {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const value = { ...defaults, ...JSON.parse(saved) };
      calculate(value);
      return value;
    }
  } catch {
    /* Unavailable or invalid storage: use in-memory defaults. */
  }
  return defaults;
}
export default function App() {
  const [form, setForm] = useState<Input>(load),
    [result, setResult] = useState(() => calculate(load())),
    [error, setError] = useState(""),
    [remember, setRemember] = useState(() => {
      try {
        return !!localStorage.getItem(storageKey);
      } catch {
        return false;
      }
    }),
    [dark, setDark] = useState(
      () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    ),
    [tab, setTab] = useState(() =>
      window.location.hash === "#kontrola"
        ? "checks"
        : window.location.hash === "#vibrace"
          ? "vibrations"
          : "overview",
    ),
    [selected, setSelected] = useState(
      () => `life:${calculate(load()).life.value}`,
    ),
    [line, setLine] = useState(""),
    [notice, setNotice] = useState(""),
    [activeCycle, setActiveCycle] = useState(0);
  function update<K extends keyof Input>(key: K, value: Input[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = calculate(form);
      setResult(r);
      setSelected(`life:${r.life.value}`);
      setError("");
      setLine("");
      if (remember) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(form));
        } catch {
          setNotice("Údaje nelze uložit. Rozbor zůstává v paměti stránky.");
        }
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function toggleRemember(value: boolean) {
    setRemember(value);
    if (!value) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        setNotice("Úložiště není dostupné.");
      }
    }
  }
  const summary = `Numerologický rozbor · ${result.input.birth}\nŽivotní číslo ${result.life.value} (základ ${result.life.baseValue})\nOsobní rok ${result.personal.year}, měsíc ${result.personal.month}, den ${result.personal.day}\nMetoda: ${result.method.life}; cykly: ${result.method.cycle}\n${cs.disclaimer}`;
  function download() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            ...result,
            annualVibrations: annualVibrations(
              result.birth,
              parseDate(result.input.analysis),
            ),
            triangle: vibrationTriangle(result.birth),
          },
          null,
          2,
        ),
      ],
      {
        type: "application/json",
      },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "numerologicky-rozbor.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setNotice("Souhrn byl zkopírován.");
    } catch {
      setNotice("Kopírování není dostupné. Souhrn najdete níže v rozboru.");
    }
  }
  const selectedLine = result.lines.find((l) => l.id === line);
  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="header">
        <a className="brand" href="#">
          <span className="brand-icon">✳</span>
          {cs.appName}
          <span className="brand-sub">PROSTOR PRO SEBEPOZNÁNÍ</span>
        </a>
        <button
          className="icon-button"
          aria-label={dark ? "Zapnout světlé téma" : "Zapnout tmavé téma"}
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      <main>
        <section className="hero">
          <span className="eyebrow">
            <span /> ČÍSLA JAKO INSPIRACE, VY JAKO AUTOR
          </span>
          <h1>
            Každé datum má
            <br />
            svůj <em>příběh.</em>
          </h1>
          <p>
            Objevte symboliku svého data narození.
            <br />S otevřenou myslí, vlastním pohledem a prostorem pro otázky.
          </p>
          <div className="hero-mark" aria-hidden="true">
            <div className="orbit" />
            <span>9</span>
            <small>1 · 4 · 7</small>
            <i>✧</i>
          </div>
        </section>
        <div className="workspace">
          <aside>
            <form className="input-card" onSubmit={submit}>
              <span className="eyebrow">01 / VÁŠ VÝCHOZÍ BOD</span>
              <h2>Začněme u vás</h2>
              <p className="muted">
                Jediné, co potřebujeme, je datum narození.
              </p>
              <label>
                Datum narození <span>*</span>
                <input
                  required
                  inputMode="numeric"
                  placeholder="DD.MM.RRRR"
                  value={form.birth}
                  onChange={(e) => update("birth", e.target.value)}
                  aria-describedby={error ? "form-error" : undefined}
                />
              </label>
              <div className="two-fields">
                <label>
                  Čas <small>nepovinný</small>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                  />
                </label>
                <label>
                  Rok rozboru
                  <input
                    type="number"
                    min="5"
                    max="9995"
                    value={form.year}
                    onChange={(e) => update("year", Number(e.target.value))}
                  />
                </label>
              </div>
              <label>
                Jméno <small>nepovinné</small>
                <input
                  autoComplete="off"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Jak vám říkají?"
                />
              </label>
              <details>
                <summary>Nastavení výpočtu</summary>
                <label>
                  Datum rozboru
                  <input
                    value={form.analysis}
                    placeholder="DD.MM.RRRR"
                    onChange={(e) => update("analysis", e.target.value)}
                  />
                </label>
                <label>
                  Metoda životního čísla
                  <select
                    value={form.method}
                    onChange={(e) =>
                      update("method", e.target.value as Input["method"])
                    }
                  >
                    <option value="raw_digit_sum">
                      Součet všech číslic data
                    </option>
                    <option value="component_sum">
                      Redukce dne, měsíce a roku
                    </option>
                  </select>
                </label>
                <label>
                  Osobní cykly
                  <select
                    value={form.cycle}
                    onChange={(e) =>
                      update("cycle", e.target.value as Input["cycle"])
                    }
                  >
                    <option value="calendar">Kalendářní rok</option>
                    <option value="birthday_to_birthday">
                      Od narozenin do narozenin
                    </option>
                  </select>
                </label>
                <p className="muted">
                  U 29. února nastává přechod v nepřestupném roce 28. února. Čas
                  narození výpočty nemění.
                </p>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={form.masters}
                    onChange={(e) => update("masters", e.target.checked)}
                  />
                  Zachovat 11, 22 a 33 v životním čísle
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={form.yVowel}
                    onChange={(e) => update("yVowel", e.target.checked)}
                  />
                  Y ve jméně jako samohláska
                </label>
              </details>
              <label className="checkbox remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => toggleRemember(e.target.checked)}
                />
                Zapamatovat údaje v tomto zařízení
              </label>
              {error && (
                <p role="alert" id="form-error" className="error">
                  {error}
                </p>
              )}
              <button type="submit" className="primary">
                Prozkoumat můj rozbor <ArrowRight size={18} />
              </button>
              <p className="privacy">
                Vaše údaje zůstávají ve vašem prohlížeči.
              </p>
            </form>
            <div className="aside-note">
              <Sparkles size={20} />
              <p>
                Čísla nabízejí náměty.
                <br />
                <strong>Význam jim dáváte vy.</strong>
              </p>
            </div>
          </aside>
          <div className="results">
            <div className="result-heading">
              <div>
                <span className="eyebrow">02 / VAŠE OSOBNÍ MAPA</span>
                <h2>
                  {result.input.name
                    ? `Rozbor pro ${result.input.name}`
                    : "Váš numerologický rozbor"}
                </h2>
                <p className="muted">
                  {result.input.birth}
                  {result.input.time ? ` · ${result.input.time}` : ""}{" "}
                  <span className="dot">·</span> k {result.input.analysis}
                </p>
              </div>
              <span className="badge">Západní numerologie</span>
            </div>
            <nav className="tabs" aria-label="Části rozboru">
              {[
                ["overview", "Přehled"],
                ["cycles", "Cykly a období"],
                ["vibrations", "Roční vibrace a trojúhelník"],
                ["checks", "Kontrola výpočtů"],
                ["method", "Jak se to počítá"],
              ].map(([id, title]) => (
                <button
                  key={id}
                  aria-current={tab === id ? "page" : undefined}
                  onClick={() => {
                    setTab(id);
                    window.history.replaceState(
                      null,
                      "",
                      id === "checks"
                        ? "#kontrola"
                        : id === "vibrations"
                          ? "#vibrace"
                          : "#",
                    );
                  }}
                >
                  {title}
                </button>
              ))}
            </nav>
            {tab === "overview" && (
              <>
                <div className="stat-grid">
                  <button
                    className="life-card"
                    onClick={() => setSelected(`life:${result.life.value}`)}
                  >
                    <span>ŽIVOTNÍ ČÍSLO</span>
                    <strong>
                      {result.life.value}
                      <small>/{result.life.baseValue}</small>
                    </strong>
                    <p>
                      {result.life.value === 33
                        ? "Sdílená péče"
                        : result.life.value === 11
                          ? "Citlivá inspirace"
                          : result.life.value === 22
                            ? "Vize a struktura"
                            : "Váš symbolický motiv"}
                    </p>
                    <ArrowUpRight size={22} />
                  </button>
                  <div className="period-card">
                    <span className="eyebrow">
                      PRÁVĚ TEĎ · {result.input.analysis}
                    </span>
                    <div className="periods">
                      {[
                        ["year", "Rok", result.personal.year],
                        ["month", "Měsíc", result.personal.month],
                        ["day", "Den", result.personal.day],
                      ].map(([id, title, value]) => (
                        <button
                          key={id}
                          onClick={() => setSelected(`${id}:${value}`)}
                        >
                          <small>{title}</small>
                          <strong>{value}</strong>
                        </button>
                      ))}
                    </div>
                    <p>
                      Malé podněty pro aktuální období{" "}
                      <ArrowUpRight size={14} />
                    </p>
                  </div>
                </div>
                <section className="panel grid-section">
                  <div className="section-top">
                    <div>
                      <span className="eyebrow">ČÍSLICE VAŠEHO DATA</span>
                      <h2>Západní mřížka</h2>
                    </div>
                    <span className="subtle-pill">3 × 3</span>
                  </div>
                  <p className="muted">
                    Každá číslice má své místo. Klikněte na pole a objevte jeho
                    téma.
                  </p>
                  <div className="grid-content">
                    <div
                      className="number-grid"
                      aria-label="Numerologická mřížka"
                    >
                      {layout.map((n) => (
                        <button
                          key={n}
                          className={`${result.counts[n] ? "filled" : "empty"} ${selectedLine?.numbers.includes(n) ? "highlight" : ""}`}
                          aria-label={`Číslo ${n}, počet ${result.counts[n]}`}
                          onClick={() => {
                            setSelected(
                              `count:${n}:${Math.min(4, result.counts[n])}`,
                            );
                            setLine("");
                          }}
                        >
                          <span className="position">
                            {String(n).padStart(2, "0")}
                          </span>
                          <strong>
                            {result.counts[n]
                              ? String(n).repeat(result.counts[n])
                              : "—"}
                          </strong>
                          <small>
                            {result.counts[n]
                              ? `${result.counts[n]}× v datu`
                              : "bez výskytu"}
                          </small>
                        </button>
                      ))}
                    </div>
                    <div className="grid-caption">
                      <span className="mini-symbol">✧</span>
                      <h3>
                        Jedinečná skladba,
                        <br />
                        otevřené možnosti.
                      </h3>
                      <p>
                        Mřížka zachycuje pouze číslice data narození. Prázdné
                        pole neznamená chybějící schopnost.
                      </p>
                      <div className="mini-stats">
                        <span>
                          <strong>{9 - result.missing.length}/9</strong>
                          obsazených polí
                        </span>
                        <span>
                          <strong>
                            {result.rawDigits.filter(Boolean).length}
                          </strong>
                          číslic bez nul
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="panel">
                  <div className="section-top">
                    <h2>Osm linií, různé pohledy</h2>
                    <span className="muted">Prozkoumejte souvislosti</span>
                  </div>
                  <div className="lines">
                    {result.lines.map((l) => (
                      <button
                        key={l.id}
                        aria-pressed={line === l.id}
                        onClick={() => {
                          setLine(l.id);
                          setSelected(l.interpretationId);
                        }}
                      >
                        <span className="line-icon">
                          {l.id.replaceAll("-", " · ")}
                        </span>
                        <strong>{l.name}</strong>
                        <span className={`line-state state-${l.presentCount}`}>
                          {cs.statuses[l.presentCount]}
                        </span>
                        <ArrowUpRight size={16} />
                      </button>
                    ))}
                  </div>
                  {selectedLine && (
                    <p className="muted">
                      {selectedLine.type} · Výskyty {selectedLine.occurrenceSum}{" "}
                      · Pokrytí {Math.round(selectedLine.coverage * 100)} % ·
                      Intenzita {Math.round(selectedLine.intensity * 100)} % ·
                      Skóre {selectedLine.score}/100
                      {selectedLine.intense
                        ? " · Výrazné zastoupení (vlastní konvence)"
                        : ""}
                      . Skóre vyjadřuje pouze zastoupení číslic, nikoli
                      psychologickou vlastnost.
                    </p>
                  )}
                </section>
                <section className="panel reading" aria-live="polite">
                  <span className="eyebrow">PROSTOR K ZAMYŠLENÍ</span>
                  <Interpretation id={selected} />
                </section>
                <section className="panel">
                  <h2>Souvislosti vašeho rozboru</h2>
                  <p>
                    Životní číslo {result.life.value} otevírá dlouhodobý
                    symbolický motiv; osobní rok {result.personal.year} nabízí
                    jiný časový pohled. Pokud se témata rozcházejí, nemusíte si
                    vybrat jen jedno: můžete například hledat rovnováhu mezi
                    samostatností a spoluprací.
                  </p>
                  <p>
                    Opakovaná témata nejsou dalšími důkazy ani silnější
                    diagnózou. Vyberte si jediný podnět, který je pro vás nyní
                    užitečný, a ostatní klidně nechte stranou.
                  </p>
                  <div className="facts">
                    <span>
                      Narozeninové číslo{" "}
                      <b>
                        {result.birth.day}/{result.birthday.value}
                      </b>
                    </span>
                    <span>
                      Číslo postoje <b>{result.attitude.value}</b>
                    </span>
                    <span>
                      Univerzální rok / měsíc / den{" "}
                      <b>
                        {result.universal.year} / {result.universal.month} /{" "}
                        {result.universal.day}
                      </b>
                    </span>
                  </div>
                </section>
                <details className="panel">
                  <summary>Pokročilé výpočty a numerologie jména</summary>
                  <h3>Životní vrcholy a výzvy</h3>
                  <div className="cycle-buttons">
                    {result.cycles.map((c, i) => (
                      <button
                        key={i}
                        aria-pressed={i === activeCycle}
                        onClick={() => setActiveCycle(i)}
                      >
                        <small>
                          Období {i + 1} · věk {c.startAge}–{c.endAge ?? "∞"}
                        </small>
                        <strong>{c.value}</strong>
                        <span>Výzva {c.challenge}</span>
                      </button>
                    ))}
                  </div>
                  <p>
                    Od {result.cycles[activeCycle].start}
                    {result.cycles[activeCycle].until
                      ? ` do ${result.cycles[activeCycle].until} (konec se nezahrnuje)`
                      : " dále"}
                    . Výzvy sdílejí hranice vrcholů. V těchto výpočtech se
                    mistrovská čísla nezachovávají.
                  </p>
                  <Interpretation
                    id={`pinnacle:${result.cycles[activeCycle].value}`}
                  />
                  <Interpretation
                    id={`challenge:${result.cycles[activeCycle].challenge}`}
                  />
                  <h3>Numerologie jména</h3>
                  <p>
                    Česká diakritika se odstraní, CH jsou dvě písmena, Y je{" "}
                    {result.method.yVowel ? "samohláska" : "souhláska"}. Písmena
                    A–Z cyklicky odpovídají 1–9. Jméno nemění mřížku ani životní
                    číslo.
                  </p>
                  {result.name ? (
                    <>
                      <p>Normalizované jméno: {result.name.normalized}</p>
                      <div className="facts">
                        {[
                          ["Vyjádření", result.name.expression],
                          ["Duše", result.name.soul],
                          ["Osobnost", result.name.personality],
                          ["Zralost", result.name.maturity],
                        ].map(([label, r]) => (
                          <span key={String(label)}>
                            {String(label)}{" "}
                            <b>{typeof r === "object" ? r.value : ""}</b>
                          </span>
                        ))}
                      </div>
                      <p>
                        Názvy „duše“ a „osobnost“ jsou tradiční symbolická
                        označení; nejde o měření psychiky. Zralost je redukovaný
                        součet vyjádření a základu životního čísla.
                      </p>
                    </>
                  ) : (
                    <p className="muted">
                      Pro výpočet vyplňte nepovinné jméno a obnovte rozbor.
                    </p>
                  )}
                </details>
              </>
            )}
            {tab === "cycles" && (
              <>
                <section className="panel">
                  <span className="eyebrow">DEVÍTILETÁ PERSPEKTIVA</span>
                  <h2>Každé období má své téma</h2>
                  <p>
                    Osa ukazuje kalendářní osobní roky kolem vybraného roku{" "}
                    {result.input.year}. Narozeninová alternativa v přehledu se
                    řídí konkrétním datem rozboru.
                  </p>
                  <div className="facts">
                    {result.adjacentYears.map((y) => (
                      <span key={y.year}>
                        {y.year}
                        <b>{y.value}</b>
                      </span>
                    ))}
                  </div>
                  <div className="year-timeline">
                    {result.years.map((y) => (
                      <button
                        key={y.year}
                        className={
                          y.year === result.input.year ? "current" : ""
                        }
                        onClick={() => setSelected(`year:${y.value}`)}
                      >
                        <strong>{y.value}</strong>
                        <span>{y.year}</span>
                      </button>
                    ))}
                  </div>
                  <h3>Dvanáct měsíců roku {result.input.year}</h3>
                  <div className="month-grid">
                    {result.months.map((m) => (
                      <button
                        key={m.month}
                        onClick={() => setSelected(`month:${m.value}`)}
                      >
                        <span>
                          {new Intl.DateTimeFormat("cs", {
                            month: "long",
                          }).format(new Date(2024, m.month - 1, 1))}
                        </span>
                        <strong>{m.value}</strong>
                      </button>
                    ))}
                  </div>
                  <Interpretation id={selected} />
                </section>
              </>
            )}
            {tab === "vibrations" && (
              <Vibrations
                key={`${result.input.birth}:${result.input.analysis}`}
                birth={result.input.birth}
                analysis={result.input.analysis}
              />
            )}
            {tab === "checks" && (
              <Checks
                result={result}
                onExample={(value) => {
                  setForm(value);
                  setResult(calculate(value));
                  setError("");
                  setLine("");
                  setSelected(`life:${calculate(value).life.value}`);
                }}
              />
            )}
            {tab === "method" && (
              <section className="panel methodology">
                <span className="eyebrow">TRANSPARENTNÍ POSTUPY</span>
                <h2>Jak se to počítá</h2>
                <p>
                  Datum se čte jako kalendářní den bez převodu časového pásma.
                  Mřížka používá jen původní číslice, bez nul. Čas ani jméno do
                  ní nevstupují.
                </p>
                <h3>Životní číslo</h3>
                <p>
                  Součet číslic: {result.rawDigits.join(" + ")} ={" "}
                  {result.life.raw}. Alternativní součet redukovaných částí:{" "}
                  {result.life.components.join(" + ")} ={" "}
                  {result.life.components.reduce((a, b) => a + b, 0)}.
                </p>
                <p>
                  Aktivní metoda: {result.method.life}. Kroky:{" "}
                  {result.life.steps.join(" → ")}. Jednociferný základ:{" "}
                  {result.life.baseValue}. U referenčního data 14.09.1990 je
                  výsledek 33/6 pouze u součtu všech číslic se zachováním
                  mistrovských čísel; metoda částí vrací 15 → 6.
                </p>
                <h3>Další čísla a cykly</h3>
                <p>
                  Redukce opakovaně sčítá číslice na 0–9. Narozeninové číslo =
                  redukce dne; postoj = redukce dne + měsíce. Osobní rok =
                  redukce číslic dne, měsíce a roku období. Osobní měsíc =
                  redukce osobního roku + kalendářního měsíce; den = redukce
                  osobního měsíce + dne. Univerzální čísla obdobně vycházejí z
                  roku, měsíce a dne bez data narození.
                </p>
                <p>
                  Aktivní konvence: {result.method.cycle}; rok počátku období{" "}
                  {result.personal.activeYear}. Narozeninová varianta přechází
                  na narozeniny, u 29. února na 28. února v nepřestupném roce.
                </p>
                <h3>Vrcholy a výzvy</h3>
                <p>
                  Pro redukované m, d, y: vrcholy jsou redukce m+d, d+y, P1+P2,
                  m+y. Výzvy jsou |m−d|, |d−y|, |C1−C2|, |m−y|. První úsek
                  zahrnuje věky 0 až 36−základ životního čísla. Následují dva
                  devítileté úseky a poslední otevřený úsek; přechod nastává na
                  narozeniny.
                </p>
                <h3>Linie a skóre</h3>
                <p>
                  Pokrytí = počet různých zastoupených číslic / 3. Intenzita =
                  součet četností omezených na 3 / 9. Skóre = zaokrouhlení 100 ×
                  (0,8 × pokrytí + 0,2 × intenzita). Plná linie s jedním
                  výskytem každé číslice má skóre 87. Výrazná linie má všechna
                  pole a alespoň pět výskytů. Tyto indexy nevyjadřují schopnosti
                  nebo hodnotu člověka.
                </p>
                <h3>Zdroje a hranice</h3>
                {sources.map((s) => (
                  <p key={s.id}>
                    <strong>{s.title}</strong> ({s.evidenceLevel})<br />
                    {s.description}
                  </p>
                ))}
                <p>
                  Knihy Robin Stein jsou inspirací tématu; konkrétní postupy ani
                  texty této aplikace jí nepřipisujeme. Bibliografické údaje:{" "}
                  <a
                    href="https://search.worldcat.org/title/Numerologie-pro-vase-dite/oclc/37962433"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Numerologie pro vaše dítě (WorldCat)
                  </a>
                  . Záznam dokládá existenci knihy, nikoli pravidla či
                  interpretace. Nejsou zde citace neověřených pasáží.
                </p>
              </section>
            )}
            <section className="export-row">
              <p>Vezměte si své podněty s sebou.</p>
              <div>
                <button onClick={copy}>
                  <Copy size={16} />
                  Souhrn
                </button>
                <button onClick={download}>
                  <Download size={16} />
                  JSON
                </button>
                <button onClick={() => window.print()}>
                  <Printer size={16} />
                  Tisk / PDF
                </button>
              </div>
            </section>
            <p role="status">{notice}</p>
            <details className="summary-text">
              <summary>Textový souhrn</summary>
              <pre>{summary}</pre>
            </details>
          </div>
        </div>
        <footer>
          <Sparkles size={18} />
          <p>{cs.disclaimer}</p>
          <span>Vlastní pohled je vždy důležitější než číslo.</span>
        </footer>
      </main>
    </div>
  );
}
