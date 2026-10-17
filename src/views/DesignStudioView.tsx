import React, { useEffect, useRef, useState } from "react";

const formats = {
  "YouTube — landscape": [1280, 720],
  "Instagram — square": [1080, 1080],
  "Instagram — vertical cover": [1080, 1920],
  "Facebook — landscape": [1280, 720],
} as const;

type Format = keyof typeof formats;

export const DesignStudioView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<Format>("YouTube — landscape");
  const [headline, setHeadline] = useState("STUDY DESK RESET");
  const [brand, setBrand] = useState("CREOVA");
  const [accent, setAccent] = useState("#C8F34A");
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [position, setPosition] = useState("Bottom");
  const [fontScale, setFontScale] = useState(9);
  const [darkness, setDarkness] = useState(55);
  const [topic, setTopic] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [width, height] = formats[format];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, width, height);

    // Center-crop the uploaded image to fill the selected format.
    if (photo) {
      const scale = Math.max(
        width / photo.naturalWidth,
        height / photo.naturalHeight,
      );
      const drawWidth = photo.naturalWidth * scale;
      const drawHeight = photo.naturalHeight * scale;

      ctx.drawImage(
        photo,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
    } else {
      const background = ctx.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, "#111827");
      background.addColorStop(1, "#374151");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(width * 0.86, height * 0.25, width * 0.36, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = `rgba(0, 0, 0, ${darkness / 100})`;
    ctx.fillRect(0, 0, width, height);

    const margin = width * 0.075;
    const availableWidth = width - margin * 2;
    const family = '"Nirmala UI", "Segoe UI", Arial, sans-serif';

    ctx.fillStyle = accent;
    ctx.font = `700 ${Math.round(width * 0.026)}px ${family}`;
    ctx.textBaseline = "top";
    ctx.fillText(brand, margin, height * 0.055, availableWidth);

    // Wrap on words; also handle an unusually long unbroken word.
    const wrap = (text: string): string[] => {
      const lines: string[] = [];
      let line = "";

      for (const word of text.trim().split(/\s+/)) {
        if (!word) continue;

        const candidate = line ? `${line} ${word}` : word;
        if (ctx.measureText(candidate).width <= availableWidth) {
          line = candidate;
          continue;
        }

        if (line) lines.push(line);
        line = "";

        if (ctx.measureText(word).width <= availableWidth) {
          line = word;
        } else {
          for (const character of Array.from(word)) {
            if (
              line &&
              ctx.measureText(line + character).width > availableWidth
            ) {
              lines.push(line);
              line = character;
            } else {
              line += character;
            }
          }
        }
      }

      if (line) lines.push(line);
      return lines;
    };

    let size = Math.round((width * fontScale) / 100);
    let lines: string[] = [];

    // Shrink long headlines so the text fits inside the design.
    while (size >= 16) {
      ctx.font = `900 ${size}px ${family}`;
      lines = wrap(headline);
      if (lines.length * size * 1.35 <= height * 0.52) break;
      size -= 2;
    }

    const lineHeight = size * 1.35;
    const blockHeight = lines.length * lineHeight;

    const y =
      position === "Top"
        ? height * 0.18
        : position === "Center"
          ? Math.max(height * 0.18, (height - blockHeight) / 2)
          : height - margin - blockHeight;

    ctx.fillStyle = accent;
    ctx.fillRect(
      margin,
      y - width * 0.025,
      width * 0.16,
      Math.max(5, width * 0.008),
    );

    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = width * 0.012;

    lines.forEach((line, index) => {
      ctx.fillText(line, margin, y + index * lineHeight);
    });

    ctx.shadowBlur = 0;
  }, [
    width,
    height,
    headline,
    brand,
    accent,
    photo,
    position,
    fontScale,
    darkness,
  ]);

  async function uploadImage(file?: File) {
    if (!file) return;

    setError("");
    setNotice("");

    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Choose an image smaller than 15 MB.");
      return;
    }

    setLoadingImage(true);
    const url = URL.createObjectURL(file);

    try {
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Could not read this image."));
        image.src = url;
      });

      setPhoto(image);
      setNotice("Image loaded. Adjust the text and format.");
    } catch {
      setError("Could not load the image. Try a JPG or PNG.");
    } finally {
      URL.revokeObjectURL(url);
      setLoadingImage(false);
    }
  }

  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Export failed. Please retry.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `creova-thumbnail-${width}x${height}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(`PNG exported at ${width} × ${height} pixels.`);
    }, "image/png");
  }

  async function suggestHeadlines() {
    if (busy || !topic.trim()) return;

    setBusy(true);
    setError("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 90000);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: `Suggest exactly 3 short thumbnail headlines
