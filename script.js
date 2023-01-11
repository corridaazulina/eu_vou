const $imageInput = document.querySelector('.js-image-input');
const $canvas = document.querySelector('.js-canvas');
const $downloadButton = document.querySelector('.js-download-button');
const canvasContext = $canvas.getContext('2d');
let imagesCounter = 0;
let downloadUrl;

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
  imagesCounter += 1;

  const imageInserted = $imageInput.files[0];
  // It is possible that this operation creates multiple unused urls. It is
  // needed to revoke those urls.
  const imageUrl = createImageUrl(imageInserted);
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
    canvasContext.drawImage($image, 20, 90, 480, 938);

    const $frame = new Image();
    $frame.src = './assets/frame.png';

    $frame.addEventListener('load', () => {
      canvasContext.drawImage($frame, 0, 0, $canvas.width, $canvas.height);
      enableCanvasDownload();
    });
  });
}

/**
 * Revokes the last canvas download URL if it exists to avoid creating multiple
 * blobs containing images.
 */
function revokeLastCanvasDownloadUrl() {
  if (downloadUrl) {
    URL.revokeObjectURL(downloadUrl);
  }
}

/**
 * Changes the link of the download button to allow the user to download the
 * image that in the $canvas element.
 */
function enableCanvasDownload() {
  revokeLastCanvasDownloadUrl();
  const canvasUrl = $canvas.toDataURL();
  $downloadButton.href = canvasUrl;
  $downloadButton.download = `image_${imagesCounter}`;
  downloadUrl = canvasUrl;
}

$imageInput.addEventListener('input', drawCanvas);

