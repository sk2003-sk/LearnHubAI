// The mock backend runs on Vercel, which rejects request bodies above ~4.5 MB.
// Avatars travel as base64 data URLs inside JSON, so keep the encoded string
// comfortably below that ceiling (base64 inflates the payload by ~33%).
const MAX_DATA_URL_LENGTH = 3.9 * 1024 * 1024;
const MIN_QUALITY = 0.6;

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new Error("Choose a valid file."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file, maxSizeInMb = 20) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  if (file.size > maxSizeInMb * 1024 * 1024) {
    throw new Error(`Image size must be less than ${maxSizeInMb} MB.`);
  }

  return true;
}

async function loadBitmap(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // fall back to an <img> element below
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Unable to read the selected image."));
      image.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function compressImage(
  file,
  { maxDimension = 1400, maxDataUrlLength = MAX_DATA_URL_LENGTH } = {},
) {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    throw new Error("This image is too large to optimize. Please choose a smaller JPG or PNG.");
  }

  const source = await loadBitmap(file);
  const sourceWidth = source.width ?? source.naturalWidth;
  const sourceHeight = source.height ?? source.naturalHeight;

  let scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
  let quality = 0.9;
  let dataUrl = "";

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(source, 0, 0, width, height);

    dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrl.length <= maxDataUrlLength) break;

    if (quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - 0.1);
    } else {
      scale *= 0.8;
    }
  }

  if (typeof source.close === "function") {
    source.close();
  }

  if (dataUrl.length > maxDataUrlLength) {
    throw new Error("Unable to optimize this image. Please choose a smaller one.");
  }

  return dataUrl;
}

export async function prepareImageForUpload(
  file,
  { maxSizeInMb = 20, maxDimension = 1400, maxDataUrlLength = MAX_DATA_URL_LENGTH } = {},
) {
  validateImageFile(file, maxSizeInMb);

  const estimatedDataUrlLength = Math.ceil(file.size / 3) * 4 + 100;
  if (estimatedDataUrlLength <= maxDataUrlLength) {
    return fileToBase64(file);
  }

  return compressImage(file, { maxDimension, maxDataUrlLength });
}
