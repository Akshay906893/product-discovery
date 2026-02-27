import React, { useState } from "react";

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    fontSize: "0.85rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    background: "var(--surface)",
    border: "1.5px solid var(--border)",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: "1rem",
    fontWeight: "400",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    lineHeight: 1.5,
  },
  button: {
    background: "var(--accent)",
    color: "#0a0a0f",
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    fontSize: "0.9rem",
    letterSpacing: "0.04em",
    transition: "opacity 0.15s, transform 0.15s",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  hints: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  hint: {
    fontSize: "12px",
    padding: "5px 12px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "99px",
    color: "var(--text-muted)",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
    fontFamily: "var(--font-body)",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(0,0,0,0.3)",
    borderTop: "2px solid #0a0a0f",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};

const EXAMPLE_QUERIES = [
  "Budget laptop for students",
  "Best gaming setup under $500",
  "Something for digital artists",
  "Wireless audio gear",
  "Compact home office PC",
];

export default function AskBar({ onAsk, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim() && !loading) onAsk(query.trim());
  };

  const useHint = (hint) => {
    setQuery(hint);
    if (!loading) onAsk(hint);
  };

  return (
    <div style={styles.wrapper}>
      <span style={styles.label}>
        <span>✦</span> Ask AI
      </span>

      <form style={styles.inputRow} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`e.g. "Show me budget laptops" or "What's good for gaming?"`}
          disabled={loading}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "0 0 0 3px rgba(232,255,71,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          type="submit"
          style={{ ...styles.button, ...(loading || !query.trim() ? styles.buttonDisabled : {}) }}
          disabled={loading || !query.trim()}
          onMouseEnter={(e) => { if (!loading && query.trim()) e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {loading ? <div style={styles.spinner} /> : "→"}
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>

      <div style={styles.hints}>
        {EXAMPLE_QUERIES.map((h) => (
          <button
            key={h}
            style={styles.hint}
            onClick={() => useHint(h)}
            disabled={loading}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            {h}
          </button>
        ))}
      </div>
    </div>
  );
}
