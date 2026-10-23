# Metodika – výpočetní specifikace

**Status:** Specifikace výchozí aplikace založené na běžných západních numerologických konvencích. Nejde o autentizovanou rekonstrukci pravidel Robin Stein ani vědeckou metodu.

## Datum a číslice

Zápis `DD.MM.RRRR` -> osm číslic `DDMMYYYY`, včetně úvodních nul. Při výpočtu mřížky ignoruj `0`. Nezahrnuj čas narození.

## Redukce

`reduce9(n)`: pro nezáporné celé n opakovaně sčítej desetinné číslice, dokud není výsledek v 0..9. Pro životní číslo volitelně zachovej 11,22,33 jako mezistav a vrať zvlášť `baseValue = reduce9(n)`.

`lifePathRaw = sum(digit for digit in DDMMYYYY)`. Příklad 14.09.1990 -> 33 -> volitelně 33/6. Alternativa: nejdřív `reduce9(day) + reduce9(month) + reduce9(year)` => 5+9+1=15=>6. Nevydávej výstup 33 za výsledek *obou* metod.

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

Počty `[1..9]`: výhradně původní číslice data. Stavy linek podle počtu *různých* zastoupených čísel (0, 1, 2, 3). Opakování ovlivňuje pouze četnost/intenzitu, ne počet obsazených polí.

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
