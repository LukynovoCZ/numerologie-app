import { calculate } from "../engine";
import birthdays from "../data/birthdays.cs.json";
export function PersonalDetails({
  result,
}: {
  result: ReturnType<typeof calculate>;
}) {
  const day = birthdays[String(result.birth.day) as keyof typeof birthdays],
    name = result.name;
  const named = name
    ? ([
        ["Činné číslo", name.vibrations.active, "Součet písmen jména"],
        ["Dědičné číslo", name.vibrations.hereditary, "Součet písmen příjmení"],
        [
          "Vibrační číslo",
          name.vibrations.personal,
          "Součet činného a dědičného čísla",
        ],
        ["Intimní číslo", name.vibrations.intimate, "Součet samohlásek"],
        ["Číslo realizace", name.vibrations.realization, "Součet souhlásek"],
      ] as const)
    : [];
  return (
    <>
      <section className="panel birthday-profile">
        <span className="eyebrow">DEN V KALENDÁŘI, NEJEN JEHO REDUKCE</span>
        <h2>
          Den narození {result.birth.day} · {day.title}
        </h2>
        <p>
          Den {result.birth.day} má redukovaný základ {result.birthday.value}.
          Níže jde o symbolické otázky pro konkrétní den 1–31, nikoli o určení
          charakteru.
        </p>
        <div className="personal-two">
          <div>
            <h3>Možnosti</h3>
            <p>{day.potential}</p>
          </div>
          <div>
            <h3>Co lze rozvíjet</h3>
            <p>{day.growth}</p>
          </div>
        </div>
        <div className="practice">
          <strong>Podnět k praxi</strong>
          <p>{day.activity}</p>
        </div>
        <small>
          Vlastní redakční syntéza témat{" "}
          <a
            href="https://numerologie.najdise.cz/den-narozeni"
            target="_blank"
            rel="noreferrer"
          >
            Najdise.cz – den narození
          </a>
          .
        </small>
      </section>
      <section className="panel name-profile">
        <span className="eyebrow">JMÉNO A PŘÍJMENÍ ODDĚLENĚ</span>
        <h2>Vibrace jména</h2>
        <p>
          Pro konkrétní výpočet vyplňte nepovinné jméno a příjmení ve formuláři
          a potvrďte rozbor. Pole se nerozdělují odhadem; více křestních jmen
          můžete zadat do pole Jméno.
        </p>
        {name ? (
          <>
            <p>
              Jméno: <strong>{name.first || "nevyplněno"}</strong> · Příjmení:{" "}
              <strong>{name.last || "nevyplněno"}</strong>
            </p>
            <div className="name-number-cards">
              {named.map(([label, value, description]) => (
                <article key={label}>
                  <h3>{label}</h3>
                  <strong>{value?.value ?? "—"}</strong>
                  <p>{description}</p>
                  <p>
                    {value
                      ? value.steps.join(" → ")
                      : "Doplňte odpovídající pole."}
                  </p>
                </article>
              ))}
            </div>
            <p>
              Intimní číslo a číslo duše označují tentýž součet samohlásek;
              číslo realizace a dosavadní „osobnost“ součet souhlásek. Tyto
              názvy neměří skutečnou hodnotu člověka ani psychologické
              vlastnosti.
            </p>
            <h3>Písmena a jejich hodnoty</h3>
            <div className="letter-values">
              {name.letters.map((l, i) => (
                <span key={i}>
                  <b>{l.letter}</b>
                  {l.value}
                  <small>
                    {l.kind === "vowel" ? "samohláska" : "souhláska"}
                  </small>
                </span>
              ))}
            </div>
            <h3>Vícečetná a chybějící čísla ve jménu</h3>
            <div className="name-counts">
              {Object.entries(name.counts).map(([n, count]) => (
                <span key={n}>
                  <b>{n}</b>
                  {count}×
                </span>
              ))}
            </div>
            <p>
              Chybějící: {name.missing.join(", ") || "žádná"}. Četnost písmen
              popisuje pouze zápis jména a neznačí nadání, posedlost ani
              nedostatek. Mřížka narození se těmito čísly nedoplňuje.
            </p>
            <details>
              <summary>Dosavadní výpočet vyjádření a zralosti</summary>
              <p>
                Vyjádření ze všech písmen: {name.expression.steps.join(" → ")}.
                Zralost: {name.maturity.steps.join(" → ")}. Vibrační číslo výše
                počítá součet činného a dědičného čísla; při zachování 11/22 se
                mezikroky mohou lišit od součtu všech písmen.
              </p>
            </details>
          </>
        ) : (
          <p className="muted">Zatím není zadáno žádné jméno ani příjmení.</p>
        )}
        <h3>Tabulka převodu A–Z</h3>
        <div className="annual-table-wrap">
          <table className="letter-table">
            <caption>Pythagorejské přiřazení písmen</caption>
            <thead>
              <tr>
                {Array.from({ length: 9 }, (_, i) => (
                  <th scope="col" key={i}>
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((row) => (
                <tr key={row}>
                  {Array.from({ length: 9 }, (_, column) => {
                    const n = row * 9 + column;
                    return (
                      <td key={column}>
                        {n < 26 ? String.fromCharCode(65 + n) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Diakritika se odstraňuje; CH jsou dvě písmena. Y je{" "}
          {result.method.yVowel ? "samohláska" : "souhláska"}. Jmenná čísla{" "}
          {(name?.masters ?? result.input.nameMasters ?? true)
            ? "zachovávají 11 a 22"
            : "se redukují na jednociferný základ"}
          . Nastavení je oddělené od životního čísla. Jméno nemění datum, mřížku
          ani standardní cykly.
        </p>
        <p>
          Kontrolní příklad: Petr Veselý → činné 5, dědičné 7, vibrační 3,
          intimní 22, realizace 8 (s Y jako samohláskou a zachováním 11/22).{" "}
          <a
            href="https://numerologie.najdise.cz/numerologie-jmena"
            target="_blank"
            rel="noreferrer"
          >
            Podklad a terminologie: Najdise.cz
          </a>
          .
        </p>
      </section>
    </>
  );
}
