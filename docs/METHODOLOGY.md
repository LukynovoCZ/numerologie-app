# Metodika – výpočetní specifikace

**Status:** Specifikace výchozí aplikace založené na běžných západních numerologických konvencích. Nejde o autentizovanou rekonstrukci pravidel Robin Stein ani vědeckou metodu.

## Datum a číslice

Zápis `DD.MM.RRRR` -> osm číslic `DDMMYYYY`, včetně úvodních nul. Při výpočtu mřížky ignoruj `0`. Nezahrnuj čas narození.

## Redukce

`reduce9(n)`: pro nezáporné celé n opakovaně sčítej desetinné číslice, dokud není výsledek v 0..9. Pro životní číslo volitelně zachovej 11,22,33 jako mezistav a vrať zvlášť `baseValue = reduce9(n)`.

`lifePathRaw = sum(digit for digit in DDMMYYYY)`. Příklad 14.09.1990 -> 33 -> volitelně 33/6. Alternativa: nejdřív `reduce9(day) + reduce9(month) + reduce9(year)` => 5+9+1=15=>6. Nevydávej výstup 33 za výsledek _obou_ metod.

`birthday = reduce9(day)`; `attitude = reduce9(day + month)`.

## Osobní cykly

Výchozí kalendářní metoda: `personalYear(birth, Y)=reduce9(reduce9(day)+reduce9(month)+reduce9(Y))`, ekvivalentní součtu číslic dne/měsíce/roku, pokud se v cyklech nezachovávají mistrovská čísla.

`personalMonth(birth,Y,M)=reduce9(personalYear(birth,Y)+M)`.

`personalDay(birth,Y,M,D)=reduce9(personalMonth(birth,Y,M)+D)`.

`universalYear(Y)=reduce9(Y)`; `universalMonth(Y,M)=reduce9(universalYear(Y)+M)`; `universalDay(Y,M,D)=reduce9(universalMonth(Y,M)+D)`.

### Narozeninová alternativa

Přepínač **od narozenin do narozenin** musí mít zdokumentovanou konvenci: číslo aktivního osobního období vyhodnoť podle roku, v němž začalo na narozeniny. Jestli ještě narozeniny v posuzovaném kalendářním roce nenastaly, použij předchozí rok. U narození 29. února definuj datum přechodu pro nepřestupné roky explicitně (např. 28. únor) a ukaž je v nastavení. Neměň potichu datum narození ani nemíchej jednotlivé konvence.

## Mřížka a linie

Rozložení řádků odshora `[3,6,9], [2,5,8], [1,4,7]`.

Počty `[1..9]`: výhradně původní číslice data. Stavy linek podle počtu _různých_ zastoupených čísel (0, 1, 2, 3). Opakování ovlivňuje pouze četnost/intenzitu, ne počet obsazených polí.

`intense = presentCount === 3 && occurrenceSum >= 5` – vlastní UX pravidlo, ne historické tvrzení.

`coverage = presentCount / 3`, `intensity = (sum(min(count[n],3) for n in line))/9`, `score=round(100*(.8*coverage+.2*intensity))` – čistě vizualizační indexy.

## Pinnacles – výchozí konvence

`m=reduce9(month)`, `d=reduce9(day)`, `y=reduce9(year)`.

P1=`reduce9(m+d)`; P2=`reduce9(d+y)`; P3=`reduce9(P1+P2)`; P4=`reduce9(m+y)`. V metodice mistrovských čísel mohou být alternativní výsledky, proto konfigurace musí být výslovná. První vrchol končí věkem `36 - baseLifePath`, další dva vrcholy trvají devět let, čtvrtý následuje; vymez přechody v kalendáři s ohledem na konkrétní narozeniny.

## Challenges

C1=`abs(m-d)`; C2=`abs(d-y)`; C3=`abs(C1-C2)`; C4=`abs(m-y)`. Výzvy vázané na věkové úseky zobrazené pod Pinnacles. Záporné hodnoty neexistují; 0 má vlastní výklad.

## Jméno

Po odstranění české diakritiky použij posloupnost ABCDEFGHIJKLMNOPQRSTUVWXYZ s cyklem 1..9. `CH` zpracuj jako dvě písmena. Y výchozí nastavení českého režimu = samohláska, musí být popsané a případně přepínatelné. Vstup jména nesmí ovlivnit mřížku.

## Čas narození

Není součástí výchozí numerologie. Ukládej a zobraz pouze jako volitelnou informaci. Nic z něj nedovozuj bez samostatné explicitně pojmenované metody, která zatím není požadována.

