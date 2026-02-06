# Design Brief: Kursverwaltungssystem

## 1. App Analysis

### What This App Does
Ein umfassendes Verwaltungssystem für Bildungseinrichtungen, Volkshochschulen oder private Kursanbieter. Die App ermöglicht die zentrale Verwaltung von Kursen, Dozenten, Teilnehmern, Räumen und Anmeldungen. Der Fokus liegt auf Übersichtlichkeit und schnellem Zugriff auf die wichtigsten Informationen: Welche Kurse laufen, wie viele Plätze sind frei, welche Anmeldungen sind offen.

### Who Uses This
Kursverwalter oder Administratoren einer Bildungseinrichtung. Sie arbeiten täglich mit dem System, nehmen Anmeldungen entgegen (telefonisch, per E-Mail oder persönlich), prüfen Verfügbarkeiten und behalten den Überblick über Zahlungsstatus. Sie sind keine IT-Experten, brauchen aber schnellen Zugriff auf alle relevanten Daten.

### The ONE Thing Users Care About Most
**Die Auslastung der aktuellen und kommenden Kurse** — Wie viele Plätze sind noch frei? Welche Kurse sind ausgebucht? Wo muss ich nachfassen wegen unbezahlter Anmeldungen?

### Primary Actions (IMPORTANT!)
1. **Neue Anmeldung erfassen** → Primary Action Button (häufigste Aktion: Teilnehmer meldet sich für Kurs an)
2. Neuen Teilnehmer anlegen (oft zusammen mit Anmeldung)
3. Neuen Kurs erstellen (seltener, aber wichtig)
4. Zahlungsstatus aktualisieren (Anmeldung als bezahlt markieren)

---

## 2. What Makes This Design Distinctive

### Visual Identity
Das Design verbindet professionelle Seriosität mit einladender Wärme — passend für eine Bildungseinrichtung, die Wissen vermittelt und Menschen zusammenbringt. Ein sanftes Salbeigrün als Akzentfarbe symbolisiert Wachstum und Lernen, ohne zu verspielt zu wirken. Die warme, cremefarbene Basis schafft eine einladende Atmosphäre, die sich von kalten, sterilen Verwaltungstools abhebt.

### Layout Strategy
- **Hero-Element:** Eine prominente Kursübersicht mit visueller Auslastungsanzeige (Fortschrittsbalken) dominiert den oberen Bereich
- **Asymmetrisches Layout auf Desktop:** 2/3 für Kursliste, 1/3 für Quick-Stats und schnelle Aktionen
- **Visuelle Hierarchie durch Größenvariation:** Kurskarten sind deutlich größer als die kompakten Statistik-Kacheln
- **Farbcodierung:** Auslastung wird durch Farbe kommuniziert (grün = Plätze frei, gelb = fast voll, rot = ausgebucht)

### Unique Element
**Die Auslastungsanzeige in den Kurskarten:** Ein elegant gestalteter Fortschrittsbalken mit abgerundeten Enden und sanftem Farbverlauf zeigt auf einen Blick die Belegung. Die Zahlen "12/20 Teilnehmer" erscheinen direkt im Balken. Bei fast vollen Kursen pulsiert ein dezenter Glow-Effekt, um Aufmerksamkeit zu erzeugen.

---

## 3. Theme & Colors

### Font
- **Family:** Plus Jakarta Sans
- **URL:** `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap`
- **Why this font:** Plus Jakarta Sans hat einen freundlichen, modernen Charakter mit exzellenter Lesbarkeit. Die leicht geometrischen Formen wirken professionell, aber nicht steril — perfekt für einen Bildungskontext. Die große Bandbreite an Gewichten ermöglicht klare Hierarchien.

### Color Palette
All colors as complete hsl() functions:

