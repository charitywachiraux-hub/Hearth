import { useId } from "react";

// Hearth's character: a pearl glass cloud with two eyes.
// Inside the glass sit three soft glows in Hearth's status colours, green,
// orange and red, that slowly drift and pulse. The cloud holds every state of
// the home rather than looking like any one of them.
// One drawing, used everywhere Hearth AI appears (dashboard, chat avatar,
// Guided Review, voice mode), so people always recognise who they are talking to.
//
// state: "idle" | "curious" | "listening" | "thinking" | "speaking" | "preparing" | "paused"
// level: 0 to 1, how loud the person is speaking (listening only)

const SHAPE = (
  <>
    <circle cx="40" cy="62" r="25" />
    <circle cx="60" cy="44" r="27" />
    <circle cx="84" cy="56" r="24" />
    <circle cx="74" cy="78" r="22" />
    <circle cx="47" cy="82" r="20" />
    <ellipse cx="62" cy="66" rx="34" ry="24" />
  </>
);

export default function HearthCharacter({
  size = 120,
  state = "idle",
  level = 0,
}) {
  // Each cloud needs its own ids for its clip path and filters.
  const id = "hb" + useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <span
      className={`hearth-buddy ${state}`}
      style={{ width: size, height: size, "--level": level }}
      role="img"
      aria-label="Hearth"
    >
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <defs>
          <clipPath id={`${id}-clip`}>{SHAPE}</clipPath>
          <filter
            id={`${id}-blur`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <radialGradient id={`${id}-light`} cx="35%" cy="22%" r="55%">
            <stop offset="0" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.6" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.12" />
          </linearGradient>
          {/* thin bright rim around the edge, like Liquid Glass */}
          <filter id={`${id}-rim`} x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology
              operator="erode"
              radius="1.4"
              in="SourceAlpha"
              result="inner"
            />
            <feComposite
              in="SourceAlpha"
              in2="inner"
              operator="out"
              result="ring"
            />
            <feFlood floodColor="#fff" floodOpacity="0.85" />
            <feComposite in2="ring" operator="in" />
          </filter>
          <filter
            id={`${id}-eyes`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1.2"
              floodColor="#000"
              floodOpacity="0.25"
            />
          </filter>
        </defs>

        <g className="hb-body">
          {/* pearl glass with three drifting glows inside */}
          <g clipPath={`url(#${id}-clip)`}>
            <rect
              x="-10"
              y="-5"
              width="140"
              height="130"
              fill="#fffaf4"
              opacity="0.72"
            />
            <g filter={`url(#${id}-blur)`} opacity="0.6">
              {/* the colour circulates inside the glass, like blood moving
                  through a body; the clip keeps it inside the cloud */}
              <g className="hb-flow">
                <circle
                  className="hb-glow hb-glow-safe"
                  cx="32"
                  cy="40"
                  r="26"
                  fill="#30D158"
                />
                <circle
                  className="hb-glow hb-glow-caution"
                  cx="92"
                  cy="50"
                  r="24"
                  fill="#FF9F0A"
                />
                <circle
                  className="hb-glow hb-glow-risk"
                  cx="64"
                  cy="98"
                  r="22"
                  fill="#FF453A"
                />
              </g>
            </g>
            <rect
              x="-10"
              y="-5"
              width="140"
              height="130"
              fill={`url(#${id}-shade)`}
            />
            <rect
              x="-10"
              y="-5"
              width="140"
              height="130"
              fill={`url(#${id}-light)`}
            />
          </g>
          <g filter={`url(#${id}-rim)`}>{SHAPE}</g>
          <ellipse
            cx="50"
            cy="34"
            rx="12"
            ry="5.5"
            fill="#fff"
            opacity="0.8"
            transform="rotate(-18 50 34)"
          />
          <g className="hb-eyes" filter={`url(#${id}-eyes)`}>
            <rect
              className="hb-eye"
              x="47"
              y="52"
              width="9"
              height="20"
              rx="4.5"
              fill="#fff"
            />
            <rect
              className="hb-eye"
              x="66"
              y="52"
              width="9"
              height="20"
              rx="4.5"
              fill="#fff"
            />
          </g>
        </g>
      </svg>
    </span>
  );
}
