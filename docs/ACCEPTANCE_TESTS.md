# Akceptační testy

## Referenční případ A – 14.09.1990, volitelný čas 08:30

- Raw date digits: `1,4,0,9,1,9,9,0`
- Počty mřížky: `{1:2, 2:0, 3:0, 4:1, 5:0, 6:0, 7:0, 8:0, 9:3}`
- Chybějící: `[2,3,5,6,7,8]`
- Prázdné linie: `2-5-8`, `3-5-7`; **žádné další**.
- Plné linie: žádná.
- 1-4-7 = 2/3; 3-6-9 = 1/3; 1-2-3 = 1/3; 4-5-6 = 1/3; 7-8-9 = 1/3; 1-5-9 = 2/3.
- Životní číslo `raw_digit_sum`: `33`, s mistrovskými čísly `33/6`; bez nich `6`.
- Životní číslo `component_sum`: `5 + 9 + 1 = 15 -> 6` (bez 33).
- Číslo narození: `14/5`; postoj `14+9=23 -> 5`.
- Pro 2026: univerzální rok 1; osobní rok 6.
- Pro 10/2026: osobní měsíc `6+10=16 -> 7`.
- Pro 23.10.2026: osobní den `7+23=30 -> 3`.
- Identické základní výsledky s časem `00:00`, `08:30`, `23:59` i bez času.
- Osobní rok kalendářní: 31.12.2026=6; 01.01.2027=7.

## Datum validace

- `29.02.2000` = platné, `29.02.1900` = neplatné; `31.04.2020` = neplatné.
- Neexistující datum nelze použít pro výpočet, ukaž vstřícnou chybu.
- Přechody osobních let a měsíců při změně data rozboru, včetně 29. února.
- Čísla a čáry vykreslovat shodně v mobilní i desktopové verzi.

## Společné invarianty

- Součet `counts` = počet nenulových číslic v původním datu.
- `presentCount` linie ∈ [0,3].
- `empty` právě tehdy, pokud `presentCount=0`; `full` právě tehdy, pokud `presentCount=3`.
- Žádné ze zvolených devíti polí se nezamění s Lo Shu variantou.
- Čas narození nemění standardní numerologické výpočty.
- Volitelné jméno nemění mřížku ani životní číslo.
- Přepínání metodiky mění výpočet transparentně, nikoliv interpretaci bez vysvětlení.
