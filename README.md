# SAT Math Simulation

SAT Math section simulator with timed modules, automatic grading, and score reports. Supports Practice Tests 10 and 11 (Digital Format).

## Stack

- **Framework**: React 18 + Vite
- **CSS**: Tailwind CSS v4
- **Math**: KaTeX for LaTeX rendering
- **State**: `useReducer` with localStorage session persistence (80-min expiry)
- **Testing**: Vitest

## Running the App

```bash
npm install      # first time only
npm run dev      # starts dev server at http://localhost:5173
npm test         # run tests
npm run build    # production build
```

**Dev mode** (60-second timers for quick testing):

```
http://localhost:5173/?dev=1
```

---

## Where to Edit Questions and Answers

| Test Set | Module | File |
|----------|--------|------|
| 10 | Module 1 | `src/data/10/module1.js` |
| 10 | Module 2 | `src/data/10/module2.js` |
| 11 | Module 1 | `src/data/11/module1.js` |
| 11 | Module 2 | `src/data/11/module2.js` |

Each file exports an array of 27 question objects.

---

## Question Object Shape

```js
{
  id: 1,                          // display number 1–27 (used for ordering only)
  type: 'mc',                     // 'mc' = multiple choice, 'fr' = short answer
  text: 'Question text with $x^2$ math here.',
  choices: [                      // REQUIRED for 'mc'; set to null for 'fr'
    { label: 'A', text: 'First option $a+b$' },
    { label: 'B', text: 'Second option' },
    { label: 'C', text: 'Third option' },
    { label: 'D', text: 'Fourth option' },
  ],
  answer: 'A',                    // 'mc': correct letter ('A'|'B'|'C'|'D'); 'fr': set to null
  acceptedAnswers: null,          // 'fr': array of accepted raw strings; 'mc': set to null
  hasFigure: false,               // true if this question needs a figure from the PDF
  figurePagePdf: null,            // integer PDF page number (e.g. 3); null if no figure
  figureLabel: null,              // optional label shown on the "View Figure" button
  tableData: null,                // optional table — see "Tables" section below
}
```

---

## Writing Math with LaTeX

Question text and choice text support LaTeX via **KaTeX**.
Wrap math expressions in dollar-sign delimiters:

| Syntax | Renders as | Use for |
|--------|-----------|---------|
| `$x^2 + y^2$` | inline equation | expressions within a sentence |
| `$$\frac{a}{b} = c$$` | centered block equation | standalone equations |

### Common LaTeX Examples

```
Fractions:          $\frac{9}{50}$
Square roots:       $\sqrt{x + 300}$
Exponents:          $8x^2 - 40 = 32$
Subscripts:         $a_1 + a_2$
Absolute value:     $|x - 5|$
Powers of powers:   $x^{\frac{9}{7}}$
Cube root:          $\sqrt[3]{p^2}$
Inequalities:       $x \leq 36$
Greek letters:      $\theta$, $\alpha$, $\pi$
Multiplication dot: $6x \cdot 4y$
```

Full list of supported functions: https://katex.org/docs/supported.html

### Dollar Signs in Text (Currency)

To show a literal `$` (e.g. for prices), escape it with a backslash: `\$`

```js
// Correct — shows "$950" as text, not as math delimiter
text: 'A bus costs \\$950 for the first 3 hours...',
```

### Multi-line / Long Questions

Use a template literal for readability:

```js
text: `In the figure shown, triangle PQR has \\$PQ = QR\\$.
The measure of angle Q is 132°.
What is the value of $x$?`,
```

---

## Multiple Choice Questions

Set `type: 'mc'`, provide all four choices, and set `answer` to the correct letter.

```js
{
  id: 2,
  type: 'mc',
  text: 'Which equation has the same solution as $4x + 1 = 33$?',
  choices: [
    { label: 'A', text: '$4x = 32$' },
    { label: 'B', text: '$4x = 5$' },
    { label: 'C', text: '$4x = 1$' },
    { label: 'D', text: '$4x = -32$' },
  ],
  answer: 'A',
  acceptedAnswers: null,
  hasFigure: false,
  figurePagePdf: null,
  figureLabel: null,
  tableData: null,
}
```

---

