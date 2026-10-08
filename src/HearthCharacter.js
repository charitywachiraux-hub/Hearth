// Hearth's character: a small warm cloud with two eyes.
// One drawing, used everywhere Hearth AI appears (chat avatar, voice mode),
// so people always recognise who they are talking to.
//
// state: "idle" | "listening" | "thinking" | "speaking" | "preparing" | "paused"
// level: 0 to 1, how loud the person is speaking (listening only)

export default function HearthCharacter({
  size = 120,
  state = "idle",
  level = 0,
}) {
  return (
    <span
      className={`hearth-buddy ${state}`}
      style={{ width: size, height: size, "--level": level }}
      role="img"
      aria-label="Hearth"
    >
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <defs>
          <radialGradient
            id="hb-fill"
            gradientUnits="userSpaceOnUse"
            cx="46"
            cy="38"
            r="78"
          >
            <stop offset="0%" stopColor="#FFB067" />
            <stop offset="55%" stopColor="#FF7A1A" />
            <stop offset="100%" stopColor="#E85A0C" />
          </radialGradient>
        </defs>
        <g className="hb-body">
          {/* overlapping puffs read as one soft cloud */}
          <g fill="url(#hb-fill)">
            <circle cx="40" cy="62" r="25" />
            <circle cx="60" cy="44" r="27" />
            <circle cx="84" cy="56" r="24" />
            <circle cx="74" cy="78" r="22" />
            <circle cx="47" cy="82" r="20" />
            <ellipse cx="62" cy="66" rx="34" ry="24" />
          </g>
          {/* soft top light, like the rim on Liquid Glass */}
          <ellipse
            cx="50"
            cy="34"
            rx="12"
            ry="6"
            fill="#fff"
            opacity="0.28"
            transform="rotate(-18 50 34)"
          />
          <g className="hb-eyes">
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