| Purpose | Color | CSS Variable |
|---------|-------|--------------|
| Page background | `hsl(40 33% 98%)` | `--background` |
| Main text | `hsl(220 20% 18%)` | `--foreground` |
| Card background | `hsl(0 0% 100%)` | `--card` |
| Card text | `hsl(220 20% 18%)` | `--card-foreground` |
| Borders | `hsl(40 20% 90%)` | `--border` |
| Primary action | `hsl(152 35% 42%)` | `--primary` |
| Text on primary | `hsl(0 0% 100%)` | `--primary-foreground` |
| Accent highlight | `hsl(152 30% 94%)` | `--accent` |
| Muted background | `hsl(40 20% 96%)` | `--muted` |
| Muted text | `hsl(220 10% 50%)` | `--muted-foreground` |
| Success/positive | `hsl(152 50% 40%)` | (component use) |
| Warning | `hsl(38 92% 50%)` | (component use) |
| Error/negative | `hsl(0 65% 50%)` | `--destructive` |

### Why These Colors
Das warme Off-White der Basis (`hsl(40 33% 98%)`) mit leichtem Gelbstich schafft eine einladende, papierartige Qualität — wie ein gut gestaltetes Kursprogramm-Heft. Das Salbeigrün (`hsl(152 35% 42%)`) als Primärfarbe ist ruhig und vertrauenswürdig, assoziiert mit Wachstum und Bildung. Die dunkle Textfarbe hat einen leichten Blauanteil für bessere Lesbarkeit am Bildschirm.

### Background Treatment
Die Seite hat einen sanften, warmen Off-White-Hintergrund. Cards heben sich durch reines Weiß und subtile Schatten ab. Keine Gradienten oder Texturen — die Wärme kommt allein aus dem Farbton.

---

## 4. Mobile Layout (Phone)

Design mobile as a COMPLETELY SEPARATE experience, not squeezed desktop.

### Layout Approach
Vertikaler Flow mit klarer Priorisierung. Der Nutzer sieht zuerst die wichtigsten Zahlen (offene Anmeldungen, kommende Kurse), dann die Kursliste mit Auslastung. Navigation erfolgt über ein Bottom-Tab-Bar. Der Primary Action Button ist als Floating Action Button (FAB) unten rechts positioniert, immer erreichbar.

### What Users See (Top to Bottom)

**Header:**
- App-Titel "Kursverwaltung" linksbündig, 20px, font-weight 600
- Rechts: Such-Icon (öffnet Suchfeld) und Filter-Icon
- Höhe: 56px, weißer Hintergrund mit 1px Border unten
- Kein Hamburger-Menü — Navigation über Bottom-Tabs

**Hero Section (Quick Stats Row):**
- Horizontale Scroll-Row mit 3 kompakten Stat-Cards
- Jede Card: 140px breit, 80px hoch
- Card 1: "Offene Anmeldungen" — große Zahl (32px, bold), Label darunter (12px, muted)
- Card 2: "Kurse diese Woche" — Anzahl aktiver Kurse
- Card 3: "Unbezahlt" — Anzahl unbezahlter Anmeldungen (in Warning-Farbe wenn > 0)
- Hintergrund: leichtes Accent-Grün für die erste Card, um Wichtigkeit zu signalisieren
- Horizontal scrollbar, erste Card angeschnitten am rechten Rand um Scroll-Affordance zu zeigen

**Section 2: Aktuelle Kurse**
- Section-Header: "Aktuelle Kurse" (16px, font-weight 600) + "Alle anzeigen" Link rechts
- Vertikal gestapelte Kurskarten, volle Breite minus 16px Padding
- Jede Kurskarte (siehe Component-Details unten):
  - Kurstitel (16px, font-weight 600)
  - Dozent + Raum in einer Zeile (14px, muted)
  - Datum-Badge (kompakt, Accent-Hintergrund)
  - Auslastungsbalken mit "X/Y Teilnehmer" Label
  - Tap öffnet Kurs-Detail-View
