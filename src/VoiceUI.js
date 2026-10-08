import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  loadTranscriber,
  startRecording,
  transcribe,
  speak,
  stopSpeaking,
  hasLocalVoice,
} from "./voice";

const CONSENT_KEY = "hearth-voice-consent";

// Overlays render into the phone frame so they cover the whole screen,
// not just the scrolling content area.
function InPhone({ children }) {
  const host =
    typeof document !== "undefined" && document.querySelector(".app");
  return host ? createPortal(children, host) : children;
}

export function hasVoiceConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "yes";
  } catch {
    return false;
  }
}

function saveVoiceConsent() {
  try {
    localStorage.setItem(CONSENT_KEY, "yes");
  } catch {
    /* private mode: ask again next time */
  }
}

// Shown the first time someone uses the mic. Hearth applies its own
// consent rules to itself: say where the voice goes before it is captured.
export function VoicePrivacySheet({ onContinue, onCancel }) {
  return (
    <InPhone>
      <div className="modal-scrim voice-sheet-scrim" onClick={onCancel}>
        <div
          className="bottom-sheet-glass voice-sheet"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bottom-sheet-handle"></div>
          <div className="voice-sheet-icon">
            <i className="ti ti-microphone" aria-hidden="true"></i>
          </div>
          <p className="voice-sheet-title">Your voice stays on this device</p>
          <div className="voice-sheet-points">
            <p>
              <i className="ti ti-device-mobile" aria-hidden="true"></i>
              Hearth turns your speech into text right here. Your recording is
              never uploaded.
            </p>
            <p>
              <i className="ti ti-download" aria-hidden="true"></i>
              The first time, Hearth downloads a small speech model (about 40
              MB). After that it works on the device.
            </p>
            <p>
              <i className="ti ti-message" aria-hidden="true"></i>
              Like a typed message, the text of what you say is then sent to
              Hearth AI to answer.
            </p>
          </div>
          <button
            className="glass-btn-neutral full-width voice-sheet-primary"
            onClick={() => {
              saveVoiceConsent();
              onContinue();
            }}
          >
            Continue
          </button>
          <button className="glass-skip-btn" onClick={onCancel}>
            Not now
          </button>
        </div>
      </div>
    </InPhone>
  );
}

// Mic button for dictation inside the message field.
// Tap to start, tap again to stop. Text is transcribed on the device and
// placed in the field so the person can check it before sending.
export function DictationButton({ onText, onStatus, requestConsent }) {
  const [state, setState] = useState("idle"); // idle | recording | transcribing
  const [level, setLevel] = useState(0);
  const rec = useRef(null);

  async function begin() {
    try {
      loadTranscriber(); // start downloading the model while the person talks
      rec.current = await startRecording({ onLevel: setLevel });
      setState("recording");
      onStatus("Listening… tap the mic to stop");
    } catch {
      onStatus("Microphone access is off. Allow it in your browser settings.");
      setState("idle");
    }
  }

  async function finish() {
    setState("transcribing");
    setLevel(0);
    onStatus("Transcribing on this device…");
    try {
      rec.current.stop();
      const blob = await rec.current.done;
      const text = await transcribe(blob, (p) =>
        onStatus(`Preparing on-device voice… ${p}%`),
      );
      if (text) onText(text);
      onStatus(null);
    } catch {
      onStatus("Couldn't transcribe that. Please try again.");
    }
    setState("idle");
  }

  function handleTap() {
    if (state === "recording") return finish();
    if (state !== "idle") return;
    if (!hasVoiceConsent()) return requestConsent(begin);
    begin();
  }

  return (
    <button
      type="button"
      className={`agent-mic-btn ${state}`}
      style={{ "--level": level }}
      onClick={handleTap}
      aria-label={state === "recording" ? "Stop dictation" : "Dictate"}
    >
      <i
        className={`ti ${state === "transcribing" ? "ti-loader-2 spin" : "ti-microphone"}`}
        aria-hidden="true"
      ></i>
    </button>
  );
}

// Full screen voice conversation, like voice mode in Claude.
// Listens, transcribes on the device, sends the text through the normal
// chat, then reads the reply aloud with an on-device voice.
export function VoiceMode({ messages, loading, onSend, onClose }) {
  const [phase, setPhase] = useState("preparing"); // preparing | listening | transcribing | thinking | speaking | paused | error
  const [level, setLevel] = useState(0);
  const [progress, setProgress] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const rec = useRef(null);
  const sentAt = useRef(null);
  const alive = useRef(true);
  const msgCount = useRef(messages.length);
  msgCount.current = messages.length;
  const canSpeak = hasLocalVoice();

  async function listen() {
    if (!alive.current) return;
    try {
      setPhase("listening");
      setCaption("");
      rec.current = await startRecording({ onLevel: setLevel, autoStop: true });
      const blob = await rec.current.done;
      if (!alive.current) return;
      setLevel(0);
      setPhase("transcribing");
      const text = await transcribe(blob);
      if (!alive.current) return;
      if (!text) return listen();
      setCaption(text);
      setPhase("thinking");
      sentAt.current = msgCount.current + 1;
      onSend(text);
    } catch {
      if (!alive.current) return;
      setError("Microphone access is off. Allow it in your browser settings.");
      setPhase("error");
    }
  }

  // Prepare the model, then start listening.
  useEffect(() => {
    alive.current = true;
    loadTranscriber(setProgress)
      .then(() => alive.current && listen())
      .catch(() => {
        setError(
          "Couldn't load the on-device voice model. Check your connection and try again.",
        );
        setPhase("error");
      });
    return () => {
      alive.current = false;
      if (rec.current) rec.current.stop();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the reply arrives, read it aloud, then listen again.
  useEffect(() => {
    if (phase !== "thinking" || loading || sentAt.current == null) return;
    const reply = messages[messages.length - 1];
    if (messages.length <= sentAt.current || reply.role !== "assistant") return;
    sentAt.current = null;
    setCaption(reply.content);
    if (!canSpeak) {
      setPhase("paused");
      return;
    }
    setPhase("speaking");
    speak(reply.content).then(() => alive.current && listen());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, loading, phase]);

  function tapOrb() {
    if (phase === "listening" && rec.current) rec.current.stop();
    else if (phase === "speaking") {
      stopSpeaking();
      listen();
    } else if (phase === "paused" || phase === "error") {
      setError("");
      listen();
    }
  }

  const status = {
    preparing:
      progress != null
        ? `Preparing on-device voice… ${progress}%`
        : "Preparing on-device voice…",
    listening: "Listening",
    transcribing: "Transcribing on this device",
    thinking: "Thinking",
    speaking: "Speaking · tap to interrupt",
    paused: canSpeak
      ? "Tap to talk"
      : "This device has no on-device voice, so replies are shown as text. Tap to talk.",
    error,
  }[phase];

  return (
    <InPhone>
      <div className="voice-mode">
        <div className="voice-mode-top">
          <span className="voice-mode-badge">
            <i className="ti ti-lock" aria-hidden="true"></i> Voice processed on
            device
          </span>
        </div>

        <button
          type="button"
          className={`voice-orb ${phase}`}
          style={{ "--level": level }}
          onClick={tapOrb}
          aria-label="Voice orb"
        >
          <span className="voice-orb-core"></span>
          <span className="voice-orb-glow"></span>
        </button>

        <p className="voice-status">{status}</p>
        <p className="voice-caption">{caption}</p>

        <div className="voice-controls">
          <button type="button" className="voice-end-btn" onClick={onClose}>
            <i className="ti ti-x" aria-hidden="true"></i>
            End
          </button>
        </div>
      </div>
    </InPhone>
  );
}
