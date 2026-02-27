import React, { useState, useEffect } from "react";
import { useProducts, askAI, fetchCategories } from "./hooks/useProducts";
import ProductCard from "./components/ProductCard";
import AskBar from "./components/AskBar";
import CategoryFilter from "./components/CategoryFilter";
import AiResultBanner from "./components/AiResultBanner";

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const S = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },

  /* header */
  header: {
    borderBottom: "1px solid var(--border)",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
    position: "sticky",
    top: 0,
    background: "rgba(10,10,15,0.85)",
    backdropFilter: "blur(12px)",
    zIndex: 100,
    WebkitBackdropFilter: "blur(12px)",
  },
  logo: {
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    fontSize: "1.3rem",
    color: "var(--text)",
    letterSpacing: "-0.02em",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoAccent: {
    color: "var(--accent)",
  },
  headerRight: {
    fontSize: "12px",
    color: "var(--text-dim)",
    fontWeight: "500",
    fontFamily: "var(--font-display)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },

  /* hero */
  hero: {
    padding: "64px 32px 40px",
    maxWidth: "900px",
    margin: "0 auto",
    width: "100%",
    animation: "fadeUp 0.5s ease both",
  },
  heroEyebrow: {
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  heroTitle: {
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    fontSize: "clamp(2rem, 5vw, 3.25rem)",
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    color: "var(--text)",
    marginBottom: "16px",
  },
  heroSub: {
    color: "var(--text-muted)",
    fontSize: "1.05rem",
    maxWidth: "520px",
    marginBottom: "40px",
    fontWeight: "300",
  },

  /* main layout */
  main: {
    flex: 1,
    maxWidth: "1280px",
    margin: "0 auto",
    width: "100%",
    padding: "0 32px 64px",
  },

  /* ask section */
  askSection: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "28px 32px",
    marginBottom: "40px",
    animation: "fadeUp 0.5s 0.1s ease both",
    opacity: 0,
    animationFillMode: "forwards",
  },

  /* divider */
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
    animation: "fadeIn 0.5s 0.15s ease both",
    opacity: 0,
    animationFillMode: "forwards",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "var(--border)",
  },
  dividerLabel: {
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--text-dim)",
  },

  /* catalog toolbar */
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
    animation: "fadeIn 0.5s 0.2s ease both",
    opacity: 0,
    animationFillMode: "forwards",
  },
  count: {
    fontFamily: "var(--font-display)",
    fontWeight: "600",
    fontSize: "0.85rem",
    color: "var(--text-dim)",
    letterSpacing: "0.04em",
  },

  /* grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },

  /* loading / error states */
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "240px",
    gap: "16px",
    color: "var(--text-muted)",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid var(--border)",
    borderTop: "3px solid var(--accent)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  errorBox: {
    background: "rgba(255,79,106,0.08)",
    border: "1px solid rgba(255,79,106,0.3)",
    borderRadius: "12px",
    padding: "16px 20px",
    color: "var(--red)",
    fontSize: "0.9rem",
    marginBottom: "24px",
    animation: "fadeIn 0.3s ease",
  },
  empty: {
    textAlign: "center",
    padding: "48px",
    color: "var(--text-dim)",
    fontFamily: "var(--font-display)",
    fontWeight: "600",
    fontSize: "1rem",
  },
};

/* ─── App ──────────────────────────────────────────────────────────────────── */
export default function App() {
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const { products, loading, error } = useProducts(activeCategory);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const handleAsk = async (query) => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    setActiveCategory(""); // reset filter when asking AI
    try {
      const result = await askAI(query);
      setAiResult(result);
    } catch (err) {
      setAiError(err.message || "AI request failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleClearAi = () => {
    setAiResult(null);
    setAiError(null);
  };

  // Determine which products to show
  const displayProducts = aiResult ? aiResult.products : products;
  const aiProductIds = aiResult ? new Set(aiResult.productIds.map(String)) : new Set();

  return (
    <div style={S.app}>
      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.logo}>
          Shop<span style={S.logoAccent}>Sense</span>
        </div>
        <span style={S.headerRight}>AI Product Discovery</span>
      </header>

      {/* ── Hero ── */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", padding: "0 32px" }}>
        <div style={S.hero}>
          <p style={S.heroEyebrow}>✦ Powered by AI</p>
          <h1 style={S.heroTitle}>
            Find the perfect<br />
            product, <em style={{ fontStyle: "normal", color: "var(--accent)" }}>instantly.</em>
          </h1>
          <p style={S.heroSub}>
            Describe what you need in plain English. Our AI scans the catalog and surfaces the best matches, no filters needed.
          </p>
        </div>
      </section>

      {/* ── Main ── */}
      <main style={S.main}>

        {/* Ask section */}
        <div style={S.askSection}>
          <AskBar onAsk={handleAsk} loading={aiLoading} />
        </div>

        {/* AI error */}
        {aiError && (
          <div style={S.errorBox}>
            ⚠ {aiError}
          </div>
        )}

        {/* AI result banner */}
        {aiResult && (
          <div style={{ marginBottom: "28px", animation: "fadeUp 0.4s ease" }}>
            <AiResultBanner result={aiResult} onClear={handleClearAi} />
          </div>
        )}

        {/* Catalog section */}
        {!aiResult && (
          <>
            <div style={S.divider}>
              <div style={S.dividerLine} />
              <span style={S.dividerLabel}>Full Catalog</span>
              <div style={S.dividerLine} />
            </div>

            <div style={S.toolbar}>
              <CategoryFilter
                categories={categories}
                active={activeCategory}
                onChange={setActiveCategory}
              />
              {!loading && (
                <span style={S.count}>
                  {products.length} product{products.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </>
        )}

        {/* Product grid */}
        {loading && !aiResult && (
          <div style={S.center}>
            <div style={S.spinner} />
            <span>Loading catalog…</span>
          </div>
        )}

        {error && !aiResult && (
          <div style={{ ...S.errorBox, textAlign: "center" }}>⚠ {error}</div>
        )}

        {!loading && !error && displayProducts.length === 0 && (
          <div style={S.empty}>
            {aiResult
              ? "No products matched your query. Try rephrasing!"
              : "No products found."}
          </div>
        )}

        {(!loading || aiResult) && displayProducts.length > 0 && (
          <div style={S.grid}>
            {displayProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                highlighted={aiProductIds.has(String(product.id))}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "20px 32px",
        textAlign: "center",
        color: "var(--text-dim)",
        fontSize: "12px",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
      }}>
        ShopSense — AI Product Discovery Demo
      </footer>
    </div>
  );
}
