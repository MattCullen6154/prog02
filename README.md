# PROG 02 API examples (CS160)

Small, runnable examples of calling a language model on the Nov 3, 2026 California ballot measures.
Each example is one HTML page plus one short JS file. The page shows the exact prompt it sends,
the model's answer, and OpenRouter's full JSON reply (tokens and cost included).

> Class examples. Not official voter information.

## Run it

### Measure screen

Install the front-end dependencies and start the React app:

```bash
npm install
npm run dev
```

The Explain an Office page uses the shared OpenRouter setup for its explainer and illustration
buttons. Configure `js/config.local.js` as described below to enable generation.

The existing standalone API examples are still available under `examples/`.

### API examples

1. Copy `js/config.local.example.js` to `js/config.local.js` and paste your OpenRouter key in.
   Keep your key private: don't share or hand in `js/config.local.js`.
2. Serve the folder (browsers block `fetch()` from `file://`):

   ```bash
   python3 -m http.server 8000
   ```

3. Open http://localhost:8000

## Files

| file | what it is |
|---|---|
| `js/openrouter.js` | `askModel(prompt)`: the one function that calls the API. The model is set at the top. |
| `examples/01-summarize.*` | Pick a measure and a length; the model summarizes the legal text. |
| `js/fk.js` | Flesch–Kincaid reading level (no AI). |
| `examples/02-reading-level.*` | Compute a measure's reading level. No AI. |
| `examples/03-spending.*` | Ask OpenRouter how much your key has spent (`GET /api/v1/key`). Free. |
| `examples/04-reading-level-rewrite.*` | The model rewrites a measure for a chosen grade; `fk.js` checks what grade it actually wrote. |
| `examples/05-topic.*` | The model reads Prop 4 and explains what it means for one topic, "My Taxes": what the text says, then a labelled AI opinion. |
| `examples/06-image.*` | Generate an image from a text prompt (`POST /api/v1/images`). About $0.04 per image. |
| `data/datapack.json` | The ballot measures. Each has `label` (e.g. `"Prop 4"`) and `fullText`, the legal text; words in `[DELETED: ...]` are being removed from the law. `official` holds the state's own summary: show it to people, but don't send it to the model. |
| `pack.offices` (in `datapack.json`) | The five offices on the ballot, from the PROG 02 handout. Not used by these examples yet. |

## Issue-frequency indicators

The measure-generation screen shows five rough issue-frequency indicators: My Neighborhood, My Vote
and My Say, My Home, My Taxes, and My Health and Schools. These are **not AI classifications**.
`src/utils/topicKeywords.js` counts case-insensitive, whole-word keyword and phrase matches in each
measure's operative legal text. The `[DELETED: ...]` spans are removed first because those provisions
are not part of the resulting law. Each bar is scaled against the most-mentioned issue on that measure;
the count is a mention count, not a measure of legal effect or importance.

| Issue | Keywords and why they were selected |
|---|---|
| My Neighborhood | `neighborhood`, `community`, `local services`, `local government`, `road`, `water`, `transit`, `transportation`, `infrastructure`, `park`, `public safety`, `environment`, `climate`, and `air quality` capture local places, services, and environmental infrastructure. |
| My Vote and My Say | `vote`, `voter`, `election`, `campaign`, `candidate`, `ballot`, `public comment`, `public hearing`, `initiative`, `referendum`, `petition`, and `representation` cover voting and common ways people participate in elections and public decisions. |
| My Home | `housing`, `home`, `homeowner`, `mortgage`, `rent`, `rental`, `renter`, `tenant`, `landlord`, `residential`, `apartment`, and `dwelling` cover ownership, housing, and rental relationships. |
| My Taxes | `tax`, `taxpayer`, `taxation`, `revenue`, `fee`, `bond`, `budget`, `fiscal`, `public funding`, and `assessment` cover direct taxes and related public financing terms. |
| My Health and Schools | `health`, `healthcare`, `medical`, `hospital`, `clinic`, `school`, `student`, `teacher`, `education`, `university`, `college`, and `childcare` cover health services and education. |

These hand-selected terms intentionally favor a simple, explainable first signal over comprehensive
legal interpretation. Synonyms and contextual references can be missed, and some matches may be
incidental. A high count does not mean the measure improves or harms that issue. Selecting **Explain**
is a separate, explicit action: only then is an AI request made, using short source excerpts around
that issue's keyword matches. The generated rewrite's reading level is also measured locally with
`js/fk.js` (Flesch–Kincaid) and shown against the requested grade range; this readability score is an
approximation, not a guarantee of comprehension.
