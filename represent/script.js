const TOPICS = [
  {
    id: 'taxes',
    label: 'My Taxes',
    covers: 'taxes, fees, public funds, revenue, bonds, and government spending',
    keywords: ['tax', 'taxes', 'taxpayer', 'revenue', 'fund', 'funds', 'funding', 'spending', 'cost', 'costs', 'bond', 'bonds', 'fee', 'fees', 'budget'],
  },
  {
    id: 'home',
    label: 'My Home',
    covers: 'rent, housing costs, owning, renting, and residential property',
    keywords: ['housing', 'home', 'homes', 'homeowner', 'homeowners', 'mortgage', 'mortgages', 'rent', 'rents', 'rental', 'renter', 'renters', 'tenant', 'tenants', 'landlord', 'landlords', 'residential', 'apartment', 'apartments', 'dwelling', 'dwellings'],
  },
  {
    id: 'health-schools',
    label: 'My Health and Schools',
    covers: 'health care, families, children, schools, and education',
    keywords: ['health', 'healthcare', 'medical', 'doctor', 'doctors', 'hospital', 'hospitals', 'clinic', 'clinics', 'school', 'schools', 'education', 'student', 'students', 'teacher', 'teachers', 'child', 'children', 'family', 'families'],
  },
  {
    id: 'neighborhood',
    label: 'My Neighborhood',
    covers: 'local services, public works, environment, water, streets, roads, and parks',
    keywords: ['local', 'city', 'county', 'service', 'services', 'environment', 'environmental', 'water', 'road', 'roads', 'street', 'streets', 'park', 'parks', 'transportation', 'transit', 'infrastructure', 'community', 'communities'],
  },
  {
    id: 'vote',
    label: 'My Vote and My Say',
    covers: 'elections, voting power, representation, public participation, and local control',
    keywords: ['vote', 'votes', 'voter', 'voters', 'voting', 'election', 'elections', 'campaign', 'campaigns', 'candidate', 'candidates', 'ballot', 'majority', 'approval', 'democracy', 'public', 'petition'],
  },
];

const READING_MODES = {
  'as-written': { label: 'As written', target: 'the certified legal text, untouched' },
  plain: { label: 'Plain English', target: 'grade 11 to 13, like a newspaper editorial. Keep technical terms, but define them the first time.' },
  everyday: { label: 'Everyday', target: 'grade 7 to 9. Use short sentences, common words, and define anything technical.' },
  simplest: { label: 'Simplest', target: 'grade 3 to 4. Use an elementary-school explanation with a relatable narrative, without dropping important qualifiers.' },
};

const LENGTH_MODES = {
  headline: '25 words or fewer',
  short: '75 to 100 words',
  standard: '250 to 300 words',
  complete: 'no cap. Cover every important provision in plain language',
};

let pack;
let currentMeasure;
let currentTopic = TOPICS[0];
let sessionCost = 0;

const $ = (id) => document.getElementById(id);

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindNavigation();
  bindActions();

  const response = await fetch('data/datapack.json');
  pack = await response.json();

  populateMeasures();
  populateOffices();
  updateMeasure();
  updateOfficeIntro();
}

function bindNavigation() {
  document.querySelectorAll('.nav-link').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach((nav) => nav.classList.remove('active'));
      document.querySelectorAll('.view').forEach((view) => view.classList.remove('active'));
      button.classList.add('active');
      $(button.dataset.view).classList.add('active');
    });
  });
}

function bindActions() {
  $('measureSelect').addEventListener('change', updateMeasure);
  $('readingSelect').addEventListener('change', updateRenderWarning);
  $('lengthSelect').addEventListener('change', updateRenderWarning);
  $('renderMeasure').addEventListener('click', renderMeasure);
  $('explainTopic').addEventListener('click', explainTopic);
  $('extractClaims').addEventListener('click', extractClaims);
  $('officeSelect').addEventListener('change', updateOfficeIntro);
  $('explainOffice').addEventListener('click', explainOffice);
  $('generateImage').addEventListener('click', generateOfficeImage);
}

function populateMeasures() {
  const menu = $('measureSelect');
  menu.replaceChildren();
  for (const measure of pack.measures) {
    menu.add(new Option(`${measure.label} (${measure.wordCount.toLocaleString()} words)`, measure.id));
  }
}

