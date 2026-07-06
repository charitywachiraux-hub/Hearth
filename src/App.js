import { useState } from "react";
import "./App.css";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?fm=jpg&q=80&w=1080&auto=format&fit=crop";

const categories = {
  security: {
    label: "Security",
    color: "rgba(255,100,100,1)",
    border: "rgba(255,100,100,0.7)",
  },
  health: {
    label: "Health",
    color: "rgba(255,180,80,1)",
    border: "rgba(255,180,80,0.7)",
  },
  behaviour: {
    label: "Behaviour",
    color: "rgba(255,210,80,1)",
    border: "rgba(255,210,80,0.7)",
  },
  analytics: {
    label: "Analytics",
    color: "rgba(130,195,255,1)",
    border: "rgba(130,195,255,0.7)",
  },
  system: {
    label: "System",
    color: "rgba(100,220,150,1)",
    border: "rgba(100,220,150,0.7)",
  },
};

const devices = [
  { id: 1, name: "Smart TV", icon: "ti-device-tv" },
  { id: 2, name: "Thermostat", icon: "ti-temperature" },
  { id: 3, name: "Lights", icon: "ti-bulb" },
  { id: 4, name: "Speaker", icon: "ti-device-speaker" },
  { id: 5, name: "Smart lock", icon: "ti-lock" },
  { id: 6, name: "Camera", icon: "ti-camera" },
  { id: 7, name: "Router", icon: "ti-wifi" },
  { id: 8, name: "Vacuum", icon: "ti-vacuum-cleaner" },
];

const activities = [
  {
    id: 1,
    device: "Smart TV",
    icon: "ti-device-tv",
    summary: "Sent viewing data to Netflix",
    time: "2m ago",
    timestamp: "Today at 11:42 PM",
    category: "analytics",
    status: "allowed",
    description:
      "Your Smart TV sent your viewing history and watch duration to Netflix servers in the United States. This is used to improve content recommendations. No personal identity data was included.",
  },
  {
    id: 2,
    device: "Thermostat",
    icon: "ti-temperature",
    summary: "Held for your review",
    time: "15m ago",
    timestamp: "Today at 11:29 PM",
    category: "behaviour",
    status: "pending",
    description:
      "Your Thermostat attempted to send your daily schedule and temperature preferences to Nest servers. Hearth held this transmission because it contains behavioural pattern data.",
  },
  {
    id: 3,
    device: "Smart lights",
    icon: "ti-bulb",
    summary: "Usage pattern approved",
    time: "1h ago",
    timestamp: "Today at 10:44 PM",
    category: "system",
    status: "allowed",
    description:
      "Your Smart lights sent anonymised usage patterns to Philips Hue servers. This data helps improve energy efficiency features.",
  },
];

const auditItems = [
  {
    id: 1,
    device: "Smart TV",
    icon: "ti-device-tv",
    category: "analytics",
    summary: "Sent viewing data to Netflix",
    time: "11:42 PM",
    date: "Today",
    status: "allowed",
    description:
      "Your Smart TV sent your viewing history and watch duration to Netflix servers in the United States.",
    decision: "Allowed by you on Today at 11:42 PM",
    protected: null,
  },
  {
    id: 2,
    device: "Thermostat",
    icon: "ti-temperature",
    category: "behaviour",
    summary: "Schedule data to Nest servers",
    time: "11:29 PM",
    date: "Today",
    status: "blocked",
    description:
      "Your thermostat attempted to send your daily schedule and temperature preferences to Nest servers in the US.",
    decision: "Blocked by you on Today at 11:29 PM",
    protected:
      "Your daily schedule and temperature preferences were not shared with Google Nest.",
  },
  {
    id: 3,
    device: "Smart speaker",
    icon: "ti-device-speaker",
    category: "health",
    summary: "Voice history to Amazon",
    time: "11:15 PM",
    date: "Today",
    status: "pending",
    description:
      "Your speaker wants to send your voice interaction history to Amazon for product improvement.",
    decision: "Awaiting your decision",
    protected: null,
  },
  {
    id: 4,
    device: "Smart lights",
    icon: "ti-bulb",
    category: "system",
    summary: "Usage pattern to Philips Hue",
    time: "10:44 PM",
    date: "Yesterday",
    status: "allowed",
    description:
      "Your Smart lights sent anonymised usage patterns to Philips Hue servers.",
    decision: "Allowed by you on Yesterday at 10:44 PM",
    protected: null,
  },
  {
    id: 5,
    device: "Security camera",
    icon: "ti-camera",
    category: "security",
    summary: "Motion data auto-approved",
    time: "9:12 PM",
    date: "Yesterday",
    status: "allowed",
    description:
      "Your security camera sent motion detection data to Ring servers. Auto-approved based on your Security rule.",
    decision: "Auto-approved by Hearth on Yesterday at 9:12 PM",
    protected: null,
  },
  {
    id: 6,
    device: "Smart TV",
    icon: "ti-device-tv",
    category: "analytics",
    summary: "Firmware update check",
    time: "8:00 PM",
    date: "Yesterday",
    status: "blocked",
    description:
      "Your Smart TV attempted to send usage analytics to Samsung servers during a firmware update check.",
    decision: "Blocked by you on Yesterday at 8:00 PM",
    protected:
      "Your viewing analytics were not shared with Samsung during this update.",
  },
];