- Maximal 5 Kurse anzeigen, dann "Alle X Kurse anzeigen" Button

**Section 3: Letzte Anmeldungen**
- Section-Header: "Letzte Anmeldungen" (16px, font-weight 600)
- Kompakte Liste (keine vollen Cards)
- Pro Zeile: Teilnehmername, Kursname (gekürzt), Bezahlt-Badge (grün) oder Offen-Badge (gelb)
- Zeilen haben subtilen Divider
- Tap öffnet Anmeldungs-Detail mit Edit-Möglichkeit
- Maximal 5 Einträge

**Floating Action Button (FAB):**
- Position: unten rechts, 16px vom Rand
- Größe: 56px Durchmesser
- Farbe: Primary (Salbeigrün)
- Icon: Plus-Zeichen, weiß
- Shadow: 0 4px 12px rgba(0,0,0,0.15)
- Tap öffnet "Neue Anmeldung" Dialog

**Bottom Navigation:**
- 4 Tabs: Dashboard (Home-Icon), Kurse, Personen, Einstellungen
- Aktiver Tab: Primary-Farbe, andere: Muted
- Labels unter Icons, 10px Schrift
- Höhe: 64px mit Safe-Area-Padding

### Touch Targets
- Alle tappbaren Elemente mindestens 44x44px
- Kurskarten haben 12px vertikalen Abstand
- FAB hat 56px Durchmesser + 8px Touch-Padding
- Bottom-Nav-Items: gleichmäßig verteilt, ca. 80px breit

---

## 5. Desktop Layout

### Overall Structure
Zwei-Spalten-Layout mit fester Sidebar links (240px) und flexiblem Content-Bereich rechts. Die Sidebar enthält Navigation und Quick-Stats. Der Hauptbereich nutzt ein asymmetrisches Grid: 2/3 für die Kursliste, 1/3 für sekundäre Informationen (letzte Anmeldungen, schnelle Aktionen).

**Auge-Flow:**
1. Quick-Stats in Sidebar (oben) →
2. Kursliste (Hero, größter Bereich) →
3. Sidebar-Navigation →
4. Letzte Anmeldungen (rechte Spalte)

### Section Layout

**Sidebar (240px, fixed left):**
- Logo/App-Name oben: "Kursverwaltung" (24px, font-weight 700)
- Darunter 20px Spacing
- Quick-Stats Block:
  - 3 vertikale Stat-Cards, volle Sidebar-Breite minus Padding
  - Gleicher Inhalt wie Mobile Hero Stats
  - Kompakter: 60px Höhe pro Card
- 32px Spacing
- Navigation:
  - Dashboard, Kurse, Dozenten, Teilnehmer, Räume, Anmeldungen
  - Jeder Nav-Item: 44px Höhe, 12px horizontal Padding
  - Aktiv: Accent-Hintergrund, Primary-Text-Farbe
  - Hover: Muted-Hintergrund
  - Icons links, Label rechts (14px)
- Unten: Einstellungen-Link

**Main Content (flex, min 600px):**
- Header-Zeile:
  - Seiten-Titel "Dashboard" (28px, font-weight 700)
  - Rechts: Primary Action Button "Neue Anmeldung" (nicht FAB, sondern Button)
  - Suchfeld (expandiert bei Fokus)
  - 80px Höhe

- Content Grid (2 Spalten: 2fr 1fr, 24px Gap):

  **Linke Spalte (Kurse):**
  - Section-Header: "Aktuelle & Kommende Kurse" + Filter-Dropdown (Alle/Diese Woche/Dieser Monat)
  - Kurs-Cards im Grid (1 Spalte, vertikal gestapelt)
  - Jede Card breiter als auf Mobile, zeigt mehr Info:
    - Titel, Dozent, Raum, Datum-Range
    - Auslastungsbalken prominent
    - Preis-Badge rechts oben
    - Quick-Actions on Hover (Edit, Teilnehmer anzeigen)
  - Pagination oder "Mehr laden" unten

  **Rechte Spalte (320px min):**
  - Block 1: "Letzte Anmeldungen"
    - Kompakte Liste, 8 Einträge
    - Teilnehmer → Kurs, Datum, Status-Badge
    - "Alle anzeigen" Link

  - Block 2: "Aktionen"
    - Quick-Links: Neuer Kurs, Neuer Teilnehmer, Neuer Dozent
    - Styled als sekundäre Buttons, vertikal gestapelt

