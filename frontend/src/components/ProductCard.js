import React from "react";

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--card-radius)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    animation: "fadeUp 0.4s ease both",
    position: "relative",
    overflow: "hidden",
  },
  highlighted: {
    borderColor: "var(--accent)",
    boxShadow: "0 0 0 1px var(--accent), 0 8px 32px rgba(232,255,71,0.08)",
  },
  highlightBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "var(--accent)",
    color: "#0a0a0f",
    fontSize: "10px",
    fontWeight: "700",
    fontFamily: "var(--font-display)",
    letterSpacing: "0.08em",
    padding: "3px 8px",
    borderRadius: "99px",
    textTransform: "uppercase",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  category: {
    fontSize: "10px",
    fontWeight: "600",
    fontFamily: "var(--font-display)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--accent2)",
  },
  name: {
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    fontSize: "1.05rem",
    color: "var(--text)",
    lineHeight: 1.3,
    paddingRight: "48px",
  },
  description: {
    fontSize: "0.825rem",
    color: "var(--text-muted)",
    lineHeight: 1.55,
    flexGrow: 1,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  tag: {
    fontSize: "10px",
    padding: "3px 8px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "99px",
    color: "var(--text-muted)",
    letterSpacing: "0.04em",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: "8px",
    borderTop: "1px solid var(--border)",
  },
  price: {
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    fontSize: "1.25rem",
    color: "var(--text)",
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  stars: {
    fontSize: "12px",
    color: "#f5c542",
    letterSpacing: "-1px",
  },
  ratingNum: {
    fontSize: "12px",
    color: "var(--text-muted)",
    fontWeight: "500",
  },
  outOfStock: {
    fontSize: "11px",
    color: "var(--red)",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
};

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={styles.stars}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function ProductCard({ product, highlighted = false, style = {} }) {
  const [hovered, setHovered] = React.useState(false);

  const cardStyle = {
    ...styles.card,
    ...(highlighted ? styles.highlighted : {}),
    ...(hovered && !highlighted ? { borderColor: "var(--border)", transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" } : {}),
    ...(hovered && highlighted ? { transform: "translateY(-2px)" } : {}),
    ...style,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {highlighted && <span style={styles.highlightBadge}>AI Match</span>}
      <div style={styles.header}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.name}>{product.name}</h3>
      </div>

      <p style={styles.description}>{product.description}</p>

      <div style={styles.tags}>
        {product.tags.slice(0, 4).map((t) => (
          <span key={t} style={styles.tag}>{t}</span>
        ))}
      </div>

      <div style={styles.footer}>
        <span style={styles.price}>${product.price.toLocaleString()}</span>
        <div style={styles.ratingRow}>
          <Stars rating={product.rating} />
          <span style={styles.ratingNum}>{product.rating}</span>
          {!product.inStock && (
            <span style={styles.outOfStock}>· Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
