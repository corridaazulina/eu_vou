const $imageInput = document.querySelector('.js-image-input');
const $canvas = document.querySelector('.js-canvas');
const canvasContext = $canvas.getContext('2d');

/**
 * Clears any drawing that is already at the $canvas element.
 */
function clearCanvas() {
  canvasContext.drawRect(0, 0, $canvas.width, $canvas.height);
}

/**
 * Creates a blob URL for an image file. This will be needed to display the
 * image in an image element.
 *
 * @param {File} imageFile
 *
 * @returns {string} A blob URL that contains the image file.
 */
function createImageUrl(imageFile) {
  const blob = new Blob([ imageFile ]);
  const url = URL.createObjectURL(blob);

  return url;
}

/**
 * Uses the image inserted in the $imageInput element to draw an image in the
 * $canvas element using the pre-made frame.
 */
function drawCanvas() {
  const imageInserted = $imageInput.files[0];
  const imageUrl = createImageUrl(imageInserted);
  const $image = new Image();
  $image.src = imageUrl;

  const $frame = new Image();
  $frame.src = './assets/frame.png';

  // Right now, it is possible that the frame image is loaded before the image
  // inserted. If this happens the image inserted will be on top of the frame,
  // which is not the expected behavior. Look into a solution for this issue.
  $image.addEventListener('load', () => {
    canvasContext.drawImage($frame, 0, 0, $canvas.width, $canvas.height);
  });

  $frame.addEventListener('load', () => {
    canvasContext.drawImage($frame, 0, 0, $canvas.width, $canvas.height);
  });
}

$imageInput.addEventListener('input', drawCanvas);

