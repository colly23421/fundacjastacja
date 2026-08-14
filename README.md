# Program STACJA — nowa strona (kierunek 2a)

Statyczny HTML/CSS/JS, bez zależności i bez build-stepu. Wgrywa się przez FTP
albo osadza w motywie WordPressa jako szablony stron.

## Pliki

    index.html            strona główna (hero 2a na zdjęciu)
    szukam-pomocy.html    podstrona wsparcia dla odbiorców
    wesprzyj.html         podstrona darowizn i wolontariatu
    assets/css/stacja.css jeden arkusz — tokeny, komponenty, RWD, dostępność
    assets/js/stacja.js   pasek dostępności, menu mobilne, ETR, szybkie wyjście
    assets/img/           logo + zdjęcia (obecnie zdjęcie stockowe do wymiany)

## Paleta wyprowadzona z logo

| Token          | Hex       | Zastosowanie                          | Kontrast          |
|----------------|-----------|---------------------------------------|-------------------|
| `--brand`      | `#F69C00` | wypełnienia, przyciski, akcenty       | 8,55:1 na czerni  |
| `--brand-deep` | `#9C5800` | tekst pomarańczowy na jasnym tle      | 4,93:1 na `#F3F2F2` |
| `--brand-lift` | `#FFC94D` | tekst pomarańczowy na ciemnym tle     | 12,13:1 na czerni |
| `--ink`        | `#141311` | tło ciemne, nagłówki                  | —                 |
| `--paper`      | `#F3F2F2` | tło jasne                             | —                 |
| `--paper-warm` | `#FFF6EA` | tło sekcji przeplatanych              | —                 |

**Nigdy biały tekst na `#F69C00`** — to 2,17:1. Na pomarańczu zawsze `--ink`.

Poprzednia żółć `#FFC526` została usunięta: przy `#F69C00` dzieli je tylko 6°
odcienia, więc przy deuteranopii i protanopii zlewają się w jeden kolor.
Hierarchię buduje teraz jasność tego samego pomarańczu.

## Dostępność — co jest zaimplementowane

Fundament: `lang="pl"`, landmarki, hierarchia nagłówków bez przeskoków, link
„Przejdź do treści", focus 3 px z offsetem, cele dotykowe ≥ 44 px, obsługa
`prefers-reduced-motion`, powiększenie do 200 % bez utraty treści, arkusz druku.

Pasek dostępności: rozmiar tekstu 100/125/150 %, tryb wysokiego kontrastu
(czarno-żółty), podkreślenie linków, zatrzymanie animacji, reset. Ustawienia
zapamiętywane; w trybie prywatnym degradują się do jednej sesji bez błędu.

Menu mobilne: `aria-expanded`, zamykanie klawiszem Escape, focus uwięziony
w panelu, automatyczne zamknięcie po powrocie na desktop.

Płyta pod tekstem w hero ma stałe krycie 0,72 zamiast samego gradientu. Dzięki
temu minimalny kontrast jest policzalny niezależnie od tego, jakie zdjęcie
zostanie podstawione — nawet pod całkowicie białym kadrem biały tekst trzyma
7,20:1, a pomarańczowy nadtytuł 5,25:1.

Tekst łatwy do czytania (ETR): przełącznik na „Szukam pomocy" podmienia treści
`[data-standard]` na `[data-etr]`, rozluźnia interlinię i skraca miarę wiersza.

Szybkie wyjście: przycisk oraz trzykrotny Escape, `location.replace()` — strona
nie zostaje w historii przeglądarki.

## Do uzupełnienia przed publikacją

- Zdjęcia z prawdziwych działań zamiast stocka; dwa kadry (poziomy i pionowy).
- Numer konta, KRS, prawdziwe telefony i adresy e-mail.
- Kwoty w sekcji „Na co idą pieniądze" — z ostatniego sprawozdania.
- Nagranie w PJM z napisami VTT i transkrypcją.
- Weryfikacja numerów telefonów zaufania (116 111, 800 70 2222).
- Treść deklaracji dostępności i wersja angielska.
