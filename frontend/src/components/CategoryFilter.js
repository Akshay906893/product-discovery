import React from "react";

const styles = {
  wrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    alignItems: "center",
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    fontFamily: "var(--font-display)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-dim)",
    marginRight: "4px",
  },
  btn: {
    padding: "6px 16px",
    borderRadius: "99px",
    border: "1.5px solid var(--border)",
    background: "transparent",
    color: "var(--text-muted)",
    fontSize: "13px",
    fontFamily: "var(--font-body)",
    fontWeight: "500",
    transition: "all 0.15s",
    cursor: "pointer",
  },
  btnActive: {
    background: "var(--accent2)",
    borderColor: "var(--accent2)",
    color: "#fff",
  },
};

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div style={styles.wrapper}>
      <span style={styles.label}>Filter</span>
      {["All", ...categories].map((cat) => {
        const isActive = (cat === "All" && !active) || cat === active;
        return (
          <button
            key={cat}
            style={{ ...styles.btn, ...(isActive ? styles.btnActive : {}) }}
            onClick={() => onChange(cat === "All" ? "" : cat)}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = "var(--accent2)";
                e.currentTarget.style.color = "var(--text)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