### What Appears on Hover
- **Kurs-Cards:** Subtiler Shadow-Erhöhung (elevation von 1 auf 3), Quick-Action-Icons erscheinen (Edit, View Participants)
- **Anmeldungs-Zeilen:** Hintergrund wird leicht Accent-gefärbt, Edit-Icon erscheint rechts
- **Nav-Items:** Muted-Hintergrund
- **Buttons:** Leichte Verdunklung der Hintergrundfarbe

---

## 6. Components

### Hero KPI
Die Kurs-Auslastungsübersicht ist das zentrale Element.

- **Title:** "Aktuelle Kurse"
- **Data source:** `courses` App, gefiltert nach Kursen mit Enddatum >= heute
- **Calculation:** Für jeden Kurs: Anzahl Anmeldungen / max_participants
- **Display:** Liste von Kurs-Cards mit prominentem Auslastungsbalken
- **Context shown:** Prozentzahl der Auslastung, absolute Zahlen (12/20), Farbcodierung
- **Why this is the hero:** Der Verwalter muss sofort sehen, welche Kurse noch Plätze haben und wo er aktiv werden muss (fast volle Kurse bewerben, ausgebuchte Kurse = Warteliste nötig?)

### Secondary KPIs

**Offene Anmeldungen**
- Source: `registrations` App
- Calculation: COUNT where paid = false
- Format: Ganze Zahl
- Display: Stat-Card mit großer Zahl, Warning-Farbe wenn > 5

**Kurse diese Woche**
- Source: `courses` App
- Calculation: COUNT where start_date <= Sonntag dieser Woche AND end_date >= heute
- Format: Ganze Zahl
- Display: Stat-Card, neutral

**Teilnehmer gesamt**
- Source: `participants` App
- Calculation: COUNT all
- Format: Ganze Zahl
- Display: Stat-Card, neutral (nur Desktop-Sidebar)

### Chart
Kein Chart in Version 1. Die Auslastungsbalken in den Kurskarten erfüllen die visuelle Datenrepräsentation. Ein Chart (z.B. Anmeldungen über Zeit) könnte in einer späteren Version hinzugefügt werden.

### Lists/Tables

**Kursliste (Hero-Liste)**
- Purpose: Überblick über alle aktuellen und kommenden Kurse mit Auslastung
- Source: `courses` App, JOIN mit `instructors` (für Dozentname) und `rooms` (für Raumname)
- Fields shown:
  - title (Kurstitel)
  - instructor.name (Dozent)
  - room.name + room.building (Raum)
  - start_date, end_date (Zeitraum)
  - price (Preis in EUR)
  - Berechnetes Feld: current_participants / max_participants (Auslastung)
- Mobile style: Volle-Breite-Cards, gestapelt
- Desktop style: Volle-Breite-Cards, gestapelt, mit mehr Details und Hover-Actions
- Sort: start_date ascending (nächster Kurs zuerst)
- Limit: Mobile 5, Desktop 10, dann Pagination

**Letzte Anmeldungen**
- Purpose: Schneller Überblick über neue Anmeldungen, um unbezahlte zu identifizieren
- Source: `registrations` App, JOIN mit `participants` und `courses`
- Fields shown:
  - participant.name
  - course.title (gekürzt auf 20 Zeichen)
  - registration_date
  - paid (als Badge: "Bezahlt" grün / "Offen" gelb)