function populateOffices() {
  const menu = $('officeSelect');
  menu.replaceChildren();
  for (const office of pack.offices) {
    menu.add(new Option(office.name, office.id));
  }
}

function updateMeasure() {
  currentMeasure = pack.measures.find((measure) => measure.id === $('measureSelect').value);
  $('legalTextLink').href = currentMeasure.sources.legalTextPdf;
  $('officialSummary').textContent = currentMeasure.official.summaryFull || currentMeasure.official.summary;
  $('argumentDisclaimer').textContent = pack.meta.argumentDisclaimer;
  updateStats();
  updateTopicBars();
  updateSignerSummary();
  updateRenderWarning();
}

function updateStats(text = operativeText(currentMeasure.fullText), label = 'Original') {
  const fk = fleschKincaid(text);
  const official = fleschKincaid(currentMeasure.official.summary);
  $('measureStats').innerHTML = `
    <div class="stat"><span>Measure</span><strong>${escapeHtml(currentMeasure.label)}</strong></div>
    <div class="stat"><span>${escapeHtml(label)} reading level</span><strong>Grade ${fk.grade ?? 'n/a'}</strong></div>
    <div class="stat"><span>${escapeHtml(label)} words</span><strong>${fk.words.toLocaleString()}</strong></div>
    <div class="stat"><span>Official summary grade</span><strong>Grade ${official.grade ?? 'n/a'}</strong></div>
  `;
}

function updateRenderWarning() {
  const reading = $('readingSelect').value;
  const length = $('lengthSelect').value;
  const warning = $('renderWarning');
  const notes = [];

  if (reading === 'as-written' && length !== 'complete') {
    notes.push('As written means the certified text is untouched, so the length control will be ignored.');
  }
  if (reading === 'simplest' && length === 'headline') {
    notes.push('Simplest + Headline is likely to drop important qualifiers. This app lets it run, but treats the result as risky.');
  }
  if ((currentMeasure?.wordCount || 0) > 10000 && reading !== 'as-written') {
    notes.push(`${currentMeasure.label} is long, so this call may be slower and more expensive.`);
  }

  warning.textContent = notes.join(' ');
  warning.hidden = notes.length === 0;
}

async function renderMeasure() {
  const reading = $('readingSelect').value;
  const length = $('lengthSelect').value;

  if (reading === 'as-written') {
    const text = operativeText(currentMeasure.fullText);
    $('renderLabel').textContent = 'Certified text';
    $('renderSource').textContent = 'Source: full legal text, no model call';
    $('renderOutput').textContent = text;
    updateStats(text, 'Certified text');
    return;
  }

  const prompt = buildRenderPrompt(currentMeasure, reading, length);
  await runTextCall({
    button: $('renderMeasure'),
    output: $('renderOutput'),
    waitingText: 'Waiting for the model to render this measure...',
    prompt,
    onText: (text, data) => {
      $('renderLabel').textContent = 'AI-generated rendering';
      $('renderSource').textContent = `Source: ${currentMeasure.label} full legal text | model ${data.model}`;
      updateStats(text, 'Generated');
    },
  });
}

function buildRenderPrompt(measure, reading, length) {
  return `Render this California ballot measure for a voter.

Rules:
- Use ONLY the full legal text below.
- Do not use the official title or official summary.
- Text marked [DELETED: ...] is being removed from the law.
- Preserve important qualifiers such as temporary, one-time, may, must, and exceptions.
- Label the answer as AI-generated.
- Do not tell the voter how to vote.

Reading target: ${READING_MODES[reading].target}
Length target: ${LENGTH_MODES[length]}

${measure.label} full legal text:
${measure.fullText}`;
}

function updateTopicBars() {
  const counts = TOPICS.map((topic) => ({ topic, count: countTopicHits(currentMeasure.fullText, topic.keywords) }));
  const total = counts.reduce((sum, item) => sum + item.count, 0);

  $('topicBars').innerHTML = counts.map(({ topic, count }) => {
    const percent = total ? (count / total) * 100 : 0;
    return `
    <button class="topic-card ${topic.id === currentTopic.id ? 'active' : ''}" type="button" data-topic="${topic.id}" aria-pressed="${topic.id === currentTopic.id}" aria-label="${escapeHtml(topic.label)}: ${percent.toFixed(1)}% of total keyword hits, ${count} keyword ${count === 1 ? 'hit' : 'hits'}">
      <span class="topic-name">${escapeHtml(topic.label)}</span>
      <span class="bar" aria-hidden="true" style="--share: ${percent}%">
        <span class="bar-fill"></span>
        <span class="bar-percent">${percent.toFixed(1)}%</span>
      </span>
    </button>
  `;
  }).join('');

  document.querySelectorAll('.topic-card').forEach((card) => {
    card.addEventListener('click', () => {
      currentTopic = TOPICS.find((topic) => topic.id === card.dataset.topic);
      updateTopicBars();
    });
  });
}

