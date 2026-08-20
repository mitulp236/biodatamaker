export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Crops an image to the given pixel area, downscales so the long edge is
 * at most maxDim, and re-encodes as JPEG. Runs entirely client-side —
 * the source and result never leave the browser.
 */
export async function cropAndEncodeImage(
  imageSrc: string,
  crop: PixelCrop,
  maxDim = 1200,
  quality = 0.85
): Promise<string> {
  const image = await loadImage(imageSrc);

  const scale = Math.min(1, maxDim / Math.max(crop.width, crop.height));
  const outWidth = Math.round(crop.width * scale);
  const outHeight = Math.round(crop.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outWidth,
    outHeight
  );

  return canvas.toDataURL("image/jpeg", quality);
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a cropped/encoded JPEG data URL to Vercel Blob (signed-in users
 * only) and returns the public URL. The data URL never touches Postgres —
 * only this returned URL is stored on the biodata record.
 */
export async function uploadDataUrlToBlob(dataUrl: string): Promise<string> {
  const blob = await (await fetch(dataUrl)).blob();
  const form = new FormData();
  form.append("file", blob, "photo.jpg");

  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("Photo upload failed");
  const json = await res.json();
  return json.url as string;
}
