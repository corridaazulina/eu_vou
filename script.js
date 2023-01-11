const $imageInput = document.querySelector('.js-image-input');
const $canvas = document.querySelector('.js-canvas');
const $downloadButton = document.querySelector('.js-download-button');
const $container = document.querySelector('.js-container');
const canvasContext = $canvas.getContext('2d');
/**
 * This variable contains the URL for a blob that contains the image inserted by
 * the user. It starts `undefined` but receives a value whenever the user
 * inserts an image in the page.
 */
let imageUrl;

/**
 * Clears any drawing that is already at the $canvas element.
 */
function clearCanvas() {
  canvasContext.clearRect(0, 0, $canvas.width, $canvas.height);
}

/**
 * Uses the image inserted in the $imageInput element to draw an image in the
 * $canvas element using the pre-made frame.
 */
function drawCanvas() {
  if (!imageUrl) { return; }

  clearCanvas();

  const $image = new Image();
  $image.src = imageUrl;

  // The $frame image element must be loaded after the image insert has been
  // loaded into the canvas element, so it can overlap that image.
  //
  // For this reason, the code must be inserted inside this event listener.
  //
  // If the images are not wait for to be loaded, it can causes the issue in
  // which they are not draw in the $canvas element.
  $image.addEventListener('load', () => {
    canvasContext.drawImage(
      $image,
      $canvas.width * 0.02,
      $canvas.height * 0.1,
      $canvas.width * 0.47,
      $canvas.height * 0.9,
    );

    const $frame = new Image();
    $frame.src = './assets/frame.png';

    $frame.addEventListener('load', () => {
      canvasContext.drawImage($frame, 0, 0, $canvas.width, $canvas.height);
    });
  });
}

/**
 * Changes the $canvas element's size to correspond to the $container in width
 * page.
 */
function handleResize() {
  $canvas.width = $container.offsetWidth;
  $canvas.height = $container.offsetWidth;
  drawCanvas();
}

/**
 * Handles the image input made by the user, by loading the image into a blob,
 * creating its URL and drawing the canvas with it.
 */
function handleImageInput() {
  const imageInserted = $imageInput.files[0];
  if (imageUrl) {
    URL.revokeObjectUrl(imageUrl);
  }
  imageUrl = URL.createObjectURL(new Blob([ imageInserted ]));
  drawCanvas();
}

$imageInput.addEventListener('input', handleImageInput);
window.addEventListener('resize', handleResize);

