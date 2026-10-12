// The one function every example uses to talk to a model through OpenRouter.
// It sends a prompt and returns OpenRouter's whole JSON reply, so you can see
// everything that comes back (the text, token counts and cost).

const MODEL = 'google/gemini-2.5-flash-lite';
const IMAGE_MODEL = 'google/gemini-2.5-flash-image';

async function askModel(prompt) {
  await globalThis.openRouterConfigReady;
  const apiKey = getApiKey();
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
  if (!response.ok) throw new Error(data.error?.message || response.statusText);
  return data;
}

async function generateImage(prompt) {
  await globalThis.openRouterConfigReady;
  const response = await fetch('https://openrouter.ai/api/v1/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getApiKey(),
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      n: 1,
      aspect_ratio: '3:2',
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || response.statusText);

  const image = data.data?.[0];
  if (!image?.b64_json) throw new Error('The image model returned no image data.');

  return {
    src: `data:${image.media_type || 'image/png'};base64,${image.b64_json}`,
    mediaType: image.media_type || 'image/png',
    base64: image.b64_json,
    cost: data.usage?.cost,
    raw: data,
  };
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

globalThis.prog02OpenRouter = { askModel, generateImage };