- Mobile style: Kompakte Zeilen mit Divider
- Desktop style: Kompakte Zeilen in Card
- Sort: registration_date descending (neueste zuerst)
- Limit: Mobile 5, Desktop 8

**Dozentenliste (eigene Seite)**
- Purpose: Alle Dozenten verwalten
- Source: `instructors` App
- Fields shown: name, email, phone, specialty
- Mobile style: Cards
- Desktop style: Tabelle mit Sortierung
- Sort: name ascending

**Teilnehmerliste (eigene Seite)**
- Purpose: Alle Teilnehmer verwalten
- Source: `participants` App
- Fields shown: name, email, phone, birthdate
- Mobile style: Cards
- Desktop style: Tabelle mit Sortierung und Suche
- Sort: name ascending

**Raumliste (eigene Seite)**
- Purpose: Alle Räume verwalten
- Source: `rooms` App
- Fields shown: name, building, capacity
- Mobile style: Cards
- Desktop style: Tabelle
- Sort: building, then name

### Primary Action Button (REQUIRED!)

- **Label:** "Neue Anmeldung" (Desktop: Button) / Plus-Icon (Mobile: FAB)
- **Action:** add_record
- **Target app:** `registrations`
- **What data:** Dialog mit Feldern:
  - Teilnehmer auswählen (Dropdown mit Suche, aus `participants`)
  - Oder: "Neuen Teilnehmer anlegen" Link → öffnet verschachtelten Dialog
  - Kurs auswählen (Dropdown, aus `courses`, nur mit freien Plätzen)
  - Anmeldedatum (default: heute)
  - Bezahlt (Checkbox, default: false)
- **Mobile position:** FAB (bottom_fixed, rechts)
- **Desktop position:** Header, rechts neben Suchfeld
- **Why this action:** Das Erfassen von Anmeldungen ist die häufigste Aktion. Teilnehmer rufen an oder kommen vorbei, der Verwalter muss schnell eine Anmeldung anlegen können.

### CRUD Requirements

**Courses (Kurse):**
- **Create:** "Neuer Kurs" Button auf Kurse-Seite, öffnet Dialog mit allen Feldern
- **Read:** Kursliste auf Dashboard und Kurse-Seite, Kurs-Detail-View bei Tap/Click
- **Update:** Edit-Button in Kurs-Detail oder Hover-Action, öffnet vorausgefüllten Dialog
- **Delete:** Delete-Button in Kurs-Detail mit Bestätigungs-Dialog ("Kurs und alle Anmeldungen löschen?")

**Instructors (Dozenten):**
- **Create:** "Neuer Dozent" Button auf Dozenten-Seite
- **Read:** Dozentenliste, Dozent-Detail bei Tap/Click
- **Update:** Edit-Button in Detail-View
- **Delete:** Delete-Button mit Bestätigung (Warnung wenn Dozent Kursen zugeordnet)

**Participants (Teilnehmer):**
- **Create:** "Neuer Teilnehmer" Button auf Teilnehmer-Seite ODER inline beim Erstellen einer Anmeldung
- **Read:** Teilnehmerliste mit Suche, Detail-View mit Anmeldungshistorie
- **Update:** Edit-Button in Detail-View
- **Delete:** Delete-Button mit Bestätigung (Warnung wenn aktive Anmeldungen)

**Rooms (Räume):**
- **Create:** "Neuer Raum" Button auf Räume-Seite
- **Read:** Raumliste
- **Update:** Edit-Button
- **Delete:** Delete-Button mit Bestätigung (Warnung wenn Kursen zugeordnet)

**Registrations (Anmeldungen):**
- **Create:** Primary Action Button (FAB/Header-Button)
- **Read:** Anmeldungsliste auf Dashboard und eigener Seite, Detail-View
- **Update:** Inline-Toggle für "Bezahlt" Status, vollständiger Edit-Dialog für andere Felder
- **Delete:** Delete-Button mit Bestätigung

