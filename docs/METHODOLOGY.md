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
- V původních vrcholech Pinnacles, výzvách a osobních cyklech se mistrovská čísla nezachovávají. Samostatná jmenná čísla nově mají vlastní volbu 11/22 a karmické trojúhelníky zachovávají 11 ve třetím a čtvrtém vrcholu. Volba 11/22/33 ovlivňuje pouze životní číslo; základ je vždy jednociferný.
- Jméno: vyjádření je redukovaný součet všech normalizovaných písmen, duše součet samohlásek, osobnost součet souhlásek. Zralost = `reduce9(expression.baseValue + lifePath.baseValue)`. Bez písmen se jmenný rozbor nevytváří. Výchozí Y je samohláska, přepínač jej může zařadit mezi souhlásky. CH jsou C a H zvlášť. Znaky mimo normalizované A–Z se ignorují.
- Osobní přehled roku/měsíce/dne používá datum rozboru. U narozeninové varianty používá rok počátku aktivního narozeninového období, pak přičítá kalendářní měsíc a den data rozboru. Samostatná devítiletá a dvanáctiměsíční osa je výslovně kalendářní a centrovaná kolem vybraného roku.
- Výstup obsahuje surové číslice včetně nul, počty 1–9, chybějící číslice, mezikroky redukce, identifikátory interpretací, aktivní pravidla a zdrojové identifikátory. Vše je serializovatelné do JSON.
- Interpretace jsou vlastní nehodnotící redakční syntéza (`editorial_synthesis`), běžná výpočetní pravidla jsou označena `traditional`. Výzva 0 je samostatný symbolický podnět otevřenosti, nikoli absence výzev.

## Osobní roční vibrace a kontrolní stránka

Samostatná část „Roční vibrace a trojúhelník“ vždy používá narozeninovou konvenci: aktivní rok začíná na poslední narozeniny před datem rozboru nebo přímo v den narozenin. Hodnota je `reduce9(reduce9(day) + reduce9(month) + reduce9(startYear))`. Konec je na následující narozeniny a nezahrnuje se. Devítiletá řada začíná rokem `activeYear - (currentVibration - 1)` a zobrazuje po sobě vibrace 1 až 9. Tato řada není výpočtem řídicích vibrací karmických trojúhelníků. Roky mimo 1–9999 se nezobrazují.

### Karmické trojúhelníky podle Najdise.cz

Postup je ověřen proti textu dodanému uživatelem a dostupným stránkám Najdise.cz (sekundární zdroj). Základna zleva: `m=reduce9(month)`, `d=reduce9(day)`, `y=reduce9(year)`. První vrchol = `reduce9(m+d)`, druhý = `reduce9(d+y)`. Třetí vrchol = redukce součtu prvního a druhého; čtvrtý = redukce `m+y`. **Pouze ve třetím a čtvrtém vrcholu se zachovává 11.** První dva vrcholy se vždy redukují na 1–9. Hodnota 22 se nezachovává. Samostatný přepínač může vypnout i zachování 11 ve třetím a čtvrtém vrcholu; jde pak o výslovnou alternativu ke zdroji.

Pro hranice se životní číslo vždy redukuje na jednociferný základ `L=reduce9(sumDigits(DDMMYYYY))`, nezávisle na ostatních přepínačích. První období **začíná** na narozeniny ve věku `36−L`. Další období začínají po 9, 18 a 27 letech od prvního vstupu. První tři jsou devítiletá, čtvrté pokračuje bez časového konce. Interval je vždy `[from, until)`: den vstupu se zahrnuje, den následujícího přechodu patří dalšímu období. Před prvním vstupem se řídicí vibrace nepřiřazuje.

Tato konvence se liší od původní konvence Pinnacles v pokročilém rozboru: tam první vrchol zahrnuje věky 0 až `36−L` včetně a druhý začíná na dalších narozeninách. Tyto dvě pojmenované metody se nemíchají.

Referenční příklad 24.07.1939: základna 7,6,4; vrcholy 4,1,5,11. Základ životního čísla je 8, první věk 28. Období: 24.07.1967–24.07.1976, 24.07.1976–24.07.1985, 24.07.1985–24.07.1994 a od 24.07.1994 dále. Příklad ze zdroje 22.05.2024: vrcholy 9,3,3,4; vstupy ve věku 28,37,46,55, tedy 22.05.2052, 2061, 2070, 2079. Další živě ověřený příklad 29.09.2000 (součet 22 → základ 4): první vstup ve věku 32, nikoli 14.

Na všech vstupech vychází ORV 9; roky uvnitř devítiletého úseku proto mají pořadí **9,1,2,3,4,5,6,7,8**, nikoli 1–9. Osobní roční vibrace se nadále počítají od narozenin a redukují na 1–9. Zdroj navíc uvádí zvláštní výklady ORV 11; tato aplikace používá její základ 2. U narození 29. února platí dříve dokumentovaná konvence 28. února v nepřestupných letech.

