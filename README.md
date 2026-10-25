# Numerologie

Česká, responzivní React aplikace pro západní numerologii. Numerologie je zde symbolickým námětem k zamyšlení, nikoli vědeckou diagnostikou nebo prognostikou. Konkrétní pravidla ani vlastní výklady nepřipisujeme Robin Stein.

## Vývoj

Požadavky: Node.js 22 nebo 24, npm. Ověřeno s Node.js 24.19.0 a npm 11.9.0.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm test` spouští Vitest jednorázově. `npm run build` nejprve ověří TypeScript a vytvoří `dist/`. Cloudflare Pages: build `npm run build`, výstup `dist`, bez backendu a bez proměnných prostředí. Není potřeba žádný klíč ani účet pro běh aplikace. Závislosti jsou uzamčeny v `package-lock.json`.

## Hotové funkce

- Kalendářní validace DD.MM.RRRR bez časových posunů, volitelný čas a jméno; přehled odlišuje datum rozboru a rok osy.
- Obě metody životního čísla, volitelná 11/22/33, kroky redukce, narozeninové číslo, postoj a univerzální cykly.
- Západní mřížka 3–6–9 / 2–5–8 / 1–4–7 výhradně z číslic data, osm linií, klikací výklady, zvýraznění, četnosti a vysvětlené skóre.
- Osobní rok, měsíc a den; kalendářní a narozeninová konvence; devítiletá osa, sousední roky a dvanáct měsíců.
- Čtyři vrcholy, výzvy včetně nuly, jejich věkové a kalendářní hranice a interaktivní výběr období.
- Numerologie jména s českou normalizací, volbou Y a oddělenými C/H; vyjádření, duše, osobnost a zralost.
- Lokální český JSON obsah pro počty číslic 0/1/2/3/4+, všechny stavy osmi linií, životní čísla, cykly, vrcholy a výzvy. Každý výklad obsahuje původ, úroveň evidence, potenciál i praktickou aktivitu.
- Souhrn témat bez diagnostických závěrů, metodika a zdroje v aplikaci; kopírování souhrnu, JSON a tisk / uložení do PDF prostřednictvím tiskového dialogu prohlížeče.
- Světlé/tmavé téma, mobile-first rozložení, ovládání klávesnicí, pojmenovaná pole a tlačítka, hlášení chyb a stavů.

## Soukromí

Bez backendu, autentizace, AI API, telemetrie, síťových písem a odesílání zadaných údajů. Rozbor probíhá v paměti prohlížeče. Osobní vstupy se do `localStorage` zapíší až po výslovném zapnutí „Zapamatovat údaje v tomto zařízení“ a odeslání formuláře. Vypnutí volby uložená data odstraní. JSON a PDF obsahují osobní vstupy, které uživatel sám exportuje. Téma se neukládá; výchozí respektuje nastavení systému.

## Architektura a rozhodnutí

`src/engine` obsahuje čisté výpočty, `src/config` geometrická pravidla, `src/types` vstupní typy, `src/data` interpretace a lokalizaci, `src/components` sdílené zobrazení výkladu. Číselný výstup je serializovatelný JSON s metodami, kroky, liniemi, cykly a interpretačními ID. Základní lokalizace je oddělená a schéma výkladů připravené pro další jazyky; tento release má české UI.

29. únor přechází v nepřestupných letech 28. února. Vrcholy ani výzvy nezachovávají mistrovská čísla. První vrchol zahrnuje i věk `36 − baseLifePath`, následující začíná na dalších narozeninách. Osa roků a měsíců je výslovně kalendářní, zatímco aktuální přehled podporuje obě konvence. Rok středu osy je omezen na 5–9995, aby devět let zůstalo v podporovaném rozsahu. Výklady jsou vlastní redakční syntéza, nikoli citace historických autorů. Kategorie výrazné linie a skóre jsou čistě aplikační indexy. Tisk / PDF tiskne zvolenou část rozboru; kompletní strukturovaná data jsou v JSON.

## Ověření

Vitest pokrývá referenční datum 14.09.1990, rozdíly metod, časovou nezávislost, normalizaci jména a Y/CH, validaci přestupných let, Silvestr, narozeninové přechody, cykly, věkové hranice, skóre 87 a invarianty pro 127 dat. Referenční požadavky: [akceptační případy](docs/ACCEPTANCE_TESTS.md), [metodika](docs/METHODOLOGY.md), [zdroje](docs/SOURCES.md).

### Prohlížečové testy

```sh
npx playwright install chromium
npm run test:e2e
```

V prostředí s již nainstalovaným Chromium lze místo stažení použít:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

Playwright spustí vývojový server, případně lokálně použije již běžící. Stejný scénář ověřuje desktop (1440 px) i mobil (390 px): referenční mřížku, zvýraznění linií, interpretace, validaci dat, výslovný souhlas s uložením a jeho odvolání, rok/měsíce, metodiku, JSON export, přepnutí tématu a přetečení stránky. Při implementaci prošlo 26 jednotkových/obsahových testů a oba prohlížečové scénáře; produkční build prošel. Samostatně ověřeno také vykreslení tiskového PDF.

## Kontrolní stránka a roční vibrace

V horních záložkách otevřete **Kontrola výpočtů** (`#kontrola`). Čtyři přednastavená data včetně 24.07.1939 z referenčního obrázku lze načíst do formuláře. Tlačítko „Spustit kontrolní příklady“ porovná pevná očekávání se skutečnými hodnotami. Pro vlastní data formulář potvrďte tlačítkem „Prozkoumat můj rozbor“; kontrolní stránka ukazuje aktuální výpočet a jeho JSON.

