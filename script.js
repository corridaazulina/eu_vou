const $imageInput = document.querySelector('.js-image-input');
const $canvas = document.querySelector('.js-canvas');
const $downloadButton = document.querySelector('.js-download-button');
const $downloadLink = document.querySelector('.js-download-link');
const $container = document.querySelector('.js-container');
const canvasContext = $canvas.getContext('2d');
/**
 * This variables stores the number of times the user has inserted an image.
 * This value is used to rename the download and avoid files with the same name.
 */
let imagesCounter = 0;
/**
 * This variable contains the URL for a blob that contains the image inserted by
 * the user. It starts `undefined` but receives a value whenever the user
 * inserts an image in the page.
 *
 * @type {string}
 */
let imageUrl;

/**
 * Clears any drawing that is already at the $canvas element.
 */
function clearCanvas() {
  canvasContext.clearRect(0, 0, $canvas.width, $canvas.height);
}

/**
 * Draws the image inserted by the user in the $canvas element. The action is
 * async because it is needed to wait the image be loaded before draw it.
 *
 * @async
 */
async function drawImage() {
  return new Promise((resolve) => {
    const $image = new Image();
    $image.src = imageUrl;
    $image.addEventListener('load', () => {
      canvasContext.drawImage(
        $image,
        $canvas.width * 0.02,
        $canvas.height * 0.1,
        $canvas.width * 0.47,
        $canvas.height * 0.9,
      );
      resolve();
    })
  });
}

/**
 * Draws the frame image in the $canvas element. This action is async because it
 * is needed to wait the image be loaded before draw it.
 *
 * @async
 */
async function drawFrame() {
  return new Promise((resolve) => {
    const $frame = new Image();
    $frame.src = './assets/frame.png';
    $frame.addEventListener('load', () => {
      canvasContext.drawImage($frame, 0, 0, $canvas.width, $canvas.height);
      resolve();
    })
  });
}

/**
 * Uses the image inserted in the $imageInput element to draw an image in the
 * $canvas element using the pre-made frame.
 */
async function drawCanvas() {
  if (!imageUrl) { return; }

  clearCanvas();
  await drawImage();
  await drawFrame();
}

/**
 * Changes the $canvas element's size to correspond to the $container in width
 * page.
 */
async function handleResize() {
  $canvas.width = $container.offsetWidth;
  $canvas.height = $container.offsetWidth;
  await drawCanvas();
}

/**
 * Handles the image input made by the user by loading the image into a blob,
 * creating its URL and drawing the canvas with it.
 */
async function handleImageInput() {
  imagesCounter += 1;
  const imageInserted = $imageInput.files[0];
  if (imageUrl) {
    URL.revokeObjectUrl(imageUrl);
  }
  imageUrl = URL.createObjectURL(new Blob([ imageInserted ]));
  await drawCanvas();
}

/**
 * Handles the download of the image by creating an URL with image in its full
 * size.
 */
async function handleDownload() {
  if (!imageUrl) { return; }
  $canvas.width = 1000;
  $canvas.height = 1000;
  await drawCanvas();
  const downloadUrl = $canvas.toDataURL();
  $downloadLink.href = downloadUrl;
  $downloadLink.download = `image_${imagesCounter}`;
  $downloadLink.click();
  URL.revokeObjectURL(downloadUrl);
  handleResize();
}

$imageInput.addEventListener('input', handleImageInput);
$downloadButton.addEventListener('pointerdown', handleDownload);
window.addEventListener('resize', handleResize);
handleResize();

