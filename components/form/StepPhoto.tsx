"use client";

import { useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useFormContext } from "react-hook-form";
import { BiodataFormValues } from "@/lib/schema";
import { cropAndEncodeImage, readFileAsDataUrl, uploadDataUrlToBlob } from "@/lib/photo";
import { useBiodataMode } from "./BiodataModeContext";

async function centerCropToDataUrl(src: string): Promise<string> {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
  const targetRatio = 3 / 4;
  let width = img.width;
  let height = img.height;
  if (width / height > targetRatio) {
    width = height * targetRatio;
  } else {
    height = width / targetRatio;
  }
  const x = (img.width - width) / 2;
  const y = (img.height - height) / 2;
  return cropAndEncodeImage(src, { x, y, width, height });
}

export function StepPhoto() {
  const { watch, setValue } = useFormContext<BiodataFormValues>();
  const { mode } = useBiodataMode();
  const primary = watch("photo.primary");
  const secondary = watch("photo.secondary") ?? [];

  const [rawImage, setRawImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  async function toStoredValue(dataUrl: string): Promise<string> {
    return mode === "remote" ? uploadDataUrlToBlob(dataUrl) : dataUrl;
  }

  async function handlePrimarySelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setRawImage(dataUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    e.target.value = "";
  }

  async function handleSavePrimaryCrop() {
    if (!rawImage || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const cropped = await cropAndEncodeImage(rawImage, croppedAreaPixels);
      const stored = await toStoredValue(cropped);
      setValue("photo.primary", stored, { shouldDirty: true });
      setRawImage(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSecondaryAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 2 - secondary.length);
    e.target.value = "";
    setUploading(true);
    try {
      const stored = await Promise.all(
        files.map(async (file) => {
          const dataUrl = await readFileAsDataUrl(file);
          const cropped = await centerCropToDataUrl(dataUrl);
          return toStoredValue(cropped);
        })
      );
      setValue("photo.secondary", [...secondary, ...stored].slice(0, 2), { shouldDirty: true });
    } finally {
      setUploading(false);
    }
  }

  function removeSecondary(index: number) {
    setValue(
      "photo.secondary",
      secondary.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-sm font-medium text-stone-700">Portrait Photo</span>
        <p className="mt-1 text-xs text-stone-400">
          {mode === "remote"
            ? "Cropped and resized in your browser, then saved to your account so you can come back to it."
            : "Cropped and resized in your browser. It never leaves your device."}
        </p>

        {rawImage ? (
          <div className="mt-3 flex flex-col gap-3">
            <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-stone-900">
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
              />
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
              aria-label="Zoom"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRawImage(null)}
                className="min-h-11 flex-1 rounded-xl border border-stone-300 text-sm font-medium text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePrimaryCrop}
                disabled={uploading}
                className="min-h-11 flex-1 rounded-xl bg-stone-900 text-sm font-semibold text-white disabled:opacity-60"
              >
                {uploading ? "Saving…" : "Save photo"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-4">
            {primary && (
              <div className="h-28 w-21 overflow-hidden rounded-lg border border-stone-200" style={{ width: "5.25rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={primary} alt="Portrait" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-11 rounded-full border border-stone-900 px-5 text-sm font-semibold text-stone-900 hover:bg-stone-900 hover:text-white"
              >
                {primary ? "Replace photo" : "Upload photo"}
              </button>
              {primary && (
                <button
                  type="button"
                  onClick={() => setValue("photo.primary", null, { shouldDirty: true })}
                  className="min-h-9 text-xs font-medium text-red-700 hover:underline"
                >
                  Remove photo
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePrimarySelect}
              className="hidden"
            />
          </div>
        )}
      </div>

      <div>
        <span className="text-sm font-medium text-stone-700">Additional Photos (optional, up to 2)</span>
        <div className="mt-3 flex flex-wrap gap-3">
          {secondary.map((src, i) => (
            <div key={i} className="relative h-28 w-21 overflow-hidden rounded-lg border border-stone-200" style={{ width: "5.25rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeSecondary(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
          {secondary.length < 2 && (
            <button
              type="button"
              onClick={() => secondaryInputRef.current?.click()}
              className="flex h-28 w-21 items-center justify-center rounded-lg border-2 border-dashed border-stone-300 text-2xl text-stone-400"
              style={{ width: "5.25rem" }}
            >
              +
            </button>
          )}
          <input
            ref={secondaryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleSecondaryAdd}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
