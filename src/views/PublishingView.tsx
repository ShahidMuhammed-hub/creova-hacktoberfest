import React, { useEffect, useState } from "react";
import { Sparkles, Copy, Download, ExternalLink, Loader2 } from "lucide-react";

const destinations = {
  Instagram: "https://www.instagram.com/",
  YouTube: "https://studio.youtube.com/",
  Facebook: "https://www.facebook.com/",
};

type Platform = keyof typeof destinations;

export const PublishingView: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [language, setLanguage] = useState("English");
  const [niche, setNiche] = useState("Lifestyle");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [output, setOutput] = useState("");
  const [model, setModel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!video) {
      setVideoUrl("");
      return;
    }

    const url = URL.createObjectURL(video);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  const generate = async (translateOnly = false) => {
    if (busy) return;

    if (translateOnly ? !output.trim() : !description.trim()) {
      setError(
        translateOnly
          ? "Generate or enter some text first."
          : "Describe the video or paste its transcript first.",
      );
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 90000);

    const prompt = translateOnly
      ? `Translate the following social media content into ${language}.
Preserve the meaning, headings, names, and formatting.
Keep hashtags useful for the target audience.
Return only the translated content.

CONTENT:
${output}`
      : `Prepare a social media publishing pack.

Platform: ${platform}
Language: ${language}
Niche: ${niche}

VIDEO DESCRIPTION OR TRANSCRIPT:
${description}

Return clearly labelled sections:
1. Three suitable title or opening-hook options.
2. One ready-to-post caption or description suited to ${platform}.
3. Five relevant hashtags.
4. One short call to action.
5. One suggested thumbnail headline.
6. A short pre-publication checklist.

Base every factual claim on the supplied description.
You have NOT watched the video; do not claim you have.
Do not invent prices, locations, statistics, or product details.
Do not claim hashtags are currently trending or guarantee reach.
Use plain text, with a blank line between sections.`;

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Generation failed. Please retry.");
      }

      if (data.simulated) {
        throw new Error(
          "The server returned simulated content. Check the Gemma connection.",
        );
      }

      if (typeof data.text !== "string" || !data.text.trim()) {
        throw new Error("The model returned no text. Please retry.");
      }

      setOutput(data.text);
      setModel(data.model || "");
      setNotice(
        translateOnly
          ? "Translation complete. Review it before posting."
          : "Your publishing pack is ready to review and edit.",
      );
    } catch (err) {
      setError(
        err instanceof Error && err.name === "AbortError"
          ? "The request took too long. Please retry."
          : err instanceof Error
            ? err.message
            : "Request failed. Check your connection.",
      );
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
    }
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setNotice("Copied. Paste the relevant sections into your social post.");
    } catch {
      setError("Copy failed. Select the text below and press Ctrl+C.");
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "creova-publishing-pack.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const inputClass =
    "w-full rounded-xl border border-[#DEDFD8] bg-[#F8F8F4] p-3 text-sm text-[#111111]";

  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-4 py-3 text-sm font-bold text-white disabled:opacity-50";

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div className="rounded-3xl border border-[#DEDFD8] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#111111]">
              Publishing Studio
            </h2>
            <p className="mt-1 text-sm text-[#737373]">
              Prepare captions, hashtags, and translations with Gemma 4.
            </p>
          </div>
          <span className="rounded-full bg-[#C8F34A]/30 px-4 py-2 text-xs font-bold">
            Gemma 4 · Creator Tools
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-5 rounded-3xl border border-[#DEDFD8] bg-white p-6">
          <h3 className="font-bold">Prepare your video post</h3>

          <label className="block space-y-2 text-sm font-semibold">
            <span>Select a video for preview (optional)</span>
            <input
              type="file"
              accept="video/*"
              disabled={busy}
              className={inputClass}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file && !file.type.startsWith("video/")) {
                  setError("Please choose a video file.");
                  return;
                }
                setVideo(file || null);
                setError("");
              }}
            />
          </label>

          {videoUrl && (
            <div className="space-y-2">
              <video
                src={videoUrl}
                controls
                preload="metadata"
                className="max-h-64 w-full rounded-2xl bg-black"
              />
              <p className="break-all text-xs text-[#737373]">{video?.name}</p>
            </div>
          )}

          <p className="text-xs leading-relaxed text-[#737373]">
            Video preview stays on your device. Gemma receives the description
            or transcript below, not the video itself.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-2 text-sm">
              <span>Platform</span>
              <select
                className={inputClass}
                value={platform}
                disabled={busy}
                onChange={(e) => setPlatform(e.target.value as Platform)}
              >
                {Object.keys(destinations).map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span>Language</span>
              <select
                className={inputClass}
                value={language}
                disabled={busy}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {["English", "Malayalam", "Hindi", "Arabic", "Urdu"].map(
                  (name) => (
                    <option key={name}>{name}</option>
                  ),
                )}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span>Niche</span>
              <select
                className={inputClass}
                value={niche}
                disabled={busy}
                onChange={(e) => setNiche(e.target.value)}
              >
                {[
                  "Lifestyle",
                  "Technology",
                  "Food",
                  "Travel",
                  "Education",
                  "Gaming",
                  "Fashion",
                  "Business",
                ].map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-2 text-sm font-semibold">
            <span>Video description or transcript</span>
            <textarea
              className={inputClass}
              rows={7}
              maxLength={15000}
              disabled={busy}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happens in the video, the audience, and the main message. Include only confirmed details."
            />
          </label>

          <button
            type="button"
            className={`${buttonClass} w-full`}
            disabled={busy || !description.trim()}
            onClick={() => generate()}
          >
            {busy ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Sparkles size={17} />
            )}
            {busy ? "Gemma is working…" : "Generate Publishing Pack"}
          </button>
        </section>

        <section className="space-y-4 rounded-3xl border border-[#DEDFD8] bg-white p-6">
          <div>
            <h3 className="font-bold">Review and edit</h3>
            {model && (
              <p className="mt-1 text-xs text-[#737373]">
                Last response from: {model}
              </p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {notice && (
            <p
              role="status"
              className="rounded-xl bg-green-50 p-3 text-sm text-green-800"
            >
              {notice}
            </p>
          )}

          <textarea
            aria-label="Editable publishing pack"
            className={inputClass}
            rows={17}
            value={output}
            disabled={busy}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Your generated content will appear here. You can edit it before copying or downloading."
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={buttonClass}
              disabled={!output.trim() || busy}
              onClick={copyOutput}
            >
              <Copy size={16} /> Copy
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={!output.trim() || busy}
              onClick={downloadOutput}
            >
              <Download size={16} /> Download TXT
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={!output.trim() || busy}
              onClick={() => generate(true)}
            >
              Translate to {language}
            </button>
          </div>

          <p className="text-xs text-[#737373]">
            Choose a language on the left, then click Translate. This translates
            the post text, not subtitles inside the video.
          </p>
        </section>
      </div>

      <section className="space-y-4 rounded-3xl border border-[#DEDFD8] bg-white p-6">
        <h3 className="font-bold">Continue to your social platform</h3>
        <p className="text-sm text-[#737373]">
          Copy your caption, open the platform, and select your video there.
          Creova does not automatically upload or publish your video.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          {(Object.keys(destinations) as Platform[]).map((name) => (
            <a
              key={name}
              href={destinations[name]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-[#DEDFD8] bg-[#F8F8F4] p-4 text-sm font-bold hover:bg-[#C8F34A]/20"
            >
              Open {name === "YouTube" ? "YouTube Studio" : name}
              <ExternalLink size={17} />
            </a>
          ))}
        </div>

        <p className="text-xs text-[#737373]">
          Sign in if prompted. Use the platform’s Create or Upload option.
        </p>
      </section>
    </div>
  );
};