Záložka **Roční vibrace a trojúhelník** (`#vibrace`) obsahuje osobní roční vibrace od narozenin do narozenin, čtyři trojúhelníková období podle postupu Najdise.cz, jejich věkové a kalendářní hranice, aktivní období a SVG schéma. První vstup nastává ve věku `36 − jednociferný základ životního čísla`; první tři období mají devět let, čtvrté pokračuje dále. Na vstupu je ORV 9. Jedenáctka se podle zdroje zachovává pouze ve třetím a čtvrtém vrcholu. Zdrojový postup a původní konvence Pinnacles mají odlišné hranice a zůstávají výslovně oddělené.

Kliknutí na období otevře jeho řídicí vibraci a tabulku ročních vibrací. Kliknutím na ORV zobrazíte vlastní nehodnotící shrnutí jejího souběhu s dlouhodobou vibrací. Obsah pokrývá cykly 1–9 a 11 a jejich souběhy s ORV 1–9; podrobněji zpracovává i odkazovaný cyklus 9. Přímé zdrojové stránky jsou uvedeny v metadatech. Texty aplikace jsou vlastní redakční syntéza, nikoli citace či předpovědi. Původní knihy Robin Stein nebyly přímo ověřeny.

JSON export obsahuje narozeninové roční vibrace, aktuální schéma i `triangleCycles` s intervaly, aktivním obdobím a ročními tabulkami. Přepínač jedenáctky mění schéma i export; volba 11/22/33 u životního čísla věkové hranice nemění. Dokumentované vzorce a zdrojové příklady najdete v metodice.

### Samostatná testovací stránka bez instalace

```sh
npm run build:standalone
```

Soubor `dist/numerologie-test.html` obsahuje celou aplikaci, styly i výklady. Lze jej otevřít přímo v prohlížeči bez serveru. Obsahuje stejné funkce i kontrolní záložku. Kopírování do schránky může být u souborů na disku omezeno prohlížečem; textový souhrn a JSON zůstávají dostupné. Ani tato varianta automaticky neodesílá vstupy.

### Veřejná stránka přes GitHub Pages

Workflow `.github/workflows/pages.yml` při pushi do `main` provede testy, produkční build s `/numerologie-app/` jako základnou a nasazení. V repozitáři musí být jednorázově zapnuto **Settings → Pages → Build and deployment → Source: GitHub Actions**. Integrace prostředí nedostala oprávnění zapnout Pages přes API (HTTP 403 „Resource not accessible by integration“), zapnutí tedy musí provést vlastník repozitáře. Poté spusťte **Actions → Test and deploy preview → Run workflow**, pokud nastavení nezapnete před prvním pushem. Veřejná stránka je dostupná až po úspěšném nasazení. Dostupnost Pages u soukromého repozitáře se řídí plánem účtu; pokud nastavení Pages není dostupné, použijte samostatný HTML soubor nebo hosting Cloudflare Pages z úvodní části README.

Nové kontroly pokrývají narozeninové hranice, přestupné roky, posloupnost 1–9, uzly referenčního trojúhelníku a všechny čtyři pevné příklady. Prohlížečové scénáře zahrnují kontrolní stránku, změnu vzoru, roční vibrace a přepínač jedenáctky na desktopu i mobilu.

### Ověření dokončených trojúhelníků

Prošlo 43 jednotkových a obsahových testů, produkční build a čtyři prohlížečové scénáře (desktop a mobil). Kontroly zahrnují příklady 24.07.1939 a 22.05.2024, ORV 9 na vstupech pro 127 dat, přechod den před narozeninami a na narozeniny, jedenáctku v jednotlivých vrcholech, přestupné výročí, neměnnou čtvrtou vibraci a úplnost všech 90 kombinací cyklu s ORV.
