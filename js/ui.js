// UI.js

// Constants for DOM element IDs
const DOM = {
  Submit: document.getElementById("submit"),
  Reset: document.getElementById("reset"),
  TextPrompt: document.getElementById("text-prompt"),
  Canvas: document.getElementById("canvas"),
  StatusMessage: document.getElementById("status-message"),
  GeneratedImage: document.getElementById("generated-image"),
};

let requestId = null;
let blocked = false;
let isCanvasDrawnOn = false;

document.addEventListener("DOMContentLoaded", () => {
  DOM.Submit.addEventListener("click", handleSubmitClick);
  DOM.Reset.addEventListener("click", resetCanvasAndPrompt);
});

function handleSubmitClick() {
  const basePrompt = DOM.TextPrompt.value;

  if (!isCanvasDrawnOn) {
    alert("Please draw something on the canvas before generating an image.");
    return;
  }
  if (basePrompt === "") {
    alert("Please enter a text prompt before generating an image.");
    return;
  }

  const extraPrompts = [
    "(background:1.0)",
    "(realistic:1.0)",
    "(high quality:1.0)",
    "(vibrant:1.0)",
    "(detailed:1.0)",
    "(high resolution:1.0)",
    "(bright:1.0)",
    "(creative:1.0)",
  ];

  const extraPromptsString = extraPrompts.map((p) => `, ${p}`).join("");
  const prompt = `${basePrompt}${extraPromptsString}`;
  const image = DOM.Canvas.toDataURL("image/png").replace(
    /^data:image\/(png|jpg);base64,/,
    ""
  );

  DOM.Submit.disabled = true;
  DOM.StatusMessage.innerHTML = "Status: Submitting request...";

  blocked = false;
  submitRequest(prompt, image);
}

function displayImage(imgData) {
  const img = new Image();
  img.src = imgData;
  DOM.GeneratedImage.innerHTML = "";
  DOM.GeneratedImage.style.display = "block";
  DOM.GeneratedImage.appendChild(img);

  DOM.Submit.disabled = false;
}

function resetCanvasAndPrompt() {
  DOM.GeneratedImage.style.display = "none";
  DOM.GeneratedImage.innerHTML = "";
  DOM.Submit.textContent = "Generate Image";

  const ctx = DOM.Canvas.getContext("2d");
  ctx.clearRect(0, 0, DOM.Canvas.width, DOM.Canvas.height);
  DOM.TextPrompt.value = "";

  isCanvasDrawnOn = false;
}

function updateStatusUI(data) {
  let statusMessage = "Status: ";
  if (data.waiting) {
    statusMessage += `Waiting in queue, position: ${
      data.queue_position === 0 ? "(retrieving)" : data.queue_position
    }`;
    statusMessage +=
      ' - <a href="#" title="Cancel processing" id="cancel-request">Cancel</a>';
  } else {
    statusMessage += getStatusMessage(data);
  }

  DOM.StatusMessage.innerHTML = statusMessage;
  setupCancelLink();
}

function getStatusMessage(data) {
  if (data.processing) return "Processing...";
  if (data.finished) return "Finished!";
  if (data.faulted) return "An error occurred.";
  if (data.done && !data.finished) return "Processing cancelled.";

  DOM.Submit.disabled = false;

  blocked = true;
  return "Undefined.";
}

function updateCancellationUI() {
  DOM.StatusMessage.innerText = "Status: Processing cancelled.";
  DOM.Submit.disabled = false;
  blocked = true;
}

function setupCancelLink() {
  const cancelLink = document.getElementById("cancel-request");
  if (cancelLink) {
    cancelLink.addEventListener("click", (event) => {
      event.preventDefault();
      cancelProcessing(requestId);
    });
  }
}
