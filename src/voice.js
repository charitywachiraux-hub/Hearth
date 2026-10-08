// Hearth voice: everything here runs on the device.
//
// Speech to text: a small Whisper model runs inside the browser (Transformers.js).
// The model is downloaded once and cached; the user's audio is never uploaded.
// Text to speech: the browser's speech synthesis, restricted to voices that
// run on the device (voice.localService === true), so replies are not sent out
// to be spoken.

const TRANSFORMERS_URL =
  "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6/dist/transformers.min.js";
const WHISPER_MODEL = "Xenova/whisper-tiny.en";

let transcriberPromise = null;

// Loads the speech model once. onProgress receives 0 to 100 while downloading.
export function loadTranscriber(onProgress) {
  if (!transcriberPromise) {
    transcriberPromise = (async () => {
      const { pipeline, env } = await import(
        /* webpackIgnore: true */ TRANSFORMERS_URL
      );
      env.allowLocalModels = false;
      const files = {};
      return pipeline("automatic-speech-recognition", WHISPER_MODEL, {
        dtype: "q8",
        progress_callback: (p) => {
          if (!onProgress || p.status !== "progress" || !p.total) return;
          files[p.file] = { loaded: p.loaded, total: p.total };
          const all = Object.values(files);
          const loaded = all.reduce((a, f) => a + f.loaded, 0);
          const total = all.reduce((a, f) => a + f.total, 0);
          onProgress(Math.round((loaded / total) * 100));
        },
      });
    })().catch((err) => {
      transcriberPromise = null;
      throw err;
    });
  }
  return transcriberPromise;
}

// Whisper expects mono 16 kHz samples.
async function blobToSamples(blob) {
  const buffer = await blob.arrayBuffer();
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx({ sampleRate: 16000 });
  try {
    const audio = await ctx.decodeAudioData(buffer);
    return audio.getChannelData(0);
  } finally {
    ctx.close();
  }
}

export async function transcribe(blob, onProgress) {
  const transcriber = await loadTranscriber(onProgress);
  const samples = await blobToSamples(blob);
  const result = await transcriber(samples);
  return (result.text || "").replace(/\[.*?\]|\(.*?\)/g, "").trim();
}

// Records from the mic. Resolves with an audio blob when stop() is called,
// or automatically after a pause once the person has started speaking.
// onLevel receives 0 to 1 so the UI can react to the voice.
export async function startRecording({ onLevel, autoStop = false } = {}) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);
  const data = new Uint8Array(analyser.fftSize);

  let raf;
  let heardSpeech = false;
  let quietSince = null;
  const startedAt = Date.now();

  const done = new Promise((resolve) => {
    recorder.onstop = () => {
      cancelAnimationFrame(raf);
      stream.getTracks().forEach((t) => t.stop());
      ctx.close();
      resolve(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
    };
  });

  const stop = () => recorder.state !== "inactive" && recorder.stop();

  const tick = () => {
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    const level = Math.min(1, Math.sqrt(sum / data.length) * 4);
    if (onLevel) onLevel(level);

    if (autoStop) {
      if (level > 0.12) {
        heardSpeech = true;
        quietSince = null;
      } else if (heardSpeech) {
        quietSince = quietSince || Date.now();
        if (Date.now() - quietSince > 1300) return stop();
      }
      if (Date.now() - startedAt > 30000) return stop();
    }
    raf = requestAnimationFrame(tick);
  };

  recorder.start();
  tick();
  return { stop, done };
}

// ---------- Spoken replies ----------

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function localVoices() {
  return window.speechSynthesis
    .getVoices()
    .filter(
      (v) => v.localService && v.lang && v.lang.toLowerCase().startsWith("en"),
    );
}

// Prefer warmer on-device voices when they exist (Apple and Windows names).
function pickVoice() {
  const voices = localVoices();
  const preferred = [
    "Samantha",
    "Ava",
    "Zoe",
    "Serena",
    "Karen",
    "Moira",
    "Daniel",
    "Aria",
    "Jenny",
  ];
  for (const name of preferred) {
    const v = voices.find((x) => x.name.includes(name));
    if (v) return v;
  }
  return voices[0] || null;
}

export function hasLocalVoice() {
  return speechSupported() && !!pickVoice();
}

// Speaks text with an on-device voice. Resolves when finished.
// If the device has no local voice, it stays silent rather than sending text out.
export function speak(text, { onStart, onEnd } = {}) {
  return new Promise((resolve) => {
    if (!speechSupported()) return resolve(false);
    const voice = pickVoice();
    if (!voice) return resolve(false);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.rate = 1.02;
    u.pitch = 1;
    u.onstart = () => onStart && onStart();
    u.onend = u.onerror = () => {
      if (onEnd) onEnd();
      resolve(true);
    };
    window.speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

// Voices load asynchronously in some browsers.
export function warmUpVoices() {
  if (!speechSupported()) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () =>
    window.speechSynthesis.getVoices();
}
