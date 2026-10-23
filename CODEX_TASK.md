# Úkol pro Codex: vytvoř funkční webovou aplikaci „Numerologie“

## Cíl

Na základě jediného povinného vstupu **datum narození DD.MM.RRRR** vytvoř úplný interaktivní numerologický rozbor. Volitelné: **čas narození HH:MM**, jméno, datum rozboru a vybraný kalendářní rok. Výklad je symbolický, nikoli vědecká osobnostní diagnostika. Aplikace vychází ze **západní mřížky 3×3**; Robin Stein je inspirační autor, bez neověřeného připisování pravidel.

## Projekt a stack

- Vytvoř React + TypeScript + Vite, Tailwind CSS, ikonky Lucide, testy Vitest.
- Bez backendu, placených API, telemetrie či cloudového ukládání osobních údajů.
- Česká lokalizace; struktura připravená pro SK/EN.
- Nasazení na Cloudflare Pages (build: `npm run build`, output: `dist`).
- Funkční desktop i mobil; světlý/tmavý režim; přístupná interaktivita.

## Povinné vstupy

- Povinné datum narození. Validuj datum včetně přestupných roků; nesmí automaticky měnit datum podle časového pásma.
- Volitelný čas narození a jméno; čas narození se zobrazuje, ale do standardních numerologických výpočtů nevstupuje.
- Volitelné datum rozboru (výchozí dnešní lokální kalendářní datum) a výběr roku.
- Ukládání pouze na výslovné zapnutí „Zapamatovat údaje v tomto zařízení“, jinak pouze v paměti stránky.

## Výpočetní moduly

1. **Životní číslo** (`lifePath`): výchozí součet *všech číslic* data narození; opakovaná redukce, zachovat volitelně 11/22/33. Uchovat původní součet, mezikroky a jednociferný základ. Možnost alternativy `component_sum` (nejdříve den, měsíc, rok). Rozdíl metod viditelně vysvětlit.
2. **Číslo dne narození** (`birthdayNumber`): den v původním a redukovaném tvaru.
3. **Číslo postoje** (`attitudeNumber`): redukce dne + měsíce.
4. **Osobní rok** (`personalYear`): výchozí kalendářní konvence redukce číslic dne, měsíce a zvoleného roku na 1–9. Zobraz předchozí, aktuální, další a 9letou osu. Alternativní přepínač `birthday_to_birthday`, s jasně popsanou metodou.
5. **Osobní měsíc**: redukuj osobní rok + číslo kalendářního měsíce.
6. **Osobní den**: redukuj osobní měsíc + číslo dne v měsíci.
7. **Univerzální rok/měsíc/den**: redukce roku, pak + měsíc, pak + den.
8. **Pokročilé cykly**: 4 životní vrcholy (Pinnacles), 4 výzvy (Challenges), jejich hranice a interaktivní časová osa, ověřený výpočet dle `docs/METHODOLOGY.md`.
9. **Volitelné jméno**: pythagorejské přiřazení písmen A-Z 1..9, česká normalizace diakritiky, zvláštní popis přístupu k Y/CH; číslo vyjádření, duše, osobnosti a zralosti. V žádném případě neměň mřížku narození.

## Západní mřížka 3×3

Použij PŘESNĚ:

```
3 | 6 | 9
2 | 5 | 8
1 | 4 | 7
```

Ze vstupu DDMMRRRR spočítej výskyty číslic 1..9. **Nuly ignoruj**, všechny opakované číslice započítej. Nezahrnuj životní číslo, čas, jméno ani průběžné součty. V polích ukaž například `11`, `999`; prázdná pole decentně označ číslem pozice. Po kliknutí ukaž význam čísla a význam jeho počtu 0/1/2/3/4+.

### Osm linií

