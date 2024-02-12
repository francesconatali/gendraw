// StableHordeAPI.js

/* functions available:
 * buildRequestBody(prompt, image)
 * async submitRequest(prompt, image)
 * async fetchAndDisplayImage(requestId)
 * async checkStatus(requestId)
 * async cancelProcessing(requestId)
 */

const API_BASE_URL = "https://stablehorde.net/api/v2";
const API_KEY = "0000000000"; // Your API key (public/anonymous key: 0000000000)
const HEADERS = {
  accept: "application/json",
  apikey: API_KEY,
  "Client-Agent": "unknown:0:unknown",
  "Content-Type": "application/json",
};

function buildRequestBody(prompt, image) {
  return {
    prompt: prompt, // The text to generate the image from
    source_image: image, // The canvas drawing, encoded as a base64 string
    source_processing: "inpainting", // The type of processing ['img2img', 'inpainting', 'outpainting']
    params: {
      sampler_name: "k_dpm_2_a", // The sampler name, ['dpmsolver', 'k_lms', 'k_dpm_adaptive', 'k_dpmpp_2m', 'k_euler', 'k_dpm_2_a', 'k_heun', 'lcm', 'k_dpm_2', 'k_dpm_fast', 'k_dpmpp_sde', 'k_dpmpp_2s_a', 'k_euler_a', 'DDIM']
      cfg_scale: 7.5, // “Creativity vs. Prompt” scale. Default 7.5 (best balance). Lower numbers give the AI more freedom to be creative, while higher numbers force it to stick more to the prompt.
      denoising_strength: 0.75, // Denoising strength, ranging from 0 to 1, where 0 adds no noise at all and you will get the exact image you added, and 1 completely replaces the image with noise and almost acts as if you used normal txt2img.
      seed: "a beautiful seed for an image", // Seed
      height: 448, // Image dimensions, it has to be a multiple of 64
      width: 448, // Image dimensions, it has to be a multiple of 64
      seed_variation: 1, // Seed variation, used to generate different images from the same seed
      post_processing: ["GFPGAN"], // Post-processing options ("GFPGAN", etc.)
      karras: false, // Whether to use the Karras model
      tiling: false, // Whether to generate a tiled image
      hires_fix: false, // Whether to implement high-resolution fix
      steps: 25, // Number of steps
      n: 1, // Number of images
    },
    nsfw: true, // Whether to allow NSFW content (set to true due to false positives)
    censor_nsfw: false, // Whether to censor NSFW content
    disable_batching: false, // Whether to disable batching
  };
}

async function submitRequest(prompt, image) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/async`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(buildRequestBody(prompt, image)),
    });
    const data = await response.json();
    requestId = data.id;
    checkStatus(requestId);
  } catch (error) {
    console.error("Error submitting request:", error);
  }
}

async function fetchAndDisplayImage(requestId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/generate/status/${requestId}`,
      { method: "GET", headers: HEADERS }
    );
    const data = await response.json();
    if (data.generations && data.generations.length > 0) {
      displayImage(data.generations[0].img);
    } else {
      if (!blocked) console.error("No generations found in the response.");
    }
  } catch (error) {
    console.error("Error fetching generated image:", error);
  }
}

async function checkStatus(requestId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/generate/check/${requestId}`,
      { method: "GET", headers: HEADERS }
    );
    const data = await response.json();
    updateStatusUI(data);
    if (!data.done && !data.faulted && !blocked) {
      setTimeout(() => checkStatus(requestId), 5000);
    } else if (data.done) {
      fetchAndDisplayImage(requestId);
    }
  } catch (error) {
    console.error("Error checking status:", error);
  }
}

async function cancelProcessing(requestId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/generate/status/${requestId}`,
      { method: "DELETE", headers: HEADERS }
    );
    const data = await response.json();
    console.log("Processing cancelled", data);
    updateCancellationUI();
  } catch (error) {
    console.error("Error cancelling processing:", error);
  }
}
