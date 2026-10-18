// The one function every example uses to talk to a model through OpenRouter.
// It sends a prompt and returns OpenRouter's whole JSON reply, so you can see
// everything that comes back (the text, token counts and cost).

const MODEL = 'google/gemini-2.5-flash-lite';
const IMAGE_MODEL = 'google/gemini-2.5-flash-image';
const USAGE_STORAGE_KEY = 'prog02-openrouter-usage';
const activeRequests = new Map();
let requestSequence = 0;
let usage = loadUsage();
let lastModel = usage.model || MODEL;

function loadUsage() {
  try {
    const stored = sessionStorage.getItem(USAGE_STORAGE_KEY);
    if (!stored) return { totalCost: 0, unreportedCalls: 0, model: null };

    const parsed = JSON.parse(stored);
    return {
      totalCost:
        typeof parsed.totalCost === 'number' && Number.isFinite(parsed.totalCost)
          ? parsed.totalCost
          : 0,
      unreportedCalls:
        Number.isInteger(parsed.unreportedCalls) && parsed.unreportedCalls >= 0
          ? parsed.unreportedCalls
          : 0,
      model: typeof parsed.model === 'string' && parsed.model ? parsed.model : null,
    };
  } catch (error) {
    console.warn('Could not restore this tab’s AI usage total.', error);
    return { totalCost: 0, unreportedCalls: 0, model: null };
  }
}

function getUsageSnapshot() {
  const activeModels = [...activeRequests.values()];
  return {
    model: activeModels.at(-1) || lastModel || MODEL,
    totalCost: usage.totalCost,
    unreportedCalls: usage.unreportedCalls,
  };
}

function publishUsage() {
  const snapshot = getUsageSnapshot();
  globalThis.dispatchEvent(new CustomEvent('prog02:ai-usage', { detail: snapshot }));
}

function saveUsage() {
  try {
    sessionStorage.setItem(
      USAGE_STORAGE_KEY,
      JSON.stringify({
        totalCost: usage.totalCost,
        unreportedCalls: usage.unreportedCalls,
        model: lastModel,
      }),
    );
  } catch (error) {
    console.warn('Could not save this tab’s AI usage total.', error);
  }
}

function startRequest(model) {
  const requestId = ++requestSequence;
  activeRequests.set(requestId, model);
  lastModel = model;
  saveUsage();
  publishUsage();
  return requestId;
}

function finishRequest(requestId) {
  activeRequests.delete(requestId);
  publishUsage();
}

function recordUsage(data) {
  const reportedCost = data?.usage?.cost;
  const cost =
    typeof reportedCost === 'number' || typeof reportedCost === 'string'
      ? Number(reportedCost)
      : Number.NaN;
  if (Number.isFinite(cost) && cost >= 0) {
    usage.totalCost += cost;
  } else {
    usage.unreportedCalls += 1;
  }
  if (typeof data?.model === 'string' && data.model) lastModel = data.model;

  saveUsage();
  publishUsage();
}

async function askModel(prompt) {
  await globalThis.openRouterConfigReady;
  const apiKey = getApiKey();
  const requestId = startRequest(MODEL);
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    if (data.usage) recordUsage(data);
    if (!response.ok) throw new Error(data.error?.message || response.statusText);
    if (!data.usage) recordUsage(data);
    return data;
  } finally {
    finishRequest(requestId);
  }
}

async function generateImage(prompt) {
  await globalThis.openRouterConfigReady;
  const apiKey = getApiKey();
  const requestId = startRequest(IMAGE_MODEL);
  try {
    const response = await fetch('https://openrouter.ai/api/v1/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt,
        n: 1,
        aspect_ratio: '3:2',
      }),
    });

    const data = await response.json();
    if (data.usage) recordUsage(data);
    if (!response.ok) throw new Error(data.error?.message || response.statusText);
    if (!data.usage) recordUsage(data);

    const image = data.data?.[0];
    if (!image?.b64_json) throw new Error('The image model returned no image data.');

    return {
      src: `data:${image.media_type || 'image/png'};base64,${image.b64_json}`,
      mediaType: image.media_type || 'image/png',
      base64: image.b64_json,
      cost: data.usage?.cost,
      raw: data,
    };
  } finally {
    finishRequest(requestId);
  }
}

function getApiKey() {
  if (
    typeof OPENROUTER_API_KEY === 'undefined' ||
    OPENROUTER_API_KEY.startsWith('YOUR_')
  ) {
    throw new Error(
      'No API key. Copy js/config.local.example.js to js/config.local.js and paste your key in.',
    );
  }

  return OPENROUTER_API_KEY;
}

globalThis.prog02OpenRouter = {
  askModel,
  generateImage,
  getUsageSnapshot,
  usageEventName: 'prog02:ai-usage',
};