const queueItems = [
  {
    id: 1,
    device: "Thermostat",
    icon: "ti-temperature",
    category: "behaviour",
    timestamp: "Today at 11:29 PM",
    description:
      "Your thermostat wants to send your daily schedule and temperature preferences to Nest servers in the US.",
    whatShared: "Your daily schedule and temperature preferences.",
    whoReceives: "Google Nest servers located in the United States.",
    ifBlocked:
      "Your thermostat still works normally. Nest won't receive your schedule data this time.",
  },
  {
    id: 2,
    device: "Smart speaker",
    icon: "ti-device-speaker",
    category: "health",
    timestamp: "Today at 11:15 PM",
    description:
      "Your speaker wants to send your voice interaction history to Amazon for product improvement.",
    whatShared: "Your voice interaction history from the past 7 days.",
    whoReceives: "Amazon Web Services servers located in Ireland.",
    ifBlocked:
      "Your speaker continues working normally. Amazon won't receive your voice history this time.",
  },
  {
    id: 3,
    device: "Smart TV",
    icon: "ti-device-tv",
    category: "analytics",
    timestamp: "Today at 10:58 PM",
    description:
      "Your TV wants to send your viewing habits and watch time to Samsung analytics servers.",
    whatShared: "Your viewing habits, watch time, and content preferences.",
    whoReceives: "Samsung Analytics servers located in South Korea.",
    ifBlocked:
      "Your TV works normally. Samsung won't receive your viewing data.",
  },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "ti-home" },
  { id: "queue", label: "Queue", icon: "ti-inbox" },
  { id: "agent", label: "AI Agent", icon: "ti-robot" },
  { id: "audit", label: "Audit", icon: "ti-file-text" },
];

const categoryRules = [
  { key: "security", description: "Cameras, locks, alarms" },
  { key: "health", description: "Wellness monitoring" },
  { key: "behaviour", description: "Schedules, habits" },
  { key: "analytics", description: "Product improvement" },
  { key: "system", description: "Firmware, connectivity" },
];

const suggestedQuestions = [
  "Why does my thermostat send data at night?",
  "Is it safe to allow my Smart TV to send data?",
  "What does blocking Analytics data actually do?",
];

const previewDevices = devices.slice(0, 4);

const statusColors = {
  allowed: "rgba(100,220,150,1)",
  blocked: "rgba(255,100,100,1)",
  pending: "rgba(255,180,80,1)",
};

// Zone states for the indicator
const zoneStates = {
  safe: {
    label: "Safe zone — no threats detected",
    dot: "#4ADE80",
    dotShadow: "rgba(74,222,128,0.9)",
    bg: "rgba(74,222,128,0.12)",
    border: "rgba(74,222,128,0.35)",
    devices: [],
  },
  caution: {
    label: "Caution — unusual activity detected",
    dot: "#FBBF24",
    dotShadow: "rgba(251,191,36,0.9)",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.35)",
    panelTitle: "Devices sending excess data",
    panelTitleColor: "#FBBF24",
    panelBg: "rgba(251,191,36,0.1)",
    panelBorder: "rgba(251,191,36,0.35)",
    descColor: "rgba(251,191,36,0.9)",
    btnBg: "rgba(251,191,36,0.8)",
    btnLabel: "Limit data",
    devices: [
      {
        icon: "ti-camera",
        name: "Ring camera",
        desc: "Sending more data than expected",
      },
      {
        icon: "ti-device-speaker",
        name: "Alexa speaker",
        desc: "Unusual voice data uploads",
      },
    ],
  },
  risk: {
    label: "Risk — devices may be compromised",
    dot: "#EF4444",
    dotShadow: "rgba(239,68,68,0.9)",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.4)",
    panelTitle: "Suspicious devices detected",
    panelTitleColor: "#EF4444",
    panelBg: "rgba(239,68,68,0.1)",
    panelBorder: "rgba(239,68,68,0.4)",
    descColor: "rgba(255,100,100,0.9)",
    btnBg: "rgba(239,68,68,0.85)",
    btnLabel: "Shut down",
    devices: [
      {
        icon: "ti-camera",
        name: "Ring camera",
        desc: "Sending live footage externally",
      },
      {
        icon: "ti-vacuum-cleaner",
        name: "Robot vacuum",
        desc: "Mapping data being intercepted",
      },
    ],
  },
};

function CategoryTag({ category }) {
  const cat = categories[category];
  if (!cat) return null;
  return (
    <span
      className="category-tag"
      style={{ color: cat.color, borderColor: cat.border }}
    >
      {cat.label}
    </span>
  );
}