## Short Answer (Free Response) Questions

Set `type: 'fr'`, set `choices: null` and `answer: null`, and provide `acceptedAnswers` as an **array of strings**.

Grading uses **exact string matching** (case-insensitive, whitespace trimmed).
If multiple forms are valid (e.g. both decimal and fraction), include all of them.

```js
{
  id: 6,
  type: 'fr',
  text: 'What is the value of $x$ if $10x = 86$?',
  choices: null,
  answer: null,
  acceptedAnswers: ['8.6', '43/5'],   // student must type exactly one of these
  hasFigure: false,
  figurePagePdf: null,
  figureLabel: null,
  tableData: null,
}
```

**Accepted input formats shown to students:** integer, decimal, or fraction (e.g. `3/4` or `1.5`)

### Adding Multiple Valid Answers

```js
acceptedAnswers: ['302.4', '1512/5']   // both forms accepted
acceptedAnswers: ['75']                 // only one form
acceptedAnswers: ['41/81', '.5061', '.5062', '0.5061', '0.5062']  // many forms
```

---

## Figure Questions

Some questions refer to a diagram in the PDF.
Set `hasFigure: true` and `figurePagePdf` to the correct PDF page number.

```js
{
  id: 1,
  type: 'mc',
  text: 'In the figure, triangle PQR has PQ = QR...',
  // ...
  hasFigure: true,
  figurePagePdf: 3,          // opens the PDF at page 3
  figureLabel: 'Figure 1',   // text shown on the button (optional)
}
```

PDF files are per test set:
- `public/10/module_1_10.pdf`, `public/10/module_2_10.pdf`
- `public/11/module_1_11.pdf`, `public/11/module_2_11.pdf`

---

## Tables

If a question includes a data table, add a `tableData` field:

```js
tableData: {
  headers: ['$x$', '$g(x)$'],
  rows: [
    ['1', '32'],
    ['2', '28'],
    ['3', '24'],
    ['4', '20'],
  ],
},
```

Headers and cell values support LaTeX the same as question text.

---

## Adding or Removing Questions

The navigation bar and question count adapt automatically to `questions.length` — no hardcoded values to update.

---

## Project Structure

```
sat-simulation/
├── public/
│   ├── 10/
│   │   ├── module_1_10.pdf       ← Practice Test 10 Module 1 figures
│   │   ├── module_2_10.pdf       ← Practice Test 10 Module 2 figures
│   │   └── answer_key_10.jpeg    ← Practice Test 10 answer key
│   ├── 11/
│   │   ├── module_1_11.pdf       ← Practice Test 11 Module 1 figures
│   │   ├── module_2_11.pdf       ← Practice Test 11 Module 2 figures
│   │   └── answer_key_11.jpeg    ← Practice Test 11 answer key
│   ├── reference.jpeg            ← math reference sheet
│   └── favicon.svg               ← browser tab icon
├── index.html
└── src/
    ├── App.jsx                   ← root component, state machine (useReducer)
    ├── components/
    │   ├── ExamModule.jsx        ← main exam screen (timer + nav + questions)
    │   ├── FigureLink.jsx        ← PDF figure modal
    │   ├── MathText.jsx          ← KaTeX renderer
    │   ├── QuestionNav.jsx       ← question number grid
    │   ├── QuestionRenderer.jsx  ← question display + answer input
    │   ├── ResultsScreen.jsx     ← score report + review
    │   ├── TimerBar.jsx          ← countdown timer
    │   ├── TransitionScreen.jsx  ← module 1→2 interstitial
    │   └── WelcomeScreen.jsx     ← landing page + test set selector
    ├── data/
    │   ├── 10/
    │   │   ├── module1.js        ← Practice Test 10 Module 1 questions
    │   │   └── module2.js        ← Practice Test 10 Module 2 questions
    │   └── 11/
    │       ├── module1.js        ← Practice Test 11 Module 1 questions
    │       └── module2.js        ← Practice Test 11 Module 2 questions
    └── utils/
        ├── scoring.js            ← raw score → SAT scaled score conversion
        └── validation.js         ← grading logic (MC + FR exact match)
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Click question number | Jump to question |
| ← Previous / Next → | Navigate between questions |
