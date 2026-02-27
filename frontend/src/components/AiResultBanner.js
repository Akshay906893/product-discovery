import React from "react";

const styles = {
  banner: {
    background: "var(--surface)",
    border: "1.5px solid var(--accent)",
    borderRadius: "var(--card-radius)",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    animation: "fadeIn 0.4s ease",
    boxShadow: "0 0 32px rgba(232,255,71,0.05)",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    fontSize: "0.8rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--accent)",
  },
  dot: {
    width: "8px",
    height: "8px",
    background: "var(--accent)",
    borderRadius: "50%",
    animation: "pulse 1.5s ease infinite",
  },
  intent: {
    fontSize: "11px",
    padding: "4px 12px",
    background: "rgba(124,106,247,0.15)",
    border: "1px solid rgba(124,106,247,0.3)",
    borderRadius: "99px",
    color: "var(--accent2)",
    fontWeight: "500",
  },
  summary: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    lineHeight: 1.6,
  },
  matchCount: {
    fontSize: "12px",
    color: "var(--text-dim)",
    fontWeight: "500",
  },
  clearBtn: {
    fontSize: "12px",
    color: "var(--text-dim)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0",
    fontFamily: "var(--font-body)",
    transition: "color 0.15s",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
};

export default function AiResultBanner({ result, onClear }) {
  if (!result) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.topRow}>
        <div style={styles.badge}>
          <span style={styles.dot} />
          AI Result
        </div>
        {result.intent && result.intent !== "unknown" && (
          <span style={styles.intent}>Intent: {result.intent}</span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginLeft: "auto" }}>
          <span style={styles.matchCount}>
            {result.products?.length || 0} match{(result.products?.length || 0) !== 1 ? "es" : ""}
          </span>
          <button
            style={styles.clearBtn}
            onClick={onClear}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; }}
          >
            Clear ×
          </button>
        </div>
      </div>
      {result.summary && <p style={styles.summary}>{result.summary}</p>}
    </div>
  );
}
