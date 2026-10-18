// Example 6: generate an image from a text prompt.
//
// Images use a different address from the text examples (/api/v1/images, not /chat/completions)
// and a different model. The image comes back as base64 text, which the page turns into an <img>.
// Each image costs about $0.04, much more than a text call.

// ---- 1. The prompts. Try changing them! -------------------------------------
// Two ways to ask for the same scene: a short sentence, and a detailed photographic style.
const PROMPTS = {
  illustration: `A UC Berkeley student thinking about their computer science class.`,

  photo: `Photorealistic documentary photograph, shot on a 35mm lens at eye level in natural light.
Warm, golden California tones with soft contrast and a shallow depth of field.
A candid, unposed everyday moment that feels real of a UC Berkeley student enjoying a day on campus
thinking about their computer science class.
Any people are invented ordinary members of the community, of varied ages and backgrounds, with
natural expressions; none is recognizable as a real person, and there are no close-up portraits.`,
};

const promptMenu = document.getElementById('which');

function selectedPrompt() {
  return PROMPTS[promptMenu.value];
}

function showPrompt() {
  document.getElementById('prompt').textContent = selectedPrompt();
}
promptMenu.onchange = showPrompt;
showPrompt();

// ---- 2. Send it to the image model and show the picture ---------------------
document.getElementById('run').onclick = async () => {
  const output = document.getElementById('output');
  const button = document.getElementById('run');
  const prompt = selectedPrompt();

  button.disabled = true;
  output.textContent = 'Drawing… (this can take 10–20 seconds)';
  try {
    const imageResult = await prog02OpenRouter.generateImage(prompt);
    const data = imageResult.raw;

    // The image is in data.data[0].b64_json: the picture's bytes written out as text (base64)
    const image = data.data[0];
    const img = document.createElement('img');
    img.src = imageResult.src;
    img.alt = prompt;
    output.replaceChildren(img);

    document.getElementById('cost').textContent =
      typeof imageResult.cost === 'number'
        ? 'Cost of this call: $' + imageResult.cost
        : 'Cost of this call was not reported.';

    // Show the JSON, but shorten the base64 image text: it is hundreds of thousands of characters
    image.b64_json = image.b64_json.slice(0, 80) + '… (shortened)';
    document.getElementById('raw').textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
  button.disabled = false;
};