---

## 7. Visual Details

### Border Radius
- **Cards:** 12px (rounded, modern aber nicht zu verspielt)
- **Buttons:** 8px
- **Input-Felder:** 8px
- **Badges/Tags:** 6px
- **FAB:** 50% (Kreis)
- **Auslastungsbalken:** 4px (subtle)

### Shadows
Subtile, warme Schatten für Tiefe ohne Härte:
- **Cards (ruhe):** `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)`
- **Cards (hover):** `0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)`
- **FAB:** `0 4px 12px rgba(0,0,0,0.15)`
- **Dialoge/Modals:** `0 8px 30px rgba(0,0,0,0.12)`

### Spacing
- **Page Padding:** Mobile 16px, Desktop 24px
- **Card Padding:** 16px
- **Section Gap:** 24px (Mobile), 32px (Desktop)
- **Element Gap in Cards:** 8px vertikal
- **Grid Gap:** 16px (Mobile), 24px (Desktop)

### Animations
- **Page load:** Fade-in (200ms) + subtle slide-up (10px)
- **Card erscheinen:** Stagger-Animation wenn Liste lädt (50ms Verzögerung pro Item)
- **Hover effects:** Transition 150ms ease-out für Shadow und Background
- **Tap feedback:** Scale 0.98 kurz (100ms), dann zurück
- **Dialog öffnen:** Fade-in Backdrop (150ms), Dialog slide-up + fade (200ms)
- **Auslastungsbalken:** Animiert von 0 auf Zielwert (400ms, ease-out)

---