function countTopicHits(text, keywords) {
  const lower = operativeText(text).toLowerCase();
  return keywords.reduce((sum, keyword) => {
    const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'g');
    return sum + (lower.match(pattern) || []).length;
  }, 0);
}

async function explainTopic() {
  const prompt = `A voter wants to know what this California ballot measure means for one topic: "${currentTopic.label}".
The topic covers: ${currentTopic.covers}.

Answer in two parts, in plain English for an ordinary voter.
Part 1, "What the text says": up to 3 points about this topic, using ONLY the legal text below. After each point, quote the exact words from the text it comes from.
Part 2, "AI opinion": in under 80 words, your own view of whether this measure looks good, bad, or mixed for this topic, and why. Clearly label this as an opinion. Do not tell the voter how to vote.
If the text says little about this topic, say so instead of stretching.
Text marked [DELETED: ...] is being removed from the law.

${currentMeasure.label} full legal text:
${currentMeasure.fullText}`;

  await runTextCall({
    button: $('explainTopic'),
    output: $('topicOutput'),
    waitingText: `Looking for ${currentTopic.label} in ${currentMeasure.label}...`,
    prompt,
  });
}

function updateSignerSummary() {
  const yes = getSignersBySide('yes');
  const no = getSignersBySide('no');
  const overlaps = findOrganizationOverlaps(yes, no);

  $('signerSummary').innerHTML = `
    <div class="signer-card">
      <h3>Yes side signers</h3>
      <ul>${yes.slice(0, 5).map(formatSigner).join('')}</ul>
    </div>
    <div class="signer-card">
      <h3>No side signers</h3>
      <ul>${no.slice(0, 5).map(formatSigner).join('')}</ul>
    </div>
    <div class="signer-card">
      <h3>Organization overlap</h3>
      <p>${overlaps.length ? escapeHtml(overlaps.join(', ')) : 'No exact organization overlap found in signer data.'}</p>
    </div>
  `;
}

function getSignersBySide(side) {
  return Object.values(currentMeasure.arguments)
    .filter((argument) => argument.side === side)
    .flatMap((argument) => argument.signers || []);
}

function formatSigner(signer) {
  const org = signer.organization ? ` / ${signer.organization}` : '';
  return `<li>${escapeHtml(signer.name || signer.raw)}${escapeHtml(org)}</li>`;
}

function findOrganizationOverlaps(yes, no) {
  const yesOrgs = new Set(yes.map((s) => normalizeOrg(s.organization)).filter(Boolean));
  const overlaps = no
    .map((s) => s.organization)
    .filter((org) => yesOrgs.has(normalizeOrg(org)));
  return [...new Set(overlaps)];
}

