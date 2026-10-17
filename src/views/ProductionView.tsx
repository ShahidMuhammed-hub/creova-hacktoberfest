import React, { useState } from "react";
import { SceneItem } from "../types";
import {
  Clapperboard,
  Plus,
  CheckCircle2,
  Clock,
  Video,
  X,
  Upload,
} from "lucide-react";

interface ProductionViewProps {
  scenes: SceneItem[];
}

export const ProductionView: React.FC<ProductionViewProps> = ({ scenes }) => {
  const [sceneList, setSceneList] = useState<SceneItem[]>(scenes);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New scene form state
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("0:00 - 1:00");
  const [visualDescription, setVisualDescription] = useState("");
  const [cameraAngle, setCameraAngle] = useState("Medium Shot");
  const [audioNotes, setAudioNotes] = useState("Clear vocal mic");
  const [localFileName, setLocalFileName] = useState("");

  const handleAddScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newScene: SceneItem = {
      id: "sc_" + Date.now(),
      sceneNumber: sceneList.length + 1,
      title,
      duration,
      visualDescription:
        visualDescription +
        (localFileName ? ` [Attached local asset: ${localFileName}]` : ""),
      cameraAngle,
      audioNotes,
      status: "Pending",
    };

    setSceneList([...sceneList, newScene]);
    setIsModalOpen(false);
    setTitle("");
    setVisualDescription("");
    setLocalFileName("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLocalFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">
            Video Production Planner
          </h2>
          <p className="text-xs text-[#737373]">
            Break down your script into timed scenes, camera angles, and shot
            lists with local video assets.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#050505] hover:bg-[#222222] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8F34A]" />
          Add Scene
        </button>
      </div>

      <GemmaShotPlanner />

      <div className="space-y-4">
        {sceneList.map((scene) => (
          <div
            key={scene.id}
            className="bg-white border border-[#DEDFD8] hover:border-[#111111] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#C8F34A]/20 border border-[#C8F34A] flex items-center justify-center font-extrabold text-xs text-[#111111] shrink-0">
                0{scene.sceneNumber}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#111111]">
                    {scene.title}
                  </h3>
                  <span className="px-2 py-0.5 bg-[#F8F8F4] border border-[#DEDFD8] rounded-full text-[10px] font-semibold text-[#737373]">
                    {scene.duration}
                  </span>
                </div>
                <p className="text-xs text-[#555555]">
                  {scene.visualDescription}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[10px] text-[#888888] font-medium">
                    Angle: {scene.cameraAngle}
                  </span>
                  <span className="text-[10px] text-[#888888] font-medium">
                    • Audio: {scene.audioNotes}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  scene.status === "Filmed"
                    ? "bg-[#3B8D50]/10 text-[#3B8D50]"
                    : scene.status === "Editing"
                      ? "bg-[#C38A28]/10 text-[#C38A28]"
                      : "bg-[#F8F8F4] text-[#737373] border border-[#DEDFD8]"
                }`}
              >
                {scene.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Scene Modal with Local Video Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#DEDFD8] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEA]">
              <h3 className="text-sm font-bold text-[#111111]">
                Add Production Scene & Local Video
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#888888] hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddScene} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">
                  Scene Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Hook & Introduction..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-3 py-2 text-xs text-[#111111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">
                    Camera Angle
                  </label>
                  <input
                    type="text"
                    value={cameraAngle}
                    onChange={(e) => setCameraAngle(e.target.value)}
                    className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-3 py-2 text-xs text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">
                  Visual Description & Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe camera movement, lighting, and props..."
                  value={visualDescription}
                  onChange={(e) => setVisualDescription(e.target.value)}
                  className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl p-3 text-xs text-[#111111] outline-none"
                />
              </div>

              {/* Local Video Attachment */}
              <div className="p-4 bg-[#F8F8F4] border border-dashed border-[#DEDFD8] rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer relative hover:border-[#111111] transition-all">
                <input
                  type="file"
                  accept="video/*,audio/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-5 h-5 text-[#737373] mb-1" />
                <p className="text-xs font-bold text-[#111111]">
                  {localFileName
                    ? `Attached: ${localFileName}`
                    : "Click to attach local video or media asset"}
                </p>
                <p className="text-[10px] text-[#888888]">
                  MP4, MOV, WebM or audio recordings
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#050505] hover:bg-[#222222] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Save and Add Scene
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
function GemmaShotPlanner() {
  const [script, setScript] = useState("");
  const [platform, setPlatform] = useState("Instagram Reel — vertical");
  const [equipment, setEquipment] = useState("Smartphone only");
  const [length, setLength] = useState("30–60 seconds");
  const [plan, setPlan] = useState("");
  const [model, setModel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const inputStyle =
    "w-full rounded-xl border border-[#DEDFD8] bg-[#F8F8F4] p-3 text-sm text-[#111111]";

  const buttonStyle =
    "rounded-xl bg-[#111111] px-4 py-3 text-sm font-bold text-white disabled:opacity-50";

  async function loadScript(file?: File) {
    if (!file) return;

    setError("");
    setNotice("");

    if (!/\.(txt|srt|md)$/i.test(file.name)) {
      setError(
        "Please use a TXT, SRT, or Markdown file, or paste your script.",
      );
      return;
    }

    if (file.size > 100000) {
      setError("Please use a script file smaller than 100 KB.");
      return;
    }

    try {
      const text = await file.text();

      if (text.length > 15000) {
        setError("Please shorten the script to 15,000 characters or fewer.");
        return;
      }

      setScript(text);
      setNotice(`Loaded: ${file.name}`);
    } catch {
      setError("Could not read the file. Please paste your script instead.");
    }
  }

  async function generatePlan() {
    if (busy || !script.trim()) return;

    setBusy(true);
    setError("");
    setNotice("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 90000);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: `You are a practical video director helping a beginner
turn a script into an achievable filming plan.

Platform and orientation: ${platform}
Available equipment: ${equipment}
Target video length: ${length}

SCRIPT:
${script}

Create a scene-by-scene shooting plan based on this script.
Use 4–8 scenes as appropriate.

For EACH scene provide these clearly labelled lines:
SCENE number — short scene title
Suggested timing: start–end, in seconds
Script cue: the relevant excerpt or action
Shot size: wide, medium, close-up, or extreme close-up
Camera angle: eye-level, high-angle, low-angle, overhead,
or over-the-shoulder
Camera position: explain exactly where to put the camera
Movement: static, pan, tilt, or a simple achievable movement
Action / B-roll: what should appear in the frame
Lighting and audio: one practical instruction
Why this shot: briefly explain why it fits this script moment

Make suggested timings fit the target length where practical.
Label timings as estimates. If the script is too long,
explain that it needs shortening rather than silently omitting it.
Use only the available equipment. Avoid dangerous filming setups.
Distinguish shot size from camera angle.
Finish with a short filming checklist.
Return readable plain text with blank lines between scenes.
Do not use Markdown tables or JSON.`,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not generate a shot plan.");
      }

      if (data.simulated) {
        throw new Error(
          "The server returned simulated content. Check the Gemma connection.",
        );
      }

      if (typeof data.text !== "string" || !data.text.trim()) {
        throw new Error("Gemma returned no text. Please try again.");
      }

      setPlan(data.text);
      setModel(data.model || "");
      setNotice("Shot plan generated. You can edit or download it below.");
    } catch (err) {
      setError(
        err instanceof Error && err.name === "AbortError"
          ? "The request took too long. Please try again."
          : err instanceof Error
            ? err.message
            : "Could not connect to the server.",
      );
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
    }
  }

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(plan);
      setNotice("Shot plan copied.");
    } catch {
      setError("Select the plan text and press Ctrl+C to copy it.");
    }
  }

  function downloadPlan() {
    const blob = new Blob([plan], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "creova-shot-plan.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="space-y-5 rounded-3xl border border-[#DEDFD8] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-[#111111]">
            Script → Camera Angles
          </h3>
          <p className="mt-1 text-sm text-[#737373]">
            Turn your script into practical shots, camera positions, movement,
            and B-roll suggestions.
          </p>
        </div>
        <span className="rounded-full bg-[#C8F34A]/30 px-4 py-2 text-xs font-bold">
          Powered by Gemma 4
        </span>
      </div>

      <label className="block space-y-2 text-sm font-semibold">
        <span>Load a script file — TXT, SRT, or Markdown</span>
        <input
          type="file"
          accept=".txt,.srt,.md"
          disabled={busy}
          className={inputStyle}
          onChange={(event) => {
            void loadScript(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>

      <label className="block space-y-2 text-sm font-semibold">
        <span>Or paste your script</span>
        <textarea
          rows={7}
          maxLength={15000}
          value={script}
          disabled={busy}
          onChange={(event) => setScript(event.target.value)}
          className={inputStyle}
          placeholder="Paste the spoken lines and describe any actions you want to show..."
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-2 text-sm">
          <span>Video format</span>
          <select
            className={inputStyle}
            value={platform}
            disabled={busy}
            onChange={(event) => setPlatform(event.target.value)}
          >
            <option>Instagram Reel — vertical</option>
            <option>YouTube Short — vertical</option>
            <option>YouTube video — horizontal</option>
            <option>Facebook Reel — vertical</option>
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span>Equipment</span>
          <select
            className={inputStyle}
            value={equipment}
            disabled={busy}
            onChange={(event) => setEquipment(event.target.value)}
          >
            <option>Smartphone only</option>
            <option>Smartphone and tripod</option>
            <option>Camera and tripod</option>
            <option>Camera, tripod, and gimbal</option>
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span>Target length</span>
          <select
            className={inputStyle}
            value={length}
            disabled={busy}
            onChange={(event) => setLength(event.target.value)}
          >
            <option>15–30 seconds</option>
            <option>30–60 seconds</option>
            <option>1–3 minutes</option>
            <option>3–5 minutes</option>
          </select>
        </label>
      </div>

      <p className="text-xs text-[#737373]">
        Your script and selected settings are sent to the AI service when you
        generate a plan.
      </p>

      <button
        type="button"
        className={`${buttonStyle} w-full`}
        disabled={busy || !script.trim()}
        onClick={generatePlan}
      >
        {busy ? "Gemma is planning your shots…" : "Generate Shot Plan"}
      </button>

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

      {plan && (
        <div className="space-y-3 border-t border-[#DEDFD8] pt-5">
          <div>
            <h4 className="font-bold">Your editable shooting plan</h4>
            {model && (
              <p className="mt-1 text-xs text-[#737373]">
                Generated using: {model}
              </p>
            )}
          </div>

          <textarea
            aria-label="Editable shooting plan"
            rows={20}
            value={plan}
            disabled={busy}
            onChange={(event) => setPlan(event.target.value)}
            className={`${inputStyle} leading-relaxed`}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={buttonStyle}
              disabled={busy}
              onClick={copyPlan}
            >
              Copy Shot Plan
            </button>
            <button
              type="button"
              className={buttonStyle}
              disabled={busy}
              onClick={downloadPlan}
            >
              Download TXT
            </button>
          </div>

          <p className="text-xs text-[#737373]">
            Download your plan before leaving this page. This generated plan is
            separate from the scene cards below.
          </p>
        </div>
      )}
    </section>
  );
}