Ve čtvrtém období se řídicí číslo nemění ani po dalších devíti letech. Tabulka pro toto období zobrazuje devítiletý úsek obsahující datum rozboru, nebo jeho první úsek, pokud dosud nezačalo. JSON export obsahuje všechna čtyři období, věky, datumové hranice, aktivní období, kontrolní ORV a roční tabulky v `triangleCycles`. U schématu je `periodMappingVerified: true` a zdroj `najdise-triangles`; příznak označuje ověření algoritmického přiřazení vůči uvedenému postupu, nikoli empirickou platnost numerologie.

Výklady vibrací 1–9 a 11 i jejich devíti souběhů s ORV jsou původní redakční syntéza (`editorial_synthesis`). Konkrétní zdrojová stránka je uvedena v `sourceRefs`; znění webu ani jeho deterministické zdravotní, finanční či vztahové předpovědi nepřebíráme. Detail cyklu 9 byl přečten na https://numerologie.najdise.cz/devitileta-vibrace/9. Web připisuje text Robin Steinové, ale bez přímého ověření původní knihy jej neoznačujeme za primárně ověřený zdroj.

Kontrolní stránka `#kontrola` porovnává čtyři pevné příklady v `src/data/checks.cs.json`, včetně příkladu 22.05.2024 dodaného uživatelem. Ověřuje také čtveřici řídicích vibrací a datum prvního vstupu. Pro datum 01.02.1917 jsou očekávání odvozena z uvedených vzorců, nikoli převzata z online kalkulačky. Aplikace při uživatelských výpočtech neodesílá data na Najdise.cz.

## Čtvrtiny ORV

Každé narozeninové období se dělí na `[výročí, +3 měsíce)`, `[+3, +6)`, `[+6, +9)` a `[+9, další výročí)`. Posuny se počítají přímo od posledního výročí, nikdy postupným přičítáním od oříznutého dne. Pokud den v cílovém měsíci neexistuje, použije se jeho poslední kalendářní den. Například 31.01.2026 → 30.04.2026 → 31.07.2026 → 31.10.2026 → 31.01.2027. U výročí 29. února se použije dříve dokumentovaná konvence, tedy 28. únor v nepřestupném roce. Začátek se zahrnuje, konec nikoli.

Tato čtyři období jsou kalendářním členěním; nepočítáme astronomické lunární fáze. Tvrzení, že narozeniny vždy připadají na novoluní a o šest měsíců později na úplněk, není astronomicky správné a aplikace je nepřebírá. Z čtvrtin se nepředpovídá energie, nálada ani události.

Zdrojové příklady: 13.05.1943 k 01.12.2004 → ORV 6, od 13.05.2004 do 13.05.2005. Pro 20.10.1978 k 01.08.2004 se použije rok posledních narozenin 2003 → ORV 8; od 20.10.2004 je 9, od 20.10.2005 je 1.

## Samostatné jméno a příjmení

Nové volitelné pole `surname` se neodvozuje od pole `name`. Dříve uložené celé jméno se automaticky nerozděluje. Po normalizaci české diakritiky se používá A–Z cyklicky 1–9; CH jsou dvě písmena. Volba `yVowel` určuje samohláskovost Y. `nameMasters` (výchozí true) nezávisle zachovává 11/22, nikoli 33. Bez této volby se všechna jmenná čísla redukují na 0–9. Prázdné jméno/příjmení mají u vlastního dílčího čísla null; neinterpretují se jako číslo nula.

- Činné = redukovaný součet písmen jména.
- Dědičné = redukovaný součet písmen příjmení.
- Vibrační = redukovaný součet výsledků činného a dědičného čísla.
- Intimní (duše) = redukovaný součet samohlásek obou polí.
- Realizace = redukovaný součet souhlásek obou polí.
- Dosavadní vyjádření počítá součet všech písmen najednou. Při zachování 11/22 se mezikroky i výsledek mohou lišit od vibračního čísla složeného z činného a dědičného; UI oba postupy pojmenovává. Zralost používá redukovaný základ vyjádření a životního čísla.

Petr Veselý: PETR = 7+5+2+9 = 23 → 5; VESELY = 4+5+1+5+3+7 = 25 → 7; vibrační 5+7 = 12 → 3; samohlásky EEEY = 22; souhlásky PTRVSL = 26 → 8. Se zakázaným zachováním 11/22 je intimní 4. Výstup uvádí jednotlivá písmena, jejich hodnoty, četnosti 1–9 a chybějící hodnoty. Do mřížky narození ani standardních cyklů se jmenné hodnoty nepřidávají.

## Den narození a roviny

Samostatné výklady pro původní dny 1–31 jsou v `src/data/birthdays.cs.json`; každý uvádí možnosti, témata k rozvíjení a praktický podnět, s původem `editorial_synthesis`. Názvy témat pocházejí z uživatelem dodaného seznamu Najdise.cz, znění výkladů je vlastní. Redukovaný základ dne zůstává zobrazen zvlášť.

Témata jednotlivých číslic mřížky vycházejí z dodaného přehledu Najdise.cz, samostatně pro výskyty 0/1/2/3/4+. Plná rovina má tři různé přítomné číslice, prázdná žádnou, částečná jednu nebo dvě. Uživatelský filtr nemění výpočet. Pokud nejsou žádné plné ani prázdné roviny, UI to výslovně uvádí. Žádné z těchto zastoupení není diagnózou, měřením inteligence ani nedostatku schopností.