function normalizeOrg(org = '') {
  return org.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function extractClaims() {
  const args = currentMeasure.arguments;
  const prompt = `Extract a neutral comparison from these official ballot arguments and rebuttals.

Return ONLY valid JSON. No markdown.
Use this shape:
{
  "dimensions": [
    {
      "dimension": "short label",
      "yes": {"claim": "what the YES side claims, or Not mentioned", "status": "raised|disputed|not mentioned"},
      "no": {"claim": "what the NO side claims, or Not mentioned", "status": "raised|disputed|not mentioned"}
    }
  ]
}

Rules:
- Include at least four dimensions.
- Distinguish a side disputing a point from a side never raising it.
- Do not decide who is correct.
- Use only the text below.

Argument in favor:
${args.argumentInFavor.text}

Rebuttal to argument in favor:
${args.rebuttalToFavor.text}

Argument against:
${args.argumentAgainst.text}

Rebuttal to argument against:
${args.rebuttalToAgainst.text}`;

  await runTextCall({
    button: $('extractClaims'),
    output: $('claimsOutput'),
    waitingText: 'Extracting structured claims...',
    prompt,
    onText: (text) => {
      const parsed = parseJsonFromModel(text);
      if (!parsed?.dimensions) return;
      $('claimsOutput').innerHTML = renderClaimsTable(parsed.dimensions);
    },
  });
}

function renderClaimsTable(dimensions) {
  return `
    <table class="claims-table">
      <thead>
        <tr>
          <th>Dimension</th>
          <th>Yes side</th>
          <th>No side</th>
        </tr>
      </thead>
      <tbody>
        ${dimensions.map((row) => `
          <tr>
            <td>${escapeHtml(row.dimension || '')}</td>
            <td><strong>${escapeHtml(row.yes?.status || '')}</strong><br>${escapeHtml(row.yes?.claim || '')}</td>
            <td><strong>${escapeHtml(row.no?.status || '')}</strong><br>${escapeHtml(row.no?.claim || '')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function updateOfficeIntro() {
  const office = selectedOffice();
  const context = (office.additionalContext || []).map((item) => item.fact).join(' ');
  $('officeOutput').textContent = `${office.name}\n${office.jurisdiction}\n\n${office.description}${context ? `\n\nBoundary notes: ${context}` : ''}`;
  $('imageOutput').textContent = 'Generate one image after the prompt feels settled.';
}

async function explainOffice() {
  const office = selectedOffice();
  const prompt = buildOfficePrompt(office);

  await runTextCall({
    button: $('explainOffice'),
    output: $('officeOutput'),
    waitingText: `Explaining ${office.name}...`,
    prompt,
  });
}

function buildOfficePrompt(office) {
  return `Explain this down-ballot office for an ordinary voter.

Use only the description and notes below. Do not invent authority.
Answer with:
1. What it controls
2. What it does not control
3. One concrete example of how it could affect daily life

Office: ${office.name}
Jurisdiction: ${office.jurisdiction}
Description: ${office.description}
Additional notes: ${JSON.stringify(office.additionalContext || [])}
Source: ${office.source}`;
}

async function generateOfficeImage() {
  const office = selectedOffice();
  const button = $('generateImage');
  const output = $('imageOutput');
  const styles = {
    photorealistic: 'Photorealistic photography with natural lighting, realistic materials, and lifelike detail.',
    bosch: "Render in the style of Bosch's Temptation of Saint Anthony.",
    cartoon: 'Cartoon illustration with bold outlines, flat colors, playful shapes, and simple expressive details.',
    pixar: 'Pixar-style 3D animation with rounded shapes, expressive designs, rich colors, and soft cinematic lighting.',
  };
  const style = styles[$('imageStyleSelect').value];
  const prompt = `Create a civic illustration for a class voter guide about the ${office.name} in ${office.jurisdiction}.
Show one ordinary local situation this office could affect, based on this description: ${office.description}
Style: ${style}
Rules: no real people, no candidates, no official seals, no ballot markings, no campaign signs, no text in the image, no recognizable individuals.`;

  button.disabled = true;
  output.textContent = 'Drawing... this can take 10 to 20 seconds.';
  try {
    const response = await fetch('https://openrouter.ai/api/v1/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENROUTER_API_KEY,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        prompt,
        n: 1,
        aspect_ratio: '3:2',
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || response.statusText);

    addCost(data.usage?.cost);
    const image = data.data[0];
    const img = document.createElement('img');
    img.src = `data:${image.media_type || 'image/png'};base64,${image.b64_json}`;
    img.alt = `AI-generated illustration for ${office.name}`;
    output.replaceChildren(img);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
  button.disabled = false;
}

function selectedOffice() {
  return pack.offices.find((office) => office.id === $('officeSelect').value);
}

async function runTextCall({ button, output, waitingText, prompt, onText }) {
  button.disabled = true;
  output.textContent = waitingText;
  try {
    const data = await askModel(prompt);
    const text = data.choices[0].message.content;
    output.textContent = text;
    addCost(data.usage?.cost);
    if (onText) onText(text, data);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
  button.disabled = false;
}

function addCost(cost) {
  const amount = Number(cost || 0);
  sessionCost += amount;
  $('sessionCost').textContent = `$${sessionCost.toFixed(4)}`;
}

function parseJsonFromModel(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (err) {
      return null;
    }
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
