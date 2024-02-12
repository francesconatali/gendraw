// UI.js

// Constants for DOM element IDs
const ELEMENTS = {
  submit: "submit",
  reset: "reset",
  textPrompt: "text-prompt",
  canvas: "canvas",
  statusMessage: "status-message",
  generatedImage: "generated-image",
};

let requestId = null;
let blocked = false;
let isCanvasDrawnOn = false;

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById(ELEMENTS.submit);
  submitButton.addEventListener("click", handleSubmitClick);
  const resetButton = document.getElementById(ELEMENTS.reset);
  resetButton.addEventListener("click", resetCanvasAndPrompt);
});

function handleSubmitClick() {
  const basePrompt = document.getElementById(ELEMENTS.textPrompt).value;

  if (!isCanvasDrawnOn) {
    // Display an error message if nothing has been drawn
    alert("Please draw something on the canvas before generating an image.");
    return; // Exit the function early
  }
  if (basePrompt === "") {
    // Display an error message if the text prompt is empty
    alert("Please enter a text prompt before generating an image.");
    return; // Exit the function early
  }
  // Extra prompts to improve the quality of the generated image
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

  // Convert the list of extra prompts into a string, each prefixed with ", "
  const extraPromptsString = extraPrompts.map((p) => `, ${p}`).join("");
  // Append the negative prompts to the base prompt
  const prompt = `${basePrompt}${extraPromptsString}`;
  // Convert the canvas to a base64 string and remove the data URL prefix
  const image = document
    .getElementById(ELEMENTS.canvas)
    .toDataURL("image/png")
    .replace(/^data:image\/(png|jpg);base64,/, "");

  // Disable submit button while the request is being processed
  document.getElementById(ELEMENTS.submit).disabled = true;

  // Update the status message
  document.getElementById(ELEMENTS.statusMessage).innerHTML =
    "Status: Submitting request...";

  blocked = false;
  submitRequest(prompt, image);
}

function displayImage(imgData) {
  const img = new Image();
  img.src = imgData;
  const generatedImageContainer = document.getElementById(
    ELEMENTS.generatedImage
  );
  generatedImageContainer.innerHTML = ""; // Clear existing content
  generatedImageContainer.style.display = "block"; // Show the generated image container
  generatedImageContainer.appendChild(img);
  // Renable the submit button
  document.getElementById("submit").disabled = false;
}

function resetCanvasAndPrompt() {
  const generatedImageContainer = document.getElementById(
    ELEMENTS.generatedImage
  );
  generatedImageContainer.style.display = "none"; // Hide the generated image container
  generatedImageContainer.innerHTML = ""; // Remove the previous image (if any)
  document.getElementById(ELEMENTS.submit).textContent = "Generate Image"; // Change button text back to "Generate Image"
  // Clear the canvas
  const canvas = document.getElementById(ELEMENTS.canvas);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Reset prompt text field
  document.getElementById(ELEMENTS.textPrompt).value = "";
  // Reset the flag to false
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

  document.getElementById(ELEMENTS.statusMessage).innerHTML = statusMessage;
  setupCancelLink();
}

function getStatusMessage(data) {
  if (data.processing) return "Processing...";
  if (data.finished) return "Finished!";
  if (data.faulted) return "An error occurred.";
  if (data.done && !data.finished) return "Processing cancelled.";

  // Renable the submit button
  document.getElementById(ELEMENTS.submit).disabled = false;

  blocked = true;
  return "Undefined.";
}

function updateCancellationUI() {
  document.getElementById(ELEMENTS.statusMessage).innerText =
    "Status: Processing cancelled.";
  // Renable the submit button
  document.getElementById(ELEMENTS.submit).disabled = false;
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
