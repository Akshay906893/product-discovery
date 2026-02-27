require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const products = require("./products");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── GET /api/products ───────────────────────────────────────────────────────
// Optional query params: ?category=Laptop  ?q=gaming
app.get("/api/products", (req, res) => {
  let result = [...products];

  const { category, q } = req.query;

  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (q) {
    const query = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.includes(query)) ||
        p.category.toLowerCase().includes(query)
    );
  }

  res.json({ products: result, total: result.length });
});

// ─── GET /api/products/:id ────────────────────────────────────────────────────
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// ─── GET /api/categories ─────────────────────────────────────────────────────
app.get("/api/categories", (req, res) => {
  const categories = [...new Set(products.map((p) => p.category))];
  res.json({ categories });
});

// ─── POST /api/ask ────────────────────────────────────────────────────────────
// Body: { "query": "Show me budget laptops" }
app.post("/api/ask", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "query field is required and must be a non-empty string." });
  }

  // Build product catalog context for the prompt
  const catalogContext = products
    .map(
      (p) =>
        `ID:${p.id} | ${p.name} | ${p.category} | $${p.price} | Tags: ${p.tags.join(", ")} | ${p.description}`
    )
    .join("\n");

  const systemPrompt = `You are a helpful product discovery assistant for a tech e-commerce store.
Given a user query, analyze it and return the most relevant products from the catalog.

Product catalog:
${catalogContext}

Instructions:
- Identify which products best match the user's intent (budget, category, use-case, features, etc.)
- Return ONLY a valid JSON object in this exact shape (no markdown, no extra text):
{
  "productIds": ["1", "3"],
  "summary": "A short 1-2 sentence explanation of why these products match the query.",
  "intent": "A brief label for what the user is looking for, e.g. 'budget audio' or 'gaming setup'"
}
- Include 1–5 product IDs maximum, ordered by relevance.
- If no products match, return an empty productIds array with an honest summary.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query.trim() },
      ],
      temperature: 0.2,
      max_tokens: 300,
    });

    const raw = completion.choices[0]?.message?.content?.trim();

    if (!raw) {
      return res.status(502).json({ error: "Empty response from AI service." });
    }

    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback: return raw summary without product IDs
      return res.json({
        productIds: [],
        products: [],
        summary: raw,
        intent: "unknown",
      });
    }

    const { productIds = [], summary = "", intent = "" } = parsed;

    // Hydrate product IDs → full product objects
    const matchedProducts = productIds
      .map((id) => products.find((p) => p.id === String(id)))
      .filter(Boolean);

    return res.json({ productIds, products: matchedProducts, summary, intent });
  } catch (err) {
    console.error("LLM error:", err?.message || err);

    // Don't expose internal error details to the client
    if (err?.status === 401) {
      return res.status(502).json({ error: "AI service authentication failed. Check your API key." });
    }
    if (err?.status === 429) {
      return res.status(503).json({ error: "AI service is rate-limited. Please try again shortly." });
    }
    return res.status(502).json({ error: "AI service is currently unavailable. Please try again." });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