## Implementované volby a výstup

- Narození 29. února má v nepřestupném roce výročí 28. února. Tato stejná konvence platí pro osobní období a kalendářní hranice vrcholů.
- První vrchol zahrnuje věky 0 až `36 - baseLifePath` včetně. Další začíná na narozeniny ve věku `37 - baseLifePath`. Druhý a třetí mají devět celých věkových roků. Kalendářní `start` je včetně, `until` je první den následujícího období a nezahrnuje se.
- Ve vrcholech, výzvách, jmenných číslech i osobních cyklech se mistrovská čísla nezachovávají. Volba 11/22/33 ovlivňuje pouze životní číslo; základ je vždy jednociferný.
- Jméno: vyjádření je redukovaný součet všech normalizovaných písmen, duše součet samohlásek, osobnost součet souhlásek. Zralost = `reduce9(expression.baseValue + lifePath.baseValue)`. Bez písmen se jmenný rozbor nevytváří. Výchozí Y je samohláska, přepínač jej může zařadit mezi souhlásky. CH jsou C a H zvlášť. Znaky mimo normalizované A–Z se ignorují.
- Osobní přehled roku/měsíce/dne používá datum rozboru. U narozeninové varianty používá rok počátku aktivního narozeninového období, pak přičítá kalendářní měsíc a den data rozboru. Samostatná devítiletá a dvanáctiměsíční osa je výslovně kalendářní a centrovaná kolem vybraného roku.
- Výstup obsahuje surové číslice včetně nul, počty 1–9, chybějící číslice, mezikroky redukce, identifikátory interpretací, aktivní pravidla a zdrojové identifikátory. Vše je serializovatelné do JSON.
- Interpretace jsou vlastní nehodnotící redakční syntéza (`editorial_synthesis`), běžná výpočetní pravidla jsou označena `traditional`. Výzva 0 je samostatný symbolický podnět otevřenosti, nikoli absence výzev.

## Osobní roční vibrace a kontrolní stránka

Samostatná část „Roční vibrace a trojúhelník“ vždy používá narozeninovou konvenci: aktivní rok začíná na poslední narozeniny před datem rozboru nebo přímo v den narozenin. Hodnota je `reduce9(reduce9(day) + reduce9(month) + reduce9(startYear))`. Konec je na následující narozeniny a nezahrnuje se. Devítiletá řada začíná rokem `activeYear - (currentVibration - 1)` a zobrazuje po sobě vibrace 1 až 9. Tato řada není výpočtem řídicích vibrací karmických trojúhelníků. Roky mimo 1–9999 se nezobrazují.

### Trojúhelník podle dodaného referenčního obrázku

Základna zleva: `m=reduce9(month)`, `d=reduce9(day)`, `y=reduce9(year)`. Levý uzel je redukce `m+d`, pravý redukce `d+y`, vrchol redukce součtu levého a pravého uzlu, vnější uzel redukce `m+y`. U součtových uzlů lze samostatně zachovat 11 a 22, výchozí ano. Výchozí redukce komponent zůstává jednociferná. Tato volba je oddělená od životního čísla a nemění mřížku.

Referenční obrázek uživatele: 24.07.1939 → základna 7,6,4; levý 4; pravý 1; vrchol 5; vnější 11. Vypnutí zachování mistrovských uzlů změní vnější číslo na 2.

**Rozsah ověření:** schéma a hodnoty byly ověřeny pouze proti dodanému obrázku. Textová metoda https://numerologie.najdise.cz/karmicke-trojuhelniky-devitiletych-vibracnich-cyklu není z cloudového prostředí dostupná (síťový proxy zákaz HTTP 403). Z obrázku nelze určit přiřazení jednotlivých uzlů k navazujícím devítiletým obdobím. Řídicí vibrace těchto období proto zatím aplikace nepřiřazuje. Nejde o potvrzenou implementaci celé metody Najdise.cz ani o náhradu životních vrcholů. Ve výstupu schématu je `periodMappingVerified: false` a zdroj `user-supplied-diagram`.

Kontrolní stránka `#kontrola` porovnává tři pevné příklady s uloženými očekáváními v `src/data/checks.cs.json`. Hodnoty pro datum 01.02.1917 jsou odvozeny z uvedených vzorců; nejsou výsledkem načteným z Najdise.cz. Kontrolní stránka nepřistupuje k externím kalkulačkám a neodesílá osobní údaje.