function StatusDot({ status }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: statusColors[status],
        }}
      ></div>
      <p
        style={{
          fontSize: "10px",
          color: statusColors[status],
          fontWeight: 600,
          margin: 0,
          textTransform: "capitalize",
        }}
      >
        {status}
      </p>
    </div>
  );
}

function GlassCard({ children, style = {}, onClick }) {
  return (
    <div className="glass-card" style={style} onClick={onClick}>
      {children}
    </div>
  );
}

function ZoneIndicator({ zone, onZoneAction, dismissedDevices }) {
  const state = zoneStates[zone];
  const visibleDevices = state.devices.filter(
    (d) => !dismissedDevices.includes(d.name),
  );
  const hasDevices = visibleDevices.length > 0;

  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        className="zone-indicator"
        style={{ background: state.bg, border: `0.5px solid ${state.border}` }}
      >
        <div
          className="zone-dot"
          style={{
            background: state.dot,
            boxShadow: `0 0 6px ${state.dotShadow}`,
          }}
        ></div>
        <span className="zone-label" style={{ color: state.dot }}>
          {state.label}
        </span>
      </div>

      {hasDevices && (
        <div
          className="zone-panel"
          style={{
            background: state.panelBg,
            border: `0.5px solid ${state.panelBorder}`,
          }}
        >
          <p
            className="zone-panel-title"
            style={{ color: state.panelTitleColor }}
          >
            <i
              className={
                zone === "risk" ? "ti ti-alert-triangle" : "ti ti-alert-circle"
              }
              aria-hidden="true"
            ></i>
            {state.panelTitle}
          </p>
          {visibleDevices.map((device, i) => (
            <div key={i} className="zone-device-row">
              <div className="glass-icon small">
                <i className={`ti ${device.icon}`} aria-hidden="true"></i>
              </div>
              <div className="zone-device-info">
                <p className="zone-device-name">{device.name}</p>
                <p
                  className="zone-device-desc"
                  style={{ color: state.descColor }}
                >
                  {device.desc}
                </p>
              </div>
              <button
                className="zone-action-btn"
                style={{ background: state.btnBg }}
                onClick={() => onZoneAction(device.name, state.btnLabel)}
              >
                {state.btnLabel}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QueueCard({ item, onAllow, onBlock }) {
  return (
    <GlassCard style={{ marginBottom: "12px" }}>
      <div className="queue-card-header">
        <div className="glass-icon">
          <i className={`ti ${item.icon}`} aria-hidden="true"></i>
        </div>
        <div className="queue-card-info">
          <div className="queue-card-title-row">
            <p className="white-text-bold">{item.device}</p>
            <CategoryTag category={item.category} />
          </div>
          <p className="white-text-muted small">{item.timestamp}</p>
          <span className="pending-badge">Pending</span>
        </div>
      </div>
      <div className="queue-description">
        <p>{item.description}</p>
      </div>
      <div className="queue-actions">
        <button
          className="glass-btn-secondary"
          onClick={() => onBlock(item.id)}
        >
          Block
        </button>
        <button className="glass-btn-primary" onClick={() => onAllow(item.id)}>
          Allow
        </button>
      </div>
    </GlassCard>
  );
}

function GuidedReview({ items, onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [decisions, setDecisions] = useState([]);

  function handleDecision(decision) {
    const newDecisions = [...decisions, { id: items[step].id, decision }];
    setDecisions(newDecisions);
    if (step < items.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newDecisions);
    }
  }

  const item = items[step];
  const progress = ((step + 1) / items.length) * 100;

  return (
    <div className="screen">
      <div className="guided-header">
        <div
          className="glass-icon-btn"
          onClick={onBack}
          style={{ cursor: "pointer" }}
        >
          <i className="ti ti-arrow-left" aria-hidden="true"></i>
        </div>
        <div className="guided-title">
          <i className="ti ti-robot" aria-hidden="true"></i>
          <p>Hearth guide</p>
        </div>
        <p className="white-text-muted small">
          {step + 1} of {items.length}
        </p>
      </div>

      <div className="guided-progress-bar">
        <div
          className="guided-progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <GlassCard style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <div className="glass-avatar">
            <i className="ti ti-robot" aria-hidden="true"></i>
          </div>
          <p className="white-text small" style={{ lineHeight: 1.6 }}>
            {step === 0
              ? `You have ${items.length} pending requests. Let me walk you through each one.`
              : `Here is request ${step + 1}. Take your time.`}
          </p>
        </div>
      </GlassCard>

      <p className="guided-request-label">
        Request {step + 1} of {items.length}
      </p>

      <GlassCard style={{ marginBottom: "12px" }}>
        <div className="queue-card-header">
          <div className="glass-icon">
            <i className={`ti ${item.icon}`} aria-hidden="true"></i>
          </div>
          <div className="queue-card-info">
            <div className="queue-card-title-row">
              <p className="white-text-bold">{item.device}</p>
              <CategoryTag category={item.category} />
            </div>
            <p className="white-text-muted small">{item.timestamp}</p>
          </div>
        </div>
        <div className="guided-info-block">
          <p className="guided-info-label">What is being shared?</p>
          <p className="white-text small">{item.whatShared}</p>
        </div>
        <div className="guided-info-block">
          <p className="guided-info-label">Who receives it?</p>
          <p className="white-text small">{item.whoReceives}</p>
        </div>
        <div className="guided-info-block" style={{ marginBottom: 0 }}>
          <p className="guided-info-label">What happens if you block?</p>
          <p className="white-text small">{item.ifBlocked}</p>
        </div>
      </GlassCard>

      <div className="queue-actions" style={{ marginBottom: "8px" }}>
        <button
          className="glass-btn-secondary"
          onClick={() => handleDecision("block")}
        >
          Block
        </button>
        <button
          className="glass-btn-primary"
          onClick={() => handleDecision("allow")}
        >
          Allow
        </button>
      </div>
      <button className="glass-skip-btn" onClick={() => handleDecision("skip")}>
        Decide later
      </button>
    </div>
  );
}

function AIAgent({
  initialContext,
  onBack,
  deviceToggles,
  categorySettings,
  currentZone,
  pendingItems,
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: initialContext
        ? `Hi! I'm Hearth AI. I can see you were looking at the ${initialContext.device} transmission from ${initialContext.date} at ${initialContext.time}. This was ${initialContext.category} data -- ${initialContext.description} What would you like to know about it?`
        : `Hi Charity! I'm Hearth AI, your smart home privacy assistant. I'm here to help you understand your home data. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text) {
    const userMessage = text || input;
    if (!userMessage.trim()) return;
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are Hearth AI, a friendly smart home privacy assistant. Help users understand their smart home data in plain, simple language. Be warm, concise and always end with a practical suggestion.

Here is the current state of the user's home, for your reference when answering:

Zone status: ${currentZone}

Devices: ${devices
                .map((d) => `${d.name} (${deviceToggles[d.id] ? "on" : "off"})`)
                .join(", ")}

Category rules: ${categoryRules
                .map((c) => `${c.description} -> ${categorySettings[c.key]}`)
                .join(", ")}

Pending queue (${pendingItems.length}): ${
                pendingItems.map((i) => `${i.device}: ${i.description}`).join(" | ") ||
                "none"
              }

Recent audit history: ${auditItems
                .map((i) => `${i.device} - ${i.summary} (${i.decision})`)
                .join(" | ")}`,
            },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.choices) {
        throw new Error(data.error?.message || "Request failed");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.choices[0].message.content },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble connecting. Please try again.",
        },
      ]);
    }
    setLoading(false);
  }

  return (
    <div className="agent-container">
      <div className="agent-header">
        {onBack && (
          <div
            className="glass-icon-btn"
            onClick={onBack}
            style={{ cursor: "pointer" }}
          >
            <i className="ti ti-arrow-left" aria-hidden="true"></i>
          </div>
        )}
        <div>
          <h1 className="white-text-bold large">AI Agent</h1>
          <p className="white-text-muted small">
            Ask Hearth anything about your home data
          </p>
        </div>
      </div>
      <div className="agent-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-row ${msg.role === "user" ? "message-user" : "message-assistant"}`}
          >
            {msg.role === "assistant" && (
              <div className="glass-avatar">
                <i className="ti ti-robot" aria-hidden="true"></i>
              </div>
            )}
            <div
              className={`message-bubble ${msg.role === "user" ? "bubble-user" : "bubble-assistant"}`}
            >
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {messages.length === 1 && !loading && (
          <div className="suggested-questions">
            <p className="guided-info-label">Suggested questions</p>
            {suggestedQuestions.map((q, i) => (
              <GlassCard
                key={i}
                style={{
                  marginBottom: "6px",
                  cursor: "pointer",
                  padding: "10px 12px",
                }}
                onClick={() => sendMessage(q)}
              >
                <p className="white-text small">{q}</p>
              </GlassCard>
            ))}
          </div>
        )}
        {loading && (
          <div className="message-row message-assistant">
            <div className="glass-avatar">
              <i className="ti ti-robot" aria-hidden="true"></i>
            </div>
            <div className="bubble-assistant message-bubble">
              <p
                style={{ fontStyle: "italic", color: "rgba(255,255,255,0.6)" }}
              >
                Hearth AI is thinking...
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="agent-input-area">
        <input
          className="agent-input"
          type="text"
          placeholder="Ask Hearth AI anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="agent-send-btn" onClick={() => sendMessage()}>
          <i className="ti ti-send" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}

function App() {
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDevices, setShowDevices] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [guidedMode, setGuidedMode] = useState(false);
  const [pendingItems, setPendingItems] = useState(queueItems);
  const [selectedAuditItem, setSelectedAuditItem] = useState(null);
  const [auditFilter, setAuditFilter] = useState("all");
  const [aiContext, setAiContext] = useState(null);
  const [deviceToggles, setDeviceToggles] = useState(
    Object.fromEntries(devices.map((d) => [d.id, true])),
  );
  const [categorySettings, setCategorySettings] = useState({
    security: "auto",
    health: "ask",
    behaviour: "ask",
    analytics: "block",
    system: "auto",
  });
  const [currentZone, setCurrentZone] = useState("safe");
  const [zoneActionMsg, setZoneActionMsg] = useState(null);

  function toggleSection(s) {
    setExpandedSection(expandedSection === s ? null : s);
  }
  function toggleDevice(id) {
    setDeviceToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  function setCategoryRule(key, rule) {
    setCategorySettings((prev) => ({ ...prev, [key]: rule }));
  }
  function handleAllow(id) {
    setPendingItems((prev) => prev.filter((i) => i.id !== id));
  }
  function handleBlock(id) {
    setPendingItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleGuidedComplete(decisions) {
    const ids = decisions.filter((d) => d.decision !== "skip").map((d) => d.id);
    setPendingItems((prev) => prev.filter((i) => !ids.includes(i.id)));
    setGuidedMode(false);
  }

  function openAIWithContext(item) {
    setAiContext(item);
    setSelectedAuditItem(null);
    setCurrentScreen("agent");
  }

  function openAIGeneral() {
    setAiContext(null);
    setCurrentScreen("agent");
  }

  const [actedDevices, setActedDevices] = useState([]);

  function handleZoneAction(deviceName, action) {
    const newActed = [...actedDevices, deviceName];
    setActedDevices(newActed);
    setZoneActionMsg(`${deviceName}: ${action} applied`);

    const totalDevices = zoneStates[currentZone].devices.length;
    if (newActed.length >= totalDevices) {
      setTimeout(() => {
        setCurrentZone("safe");
        setActedDevices([]);
        setZoneActionMsg("All threats resolved — zone is now safe");
        setTimeout(() => setZoneActionMsg(null), 3000);
      }, 600);
    } else {
      setTimeout(() => setZoneActionMsg(null), 2000);
    }
  }

  const filteredAuditItems =
    auditFilter === "all"
      ? auditItems
      : auditItems.filter((i) => i.status === auditFilter);
  const groupedAuditItems = filteredAuditItems.reduce((groups, item) => {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
    return groups;
  }, {});

  function renderScreen() {
    if (currentScreen === "dashboard") {
      return (
        <div className="screen">
          <div className="top-bar">
            <div
              className="glass-icon-btn"
              onClick={() => setShowSettings(true)}
              style={{ cursor: "pointer" }}
            >
              <i className="ti ti-settings" aria-hidden="true"></i>
            </div>
          </div>

          <div className="greeting-block">
            <p className="greeting-sub">Good evening</p>
            <h1 className="greeting-name">Charity</h1>
          </div>

          <ZoneIndicator
            zone={currentZone}
            onZoneAction={handleZoneAction}
            dismissedDevices={actedDevices}
          />

          {zoneActionMsg && (
            <div
              style={{
                background: "rgba(100,220,150,0.15)",
                border: "0.5px solid rgba(100,220,150,0.4)",
                borderRadius: "10px",
                padding: "8px 12px",
                marginBottom: "10px",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(100,220,150,1)",
                  margin: 0,
                }}
              >
                <i
                  className="ti ti-circle-check"
                  style={{ marginRight: "5px" }}
                  aria-hidden="true"
                ></i>
                {zoneActionMsg}
              </p>
            </div>
          )}

          {/* Zone demo toggle -- for presentation purposes */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
            {["safe", "caution", "risk"].map((z) => (
              <button
                key={z}
                onClick={() => {
                  setCurrentZone(z);
                  setActedDevices([]);
                  setZoneActionMsg(null);
                }}
                style={{
                  flex: 1,
                  padding: "5px 4px",
                  borderRadius: "8px",
                  border: "0.5px solid rgba(255,255,255,0.2)",
                  background:
                    currentZone === z
                      ? "rgba(255,255,255,0.22)"
                      : "rgba(255,255,255,0.08)",
                  color: currentZone === z ? "#fff" : "rgba(255,255,255,0.55)",
                  fontSize: "9px",
                  fontWeight: currentZone === z ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textTransform: "capitalize",
                }}
              >
                {z}
              </button>
            ))}
          </div>

          <GlassCard
            style={{ marginBottom: "10px", cursor: "pointer" }}
            onClick={() => setShowDevices(true)}
          >
            <p className="card-label">Home status</p>
            <p className="card-title">All systems active</p>
            <div className="status-connected">
              <div className="status-dot-green"></div>
              <p className="white-text-muted small">8 devices connected</p>
            </div>
            <div className="device-preview">
              {previewDevices.map((device) => (
                <div key={device.id} className="device-preview-item">
                  <div className="glass-icon">
                    <i className={`ti ${device.icon}`} aria-hidden="true"></i>
                  </div>
                  <p className="device-preview-label">{device.name}</p>
                </div>
              ))}
              <div className="device-preview-item">
                <div className="glass-icon">
                  <p className="plus-more">+4</p>
                </div>
                <p className="device-preview-label">More</p>
              </div>
            </div>
          </GlassCard>

          <div className="stat-row">
            <GlassCard
              onClick={() => setCurrentScreen("queue")}
              style={{ cursor: "pointer" }}
            >
              <div className="glass-icon small" style={{ marginBottom: "8px" }}>
                <i className="ti ti-clock" aria-hidden="true"></i>
              </div>
              <p className="stat-number">{pendingItems.length}</p>
              <p className="white-text-muted tiny">Pending review</p>
            </GlassCard>
            <GlassCard
              onClick={() => {
                setAuditFilter("blocked");
                setCurrentScreen("audit");
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="glass-icon small" style={{ marginBottom: "8px" }}>
                <i className="ti ti-shield-off" aria-hidden="true"></i>
              </div>
              <p className="stat-number">12</p>
              <p className="white-text-muted tiny">Blocked today</p>
            </GlassCard>
          </div>

          <GlassCard
            style={{ marginBottom: "10px", cursor: "pointer" }}
            onClick={openAIGeneral}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="glass-icon small">
                <i className="ti ti-robot" aria-hidden="true"></i>
              </div>
              <div style={{ flex: 1 }}>
                <p className="white-text-bold small">Ask Hearth AI</p>
                <p className="white-text-muted tiny">
                  Questions about your data?
                </p>
              </div>
              <i
                className="ti ti-chevron-right"
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}
                aria-hidden="true"
              ></i>
            </div>
          </GlassCard>

          <GlassCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <p className="white-text-bold small">Recent activity</p>
            </div>
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`activity-row-glass ${index < activities.length - 1 ? "activity-border" : ""}`}
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="glass-icon small">
                  <i className={`ti ${activity.icon}`} aria-hidden="true"></i>
                </div>
                <div className="activity-info">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "2px",
                    }}
                  >
                    <p className="white-text-bold tiny">{activity.device}</p>
                    <CategoryTag category={activity.category} />
                  </div>
                  <p className="white-text-muted tiny">{activity.summary}</p>
                </div>
                <p className="white-text-muted tiny">{activity.time}</p>
              </div>
            ))}
          </GlassCard>
        </div>
      );
    }

    if (currentScreen === "queue") {
      if (guidedMode && pendingItems.length > 0) {
        return (
          <GuidedReview
            items={pendingItems}
            onComplete={handleGuidedComplete}
            onBack={() => setGuidedMode(false)}
          />
        );
      }
      return (
        <div className="screen">
          <h1 className="screen-title">Review Queue</h1>
          <p
            className="white-text-muted small"
            style={{ marginBottom: "16px" }}
          >
            {pendingItems.length} items waiting
          </p>

          {pendingItems.length > 0 ? (
            <>
              <button
                onClick={() => setGuidedMode(true)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.18)",
                  border: "0.5px solid rgba(255,255,255,0.3)",
                  borderRadius: "20px",
                  padding: "16px",
                  marginBottom: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                  }}
                >
                  <i
                    className="ti ti-robot"
                    style={{ fontSize: "18px", color: "#fff" }}
                    aria-hidden="true"
                  ></i>
                  <p className="white-text-bold" style={{ margin: 0 }}>
                    Let Hearth guide you
                  </p>
                </div>
                <p
                  className="white-text-muted small"
                  style={{ marginBottom: "10px" }}
                >
                  Not sure what to allow? Ask Hearth to walk you through each
                  request.
                </p>
                <div
                  className="glass-pill-btn"
                  style={{ pointerEvents: "none" }}
                >
                  <p>Start guided review</p>
                </div>
              </button>

              <p className="guided-request-label" style={{ marginTop: 0 }}>
                Or review manually
              </p>
              {pendingItems.map((item) => (
                <QueueCard
                  key={item.id}
                  item={item}
                  onAllow={handleAllow}
                  onBlock={handleBlock}
                />
              ))}
            </>
          ) : (
            <GlassCard style={{ textAlign: "center", padding: "40px 20px" }}>
              <i
                className="ti ti-circle-check"
                style={{
                  fontSize: "36px",
                  color: "rgba(100,220,150,1)",
                  marginBottom: "8px",
                  display: "block",
                }}
                aria-hidden="true"
              ></i>
              <p className="white-text-bold">All caught up!</p>
              <p className="white-text-muted small">
                No pending requests right now.
              </p>
            </GlassCard>
          )}
        </div>
      );
    }

    if (currentScreen === "agent") {
      return (
        <AIAgent
          initialContext={aiContext}
          deviceToggles={deviceToggles}
          categorySettings={categorySettings}
          currentZone={currentZone}
          pendingItems={pendingItems}
          onBack={
            aiContext
              ? () => {
                  setAiContext(null);
                  setCurrentScreen("audit");
                }
              : null
          }
        />
      );
    }

    if (currentScreen === "audit") {
      return (
        <div className="screen">
          <h1 className="screen-title">Audit Trail</h1>
          <p
            className="white-text-muted small"
            style={{ marginBottom: "16px" }}
          >
            A complete record of your home data
          </p>
          <div className="audit-filters">
            {["all", "allowed", "blocked", "pending"].map((filter) => (
              <button
                key={filter}
                className={`glass-filter-btn ${auditFilter === filter ? "glass-filter-active" : ""}`}
                onClick={() => setAuditFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          {Object.entries(groupedAuditItems).map(([date, items]) => (
            <div key={date}>
              <p className="guided-request-label">{date}</p>
              {items.map((item) => (
                <GlassCard
                  key={item.id}
                  style={{ marginBottom: "8px", cursor: "pointer" }}
                  onClick={() => setSelectedAuditItem(item)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <div className="glass-icon small">
                      <i className={`ti ${item.icon}`} aria-hidden="true"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginBottom: "2px",
                        }}
                      >
                        <p className="white-text-bold tiny">{item.device}</p>
                        <CategoryTag category={item.category} />
                      </div>
                      <p className="white-text-muted tiny">{item.summary}</p>
                      <p className="white-text-muted tiny">{item.time}</p>
                    </div>
                    <StatusDot status={item.status} />
                  </div>
                </GlassCard>
              ))}
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div className="phone-frame">
      <div className="app" style={{ backgroundImage: `url(${BG_IMAGE})` }}>
        <div className="content">{renderScreen()}</div>

        {selectedActivity && (
          <div
            className="modal-scrim"
            onClick={() => setSelectedActivity(null)}
          >
            <GlassCard
              style={{ width: "85%", maxWidth: "340px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <p
                className="white-text-bold"
                style={{ fontSize: "16px", marginBottom: "4px" }}
              >
                {selectedActivity.device}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <p className="white-text-muted small">
                  {selectedActivity.summary}
                </p>
                <CategoryTag category={selectedActivity.category} />
              </div>
              <p
                className="white-text-muted tiny"
                style={{ marginBottom: "12px" }}
              >
                Collected: {selectedActivity.timestamp}
              </p>
              <p
                className="white-text small"
                style={{ lineHeight: 1.6, marginBottom: "16px" }}
              >
                {selectedActivity.description}
              </p>
              <button
                className="glass-btn-primary full-width"
                onClick={() => setSelectedActivity(null)}
              >
                Close
              </button>
            </GlassCard>
          </div>
        )}

        {selectedAuditItem && (
          <div
            className="modal-scrim"
            onClick={() => setSelectedAuditItem(null)}
          >
            <div
              className="bottom-sheet-glass"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bottom-sheet-handle"></div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div className="glass-icon small">
                  <i
                    className={`ti ${selectedAuditItem.icon}`}
                    aria-hidden="true"
                  ></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <p className="white-text-bold small">
                      {selectedAuditItem.device}
                    </p>
                    <CategoryTag category={selectedAuditItem.category} />
                  </div>
                  <p className="white-text-muted tiny">
                    {selectedAuditItem.date} at {selectedAuditItem.time}
                  </p>
                </div>
                <StatusDot status={selectedAuditItem.status} />
              </div>
              <div
                style={{
                  height: "0.5px",
                  background: "rgba(255,255,255,0.15)",
                  marginBottom: "14px",
                }}
              ></div>
              <div className="guided-info-block">
                <p className="guided-info-label">What happened</p>
                <p className="white-text small">
                  {selectedAuditItem.description}
                </p>
              </div>
              <div className="guided-info-block">
                <p className="guided-info-label">Decision</p>
                <p className="white-text small">{selectedAuditItem.decision}</p>
              </div>
              {selectedAuditItem.protected && (
                <div className="guided-info-block">
                  <p className="guided-info-label">What was protected</p>
                  <p className="white-text small">
                    {selectedAuditItem.protected}
                  </p>
                </div>
              )}
              <GlassCard
                style={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  padding: "10px 14px",
                }}
                onClick={() => openAIWithContext(selectedAuditItem)}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i
                    className="ti ti-robot"
                    style={{ fontSize: "14px", color: "#fff" }}
                    aria-hidden="true"
                  ></i>
                  <p className="white-text-bold small">
                    Have questions? Ask Hearth AI
                  </p>
                  <i
                    className="ti ti-chevron-right"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "13px",
                      marginLeft: "auto",
                    }}
                    aria-hidden="true"
                  ></i>
                </div>
              </GlassCard>
              <button
                className="glass-btn-primary full-width"
                onClick={() => setSelectedAuditItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showDevices && (
          <div className="modal-scrim" onClick={() => setShowDevices(false)}>
            <GlassCard
              style={{ width: "85%", maxWidth: "340px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <p className="white-text-bold" style={{ fontSize: "16px" }}>
                  Connected devices
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(100,220,150,1)",
                    fontWeight: 600,
                  }}
                >
                  8 active
                </p>
              </div>
              {devices.map((device, index) => (
                <div
                  key={device.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0",
                    borderBottom:
                      index < devices.length - 1
                        ? "0.5px solid rgba(255,255,255,0.12)"
                        : "none",
                  }}
                >
                  <div className="glass-icon small">
                    <i className={`ti ${device.icon}`} aria-hidden="true"></i>
                  </div>
                  <p className="white-text small" style={{ flex: 1 }}>
                    {device.name}
                  </p>
                  <div
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#4ADE80",
                      boxShadow: "0 0 6px rgba(74,222,128,0.8)",
                    }}
                  ></div>
                </div>
              ))}
              <button
                className="glass-btn-primary full-width"
                style={{ marginTop: "16px" }}
                onClick={() => setShowDevices(false)}
              >
                Close
              </button>
            </GlassCard>
          </div>
        )}

        {showSettings && (
          <div className="drawer-scrim" onClick={() => setShowSettings(false)}>
            <div className="drawer-glass" onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div
                  className="glass-icon-btn"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowSettings(false)}
                >
                  <i className="ti ti-x" aria-hidden="true"></i>
                </div>
                <p className="white-text-bold" style={{ fontSize: "18px" }}>
                  Settings
                </p>
              </div>
              {[
                {
                  key: "devices",
                  label: "Connected devices",
                  icon: "ti-devices",
                },
                {
                  key: "categories",
                  label: "Data category rules",
                  icon: "ti-tag",
                },
                { key: "about", label: "About Hearth", icon: "ti-info-circle" },
              ].map((section) => (
                <div key={section.key} className="drawer-section-glass">
                  <div
                    className="drawer-section-header-glass"
                    onClick={() => toggleSection(section.key)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <i
                        className={`ti ${section.icon}`}
                        style={{
                          fontSize: "16px",
                          color: "rgba(255,255,255,0.8)",
                        }}
                        aria-hidden="true"
                      ></i>
                      <p className="white-text-bold small">{section.label}</p>
                    </div>
                    <i
                      className={`ti ${expandedSection === section.key ? "ti-chevron-up" : "ti-chevron-down"}`}
                      style={{
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.6)",
                      }}
                      aria-hidden="true"
                    ></i>
                  </div>
                  {expandedSection === section.key && (
                    <div className="drawer-section-content-glass">
                      {section.key === "devices" &&
                        devices.map((device, index) => (
                          <div
                            key={device.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "10px 0",
                              borderBottom:
                                index < devices.length - 1
                                  ? "0.5px solid rgba(255,255,255,0.1)"
                                  : "none",
                            }}
                          >
                            <div className="glass-icon small">
                              <i
                                className={`ti ${device.icon}`}
                                aria-hidden="true"
                              ></i>
                            </div>
                            <p className="white-text small" style={{ flex: 1 }}>
                              {device.name}
                            </p>
                            <div
                              className={`toggle ${deviceToggles[device.id] ? "toggle-on-glass" : "toggle-off-glass"}`}
                              onClick={() => toggleDevice(device.id)}
                            >
                              <div className="toggle-knob"></div>
                            </div>
                          </div>
                        ))}
                      {section.key === "categories" &&
                        categoryRules.map((cat, index) => (
                          <div
                            key={cat.key}
                            style={{
                              padding: "10px 0",
                              borderBottom:
                                index < categoryRules.length - 1
                                  ? "0.5px solid rgba(255,255,255,0.1)"
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "8px",
                              }}
                            >
                              <CategoryTag category={cat.key} />
                              <p className="white-text-muted tiny">
                                {cat.description}
                              </p>
                            </div>
                            <div style={{ display: "flex", gap: "4px" }}>
                              {["ask", "auto", "block"].map((rule) => (
                                <button
                                  key={rule}
                                  className={`glass-rule-btn ${categorySettings[cat.key] === rule ? "glass-rule-active" : ""}`}
                                  onClick={() => setCategoryRule(cat.key, rule)}
                                >
                                  {rule === "ask"
                                    ? "Always ask"
                                    : rule === "auto"
                                      ? "Auto-approve"
                                      : "Always block"}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      {section.key === "about" && (
                        <p
                          className="white-text-muted small"
                          style={{ padding: "10px 0", lineHeight: 1.6 }}
                        >
                          Hearth monitors your smart home network and gives you
                          full visibility and control over your data. Nothing
                          leaves your home without your knowledge.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <nav className="floating-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`floating-nav-btn ${currentScreen === item.id ? "floating-nav-active" : ""}`}
              onClick={() => {
                setAiContext(null);
                setCurrentScreen(item.id);
              }}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <i className={`ti ${item.icon}`} aria-hidden="true"></i>
                {item.id === "queue" && pendingItems.length > 0 && (
                  <div className="nav-badge">{pendingItems.length}</div>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default App;