| ID | Český název | Typ |
|---|---|---|
| 1-4-7 | praktičnost | horizontální |
| 2-5-8 | citová rovnováha | horizontální |
| 3-6-9 | intelekt | horizontální |
| 1-2-3 | plánování | vertikální |
| 4-5-6 | vůle | vertikální |
| 7-8-9 | aktivita | vertikální |
| 1-5-9 | odhodlání | diagonální |
| 3-5-7 | spiritualita / hledání smyslu | diagonální |

Pro každou vypočti `presentCount`, `occurrenceSum`, `status` (empty / partial_one / partial_two / full) a volitelné `intense` (full a occurrenceSum >= 5). Kategorie *intense* je nová aplikační konvence, **nikoliv tvrzení Robin Stein**. Vždy zobraz symbolický plný, částečný a prázdný výklad. Kliknutí na kartu linie zvýrazní tři správná pole mřížky a otevře detail.

### Skóre

Zobrazitelné `coverage = presentCount / 3` a `intensity = sum(min(count[n], 3) for n in line) / 9`.
Volitelné vizuální `score = round(100 * (0.8*coverage + 0.2*intensity))`. Vysvětli, že jde **pouze o algoritmické zastoupení číslic**, nikoliv validovanou psychologickou vlastnost. Prázdná linie = 0; plná linie s jediným výskytem každého čísla má skóre 87 (zaokrouhlení 86,666...).

## Interpretace

- Vypracuj plnohodnotné české texty pro 1..9 × výskyty 0/1/2/3/4+, pro osm linií × stavy, životní čísla 1..9 a volitelná mistrovská čísla, osobní roky 1..9, měsíce a dny.
- Každý popis: krátký UI text, delší text, konstruktivní potenciál, praktická aktivita, ne-deterministická formulace.
- Zdrojové metaúdaje: `sourceId`, `evidenceLevel` (`primary_verified`, `secondary_verified`, `traditional`, `editorial_synthesis`, `unverified`).
- Nezkoušej vymýšlet citace stránkování Robin Stein. Neoznačuj žádný nový text za přímý výklad Stein, dokud ho nemáme ověřený.
- Skládej celkový profil z klíčových témat; řeš duplicity a zdánlivé konflikty. Nesmí vzniknout deterministické diagnózy.
- Krátké upozornění, že numerologie je symbolická, vždy viditelně.

## UI

1. Vstupní formulář s datumem a volitelným časem/jménem.
2. Dashboard: velké životní číslo, aktuální osobní rok, měsíc, den, narozeninové číslo.
3. Interaktivní západní mřížka 3×3 s vizuálně patrným opakováním.
4. Osm linií – seznam stavů a interaktivní zvýraznění v mřížce.
5. Výklad: potenciály / rozvojová témata / souhrn.
6. Interaktivní 9letá osa osobních roků a 12 měsíců.
7. Rozbalovací pokročilé výpočty Pinnacles/Challenges + volitelná numerologie jména.
8. Stránka „Jak se to počítá“: rozpis výpočtů, použitá metodika, zdroje a hranice spolehlivosti.
9. Export do tisknutelného PDF a JSON, tlačítko kopírovat souhrn.

## Architektura

`src/engine` = čisté funkce, `src/components` = UI, `src/data` = české texty v JSON, `src/config` = metodiky, `src/types` = typy, `src/tests` = Vitest. Numerická data a interpretace oddělené; výstup výpočetního jádra musí být validní serializovatelný JSON obsahující vstup, metodu, čísla, mřížku, linie, cykly, kroky redukce, odkazy na ID interpretací.

## Povinné testy a dokončení

Řiď se `docs/ACCEPTANCE_TESTS.md`; minimálně testuj referenční datum 14.09.1990, 29.02.2000, 29.02.1900, 31.04.2020, přechod 31.12.→1.1., prázdné linie, různé časy téhož dne, všechny výskyty a nastavení metody.

**Výsledek:** skutečný projekt se spustitelnou aplikací, `npm test`, `npm run build`, README a GitHub PR/commity. Nepostačuje statický návrh. Nespouštěj služby vyžadující tajné údaje bez povolení.
