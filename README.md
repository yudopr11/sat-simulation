# SAT Math Simulation — Editing Guide

This app simulates the SAT Math section (Practice Test 11, Digital Format).  
All question and answer data live in two plain JavaScript files that you can edit directly.

---

## Running the App

```bash
npm install      # first time only
npm run dev      # starts dev server at http://localhost:5173
```

**Dev mode** (60-second timers for quick testing):

```
http://localhost:5173/?dev=1
```

---

## Where to Edit Questions and Answers

| Module | File |
|--------|------|
| Module 1 | `src/data/module1.js` |
| Module 2 | `src/data/module2.js` |

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
  figureLabel: 'Figure 1',  // text shown on the button (optional)
}
```

The PDF file must be at `public/sat-practice-test-11-digital-32-51.pdf`.  
Clicking "View Figure" opens the PDF at the specified page in a new browser tab.

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

The navigation bar adapts automatically to `questions.length` — no other changes needed.

- The score display assumes 27 questions per module (shown as `/27` and `/54`).  
  If you change the count, also update those hardcoded labels in `src/components/ResultsScreen.jsx` (line 156–157).

---

## Project Structure

```
sat-simulation/
├── public/
│   ├── sat-practice-test-11-digital-32-51.pdf   ← figures PDF
│   └── answer_key.jpeg                          ← answer key image
└── src/
    ├── data/
    │   ├── module1.js    ← edit Module 1 questions here
    │   └── module2.js    ← edit Module 2 questions here
    └── utils/
        └── validation.js ← grading logic (raw string comparison)
```
