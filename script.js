const $imageInput = document.querySelector('.js-image-input');
const $canvas = document.querySelector('.js-canvas');
const canvasContext = $canvas.getContext('2d');

/**
 * Clear the $canvas element.
 */
function clearCanvas() {
  canvasContext.clearRect(0, 0, $canvas.width, $canvas.height);
}

/**
 * Creates an URL for a blob that contains an image file passed as argument.
 *
 * @param {File} imageFile An image file.
 *
 * @return {string} URL for the image's blob.
 */
function createImageUrl(imageFile) {
  const blob = new Blob([ imageFile ]);
  const url = URL.createObjectURL(blob);

  return url;
}

/**
 * Uses the image given in the $imageInput element to create a image in the
 * $canvas element using the pre made frame.
 */
function drawCanvas() {
  const $frame = new Image('./assets/frame.png');

  const image = $imageInput.files[0];
  const imageUrl = createImageUrl(image);
  const $image = new Image(imageUrl);

  console.log({$frame, $image});
}

$imageInput.addEventListener('input', drawCanvas);
clearCanvas();