## 8. CSS Variables (Copy Exactly!)

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --background: hsl(40 33% 98%);
  --foreground: hsl(220 20% 18%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(220 20% 18%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(220 20% 18%);
  --primary: hsl(152 35% 42%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(40 20% 96%);
  --secondary-foreground: hsl(220 20% 18%);
  --muted: hsl(40 20% 96%);
  --muted-foreground: hsl(220 10% 50%);
  --accent: hsl(152 30% 94%);
  --accent-foreground: hsl(152 35% 30%);
  --destructive: hsl(0 65% 50%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(40 20% 90%);
  --input: hsl(40 20% 90%);
  --ring: hsl(152 35% 42%);
  --radius: 12px;

  /* Custom additions */
  --warning: hsl(38 92% 50%);
  --warning-foreground: hsl(38 92% 20%);
  --success: hsl(152 50% 40%);
  --success-foreground: hsl(0 0% 100%);
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
}
```

---

## 9. Data Model

### Summary
Das Kursverwaltungssystem benötigt 5 verbundene Apps: Dozenten und Räume als Stammdaten, Kurse als Kernentität (referenziert Dozent und Raum), Teilnehmer als Stammdaten, und Anmeldungen als Verknüpfung zwischen Teilnehmern und Kursen.

### Apps (Tables)

#### App: instructors
- **Name:** Dozenten
- **Purpose:** Speichert alle Dozenten/Kursleiter mit Kontaktdaten
- **UI Components:** Dozenten-Dropdown in Kurs-Formular, Dozentenliste, Dozenten-Detail
- **Fields:**
  - `name` (string/text): Vollständiger Name des Dozenten [required]
  - `email` (string/email): E-Mail-Adresse [required]
  - `phone` (string/text): Telefonnummer [optional]
  - `specialty` (string/text): Fachgebiet/Spezialisierung [optional]

#### App: rooms
- **Name:** Räume
- **Purpose:** Speichert alle verfügbaren Räume/Veranstaltungsorte
- **UI Components:** Raum-Dropdown in Kurs-Formular, Raumliste
- **Fields:**
  - `name` (string/text): Raumbezeichnung, z.B. "Seminarraum 1" [required]
  - `building` (string/text): Gebäude/Standort, z.B. "Hauptgebäude" [required]
  - `capacity` (number): Maximale Personenkapazität [required]

#### App: participants
- **Name:** Teilnehmer
- **Purpose:** Speichert alle Kursteilnehmer mit Kontaktdaten
- **UI Components:** Teilnehmer-Dropdown in Anmeldungs-Formular, Teilnehmerliste, Teilnehmer-Detail
- **Fields:**
  - `name` (string/text): Vollständiger Name [required]
  - `email` (string/email): E-Mail-Adresse [required]
  - `phone` (string/text): Telefonnummer [optional]
  - `birthdate` (date/date): Geburtsdatum [optional]

#### App: courses
- **Name:** Kurse
- **Purpose:** Speichert alle Kurse mit Details, verknüpft mit Dozent und Raum
- **UI Components:** Kursliste (Hero), Kurs-Dropdown in Anmeldungs-Formular, Kurs-Detail
- **Fields:**
  - `title` (string/text): Kurstitel [required]
  - `description` (string/textarea): Ausführliche Kursbeschreibung [optional]
  - `start_date` (date/date): Startdatum des Kurses [required]
  - `end_date` (date/date): Enddatum des Kurses [required]
  - `max_participants` (number): Maximale Teilnehmerzahl [required]
  - `price` (number): Kurspreis in EUR [required]
  - `instructor` (applookup/select): Referenz auf Dozent [required]
  - `room` (applookup/select): Referenz auf Raum [required]

#### App: registrations
- **Name:** Anmeldungen
- **Purpose:** Verknüpft Teilnehmer mit Kursen, speichert Anmeldestatus
- **UI Components:** Anmeldungsliste, Anmeldungs-Dialog (Primary Action), Inline-Bezahlt-Toggle
- **Fields:**
  - `participant` (applookup/select): Referenz auf Teilnehmer [required]
  - `course` (applookup/select): Referenz auf Kurs [required]
  - `registration_date` (date/date): Datum der Anmeldung [required]
  - `paid` (bool): Wurde die Kursgebühr bezahlt? [required, default: false]

### Relationships
- courses.instructor → instructors (many-to-one: viele Kurse können denselben Dozenten haben)
- courses.room → rooms (many-to-one: viele Kurse können im selben Raum stattfinden)
- registrations.participant → participants (many-to-one: ein Teilnehmer kann mehrere Anmeldungen haben)
- registrations.course → courses (many-to-one: ein Kurs kann viele Anmeldungen haben)

### JSON Schema

```json
{
  "apps": [
    {
      "name": "Dozenten",
      "identifier": "instructors",
      "controls": {
        "name": {
          "fulltype": "string/text",
          "label": "Name",
          "required": true,
          "in_list": true
        },
        "email": {
          "fulltype": "string/email",
          "label": "E-Mail",
          "required": true,
          "in_list": true
        },
        "phone": {
          "fulltype": "string/text",
          "label": "Telefon",
          "required": false,
          "in_list": true
        },
        "specialty": {
          "fulltype": "string/text",
          "label": "Fachgebiet",
          "required": false,
          "in_list": true
        }
      }
    },
    {
      "name": "Räume",
      "identifier": "rooms",
      "controls": {
        "name": {
          "fulltype": "string/text",
          "label": "Raumname",
          "required": true,
          "in_list": true
        },
        "building": {
          "fulltype": "string/text",
          "label": "Gebäude",
          "required": true,
          "in_list": true
        },
        "capacity": {
          "fulltype": "number",
          "label": "Kapazität",
          "required": true,
          "in_list": true
        }
      }
    },
    {
      "name": "Teilnehmer",
      "identifier": "participants",
      "controls": {
        "name": {
          "fulltype": "string/text",
          "label": "Name",
          "required": true,
          "in_list": true
        },
        "email": {
          "fulltype": "string/email",
          "label": "E-Mail",
          "required": true,
          "in_list": true
        },
        "phone": {
          "fulltype": "string/text",
          "label": "Telefon",
          "required": false,
          "in_list": true
        },
        "birthdate": {
          "fulltype": "date/date",
          "label": "Geburtsdatum",
          "required": false,
          "in_list": true
        }
      }
    },
    {
      "name": "Kurse",
      "identifier": "courses",
      "controls": {
        "title": {
          "fulltype": "string/text",
          "label": "Kurstitel",
          "required": true,
          "in_list": true
        },
        "description": {
          "fulltype": "string/textarea",
          "label": "Beschreibung",
          "required": false,
          "in_list": false
        },
        "start_date": {
          "fulltype": "date/date",
          "label": "Startdatum",
          "required": true,
          "in_list": true
        },
        "end_date": {
          "fulltype": "date/date",
          "label": "Enddatum",
          "required": true,
          "in_list": true
        },
        "max_participants": {
          "fulltype": "number",
          "label": "Max. Teilnehmer",
          "required": true,
          "in_list": true
        },
        "price": {
          "fulltype": "number",
          "label": "Preis (EUR)",
          "required": true,
          "in_list": true
        },
        "instructor": {
          "fulltype": "applookup/select",
          "label": "Dozent",
          "required": true,
          "in_list": true,
          "lookup_app_ref": "instructors"
        },
        "room": {
          "fulltype": "applookup/select",
          "label": "Raum",
          "required": true,
          "in_list": true,
          "lookup_app_ref": "rooms"
        }
      }
    },
    {
      "name": "Anmeldungen",
      "identifier": "registrations",
      "controls": {
        "participant": {
          "fulltype": "applookup/select",
          "label": "Teilnehmer",
          "required": true,
          "in_list": true,
          "lookup_app_ref": "participants"
        },
        "course": {
          "fulltype": "applookup/select",
          "label": "Kurs",
          "required": true,
          "in_list": true,
          "lookup_app_ref": "courses"
        },
        "registration_date": {
          "fulltype": "date/date",
          "label": "Anmeldedatum",
          "required": true,
          "in_list": true
        },
        "paid": {
          "fulltype": "bool",
          "label": "Bezahlt",
          "required": true,
          "in_list": true
        }
      }
    }
  ]
}
```

---

## 10. Implementation Checklist

The implementer should verify:

### Setup
- [ ] Font "Plus Jakarta Sans" loaded from Google Fonts URL
- [ ] All CSS variables copied exactly from Section 8 into `src/index.css`
- [ ] Border radius set to 12px globally

### Layout
- [ ] Mobile layout matches Section 4 exactly
- [ ] Desktop layout matches Section 5 exactly (Sidebar + 2-column main)
- [ ] FAB positioned correctly on mobile (bottom right, 16px margin)
- [ ] Bottom navigation with 4 tabs on mobile
- [ ] Sidebar with navigation and stats on desktop

### Visual Design
- [ ] Hero element (Kursliste mit Auslastung) is prominent
- [ ] Auslastungsbalken in Kurskarten animated and color-coded
- [ ] Warm off-white background (`hsl(40 33% 98%)`)
- [ ] Salbeigrün accent color used consistently
- [ ] Shadows are subtle and warm
- [ ] Typography hierarchy clear (weight 300-700 range used)

### Data
- [ ] All 5 apps created as Living Apps in correct order (instructors, rooms, participants, courses, registrations)
- [ ] All fields match JSON schema exactly
- [ ] References (applookup) working correctly

### Interactivity
- [ ] Primary Action Button "Neue Anmeldung" works
- [ ] Full CRUD for all 5 entities
- [ ] Bezahlt-Toggle inline editable
- [ ] Search functionality on Desktop
- [ ] Filter for Kursliste

### Responsive
- [ ] Mobile breakpoint handled (< 768px)
- [ ] Desktop sidebar collapses or hides on tablet
- [ ] Touch targets minimum 44x44px on mobile