for this content: ${topic}
Format: ${format}.
Use the language of the supplied topic.
Aim for 3–6 words per headline.
Be specific and truthful. Do not invent facts or promise results.
Return one headline per line, without explanations or numbering.`,
        }),
      });

      const data = await response.json();

      if (
        !response.ok ||
        !data.success ||
        data.simulated ||
        typeof data.text !== "string" ||
        !data.text.trim()
      ) {
        throw new Error(
          data.error || "Could not generate real AI suggestions.",
        );
      }

      setSuggestions(data.text);
      setNotice("Gemma suggestions ready. Click one to use it.");
    } catch (err) {
      setError(
        err instanceof Error && err.name === "AbortError"
          ? "The request timed out. Please retry."
          : err instanceof Error
            ? err.message
            : "Generation failed.",
      );
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#DEDFD8] bg-[#F8F8F4] p-3 text-sm";

  const buttonClass =
    "rounded-xl bg-[#111111] px-4 py-3 text-sm font-bold text-white disabled:opacity-50";

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <header className="rounded-3xl border border-[#DEDFD8] bg-white p-6">
        <h2 className="text-xl font-extrabold">Thumbnail & Cover Studio</h2>
        <p className="mt-2 text-sm text-[#737373]">
          Upload a photo, create your headline, and export a finished PNG.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <section className="space-y-4 rounded-3xl border border-[#DEDFD8] bg-white p-5 lg:col-span-2">
          <div className="flex min-h-72 items-center justify-center rounded-2xl bg-[#EEEEEA] p-3">
            <canvas
              ref={canvasRef}
              aria-label="Thumbnail preview"
              className="rounded-lg shadow-lg"
              style={{
                width: "100%",
                maxWidth: height > width ? 340 : 800,
                height: "auto",
              }}
            />
          </div>

          <p className="text-center text-xs text-[#737373]">
            {width} × {height} px · PNG · Image fills frame with center crop
          </p>

          <button
            type="button"
            className={`${buttonClass} w-full`}
            disabled={loadingImage}
            onClick={downloadPNG}
          >
            Download Thumbnail PNG
          </button>

          <p className="text-xs text-[#737373]">
            These are design presets. Platforms may crop covers differently in
            feeds and profile grids; check their preview before posting.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-[#DEDFD8] bg-white p-5">
          <label className="block space-y-2 text-sm">
            <span>Platform / format</span>
            <select
              className={inputClass}
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
            >
              {Object.keys(formats).map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>

          <label className="block space-y-2 text-sm">
            <span>Background image</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={loadingImage}
              className={inputClass}
              onChange={(e) => {
                void uploadImage(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>

          {photo && (
            <button
              type="button"
              className="text-sm underline"
              onClick={() => setPhoto(null)}
            >
              Remove background image
            </button>
          )}

          <label className="block space-y-2 text-sm">
            <span>Headline</span>
            <textarea
              className={inputClass}
              rows={3}
              maxLength={120}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span>Brand or channel name</span>
            <input
              className={inputClass}
              maxLength={40}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span>Text position</span>
            <select
              className={inputClass}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option>Top</option>
              <option>Center</option>
              <option>Bottom</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm">
            <span>Text size</span>
            <input
              type="range"
              min="4"
              max="14"
              step="0.5"
              value={fontScale}
              onChange={(e) => setFontScale(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span>Background darkness: {darkness}%</span>
            <input
              type="range"
              min="0"
              max="85"
              value={darkness}
              onChange={(e) => setDarkness(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="flex items-center justify-between text-sm">
            <span>Accent color</span>
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="h-9 w-14 cursor-pointer"
            />
          </label>

          <div className="space-y-3 border-t border-[#DEDFD8] pt-4">
            <h3 className="font-bold">Gemma headline ideas</h3>
            <textarea
              aria-label="Topic for headline suggestions"
              className={inputClass}
              rows={3}
              maxLength={2000}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe your video and the language you want..."
            />

            <button
              type="button"
              className={`${buttonClass} w-full`}
              disabled={busy || !topic.trim()}
              onClick={suggestHeadlines}
            >
              {busy ? "Gemma is writing…" : "Suggest Headlines"}
            </button>

            {suggestions
              .split("\n")
              .filter((line) => line.trim())
              .map((line, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setHeadline(line.trim().slice(0, 120))}
                  className="block w-full rounded-xl border border-[#DEDFD8] bg-[#C8F34A]/15 p-3 text-left text-sm hover:bg-[#C8F34A]/30"
                >
                  {line}
                </button>
              ))}
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          {notice && (
            <p role="status" className="text-sm text-green-800">
              {notice}
            </p>
          )}

          <p className="text-xs text-[#737373]">
            Photos stay in your browser. Only your topic and selected format are
            sent to Gemma for headline suggestions. Export your design before
            leaving this page.
          </p>
        </section>
      </div>
    </div>
  );
};
