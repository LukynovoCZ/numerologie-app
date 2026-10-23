# Instrukce pro Codex

1. Nezůstaň u plánu či mockupu: vytvoř spustitelnou webovou aplikaci podle `CODEX_TASK.md`.
2. Nejprve implementuj čisté, deterministické a testovatelné výpočetní jádro. Všechny vzorce definuj v `docs/METHODOLOGY.md`.
3. Výstupy musí být česky. UI mobile-first, responzivní, přístupné, světle/tmavé téma.
4. Mřížka se musí skládat výhradně z *číslic data narození*, bez nul a bez automatického přidávání životního čísla.
5. Datum vstupu interpretuj jako kalendářní datum bez časového posunu/timezone konverze; čas narození je volitelný a **nesmí ovlivnit standardní výpočty**.
6. Odděl surová data, numerické funkce, interpretace, jazykové soubory, pravidla a zdroje.
7. Nepřisuzuj Robin Stein konkrétní výklad ani názvy bez ověřeného přímého zdroje. U moderních / vlastních interpretací uváděj původ `traditional` nebo `editorial_synthesis`.
8. Neprezentuj numerologii jako empirickou psychologii ani prognostiku. Používej podmiňovací a nehodnotící jazyk.
9. Před dokončením musí projít `npm test` a `npm run build`; změny dolož v README.
10. Udělej skutečnou implementaci funkcí a UI. Nevyžaduj od uživatele další rozhodnutí pro neblokující volby. Rozhodnutí dokumentuj.
11. Zvol komponentovou architekturu a lokální JSON obsah pro výklady. Nepoužívej backend, autentizaci ani AI API.
12. Vytvoř pracovně členěné Commity / PR, pokud to prostředí umožňuje, s výčtem hotových funkcí a testů.
