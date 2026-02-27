# ShopSense — AI Product Discovery

A mini product discovery app with a Node/Express backend, React frontend, and OpenAI-powered natural-language "Ask AI" search.

---

## Project Structure

```
product-discovery/
├── backend/          # Node.js + Express API
│   ├── server.js     # Main entry point
│   ├── products.js   # In-memory product catalog (10 products)
│   ├── .env.example  # Environment variable template
│   └── package.json
└── frontend/         # React app (Create React App)
    ├── src/
    │   ├── App.js
    │   ├── hooks/useProducts.js     # Data-fetching hooks
    │   └── components/
    │       ├── ProductCard.js       # Reusable product card
    │       ├── AskBar.js            # Natural-language query input
    │       ├── CategoryFilter.js    # Category filter buttons
    │       └── AiResultBanner.js    # AI result summary banner
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- Node.js ≥ 18
- An OpenAI API key ([get one here](https://platform.openai.com/api-keys))

---

## Setup & Run

### 1. Backend

```bash
cd backend
npm install

# Copy env template and add your key
cp .env.example .env
# Edit .env and set OPENAI_API_KEY=sk-...

npm run dev       # development (nodemon)
# or
npm start         # production
```

Backend runs on **http://localhost:4000**

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000** and proxies `/api/*` to the backend.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable         | Required | Default       | Description                        |
|------------------|----------|---------------|------------------------------------|
| `OPENAI_API_KEY` | ✅ Yes   | —             | Your OpenAI API key                |
| `OPENAI_MODEL`   | No       | `gpt-4o-mini` | OpenAI model to use                |
| `PORT`           | No       | `4000`        | Port for the Express server        |

### Frontend (`frontend/.env`)

| Variable              | Required | Default | Description                        |
|-----------------------|----------|---------|------------------------------------|
| `REACT_APP_API_URL`   | No       | `""`    | Override backend URL (for deploy)  |

---

## API Endpoints

### `GET /api/products`
Returns all products. Supports optional query params:
- `?category=Laptop` — filter by category
- `?q=gaming` — keyword search across name/description/tags

**Response:**
```json
{ "products": [...], "total": 10 }
```

### `GET /api/products/:id`
Returns a single product by ID.

### `GET /api/categories`
Returns all unique category names.

### `POST /api/ask`
Accepts a natural-language query and returns AI-matched products.

**Request:**
```json
{ "query": "Show me budget laptops for students" }
```

**Response:**
```json
{
  "productIds": ["1"],
  "products": [{ "id": "1", "name": "ProBook UltraSlim 14", ... }],
  "summary": "The ProBook UltraSlim 14 is a great budget laptop...",
  "intent": "budget laptop for students"
}
```

### `GET /health`
Health check — returns `{ "status": "ok" }`.

---

## How the AI Integration Works

1. **User types a query** in the "Ask AI" input box.
2. **Frontend** sends `POST /api/ask` with `{ "query": "..." }`.
3. **Backend** builds a prompt that includes:
   - The full product catalog (id, name, category, price, tags, description)
   - Instructions to return a structured JSON with `productIds`, `summary`, and `intent`
4. **OpenAI** (`gpt-4o-mini` by default) interprets the user's intent and selects the most relevant products.
5. **Backend** parses the JSON response, hydrates product IDs into full product objects, and returns them.
6. **Frontend** displays the AI summary banner and the matched product cards.

Errors (rate limits, invalid key, timeouts) are caught and returned as safe error messages — raw API errors are never exposed to the frontend.

---

## Design Decisions

- **No database:** Products are stored in memory (`products.js`) — sufficient for this scope.
- **Structured prompts:** The system prompt explicitly asks for JSON output, which is more reliable than parsing free-form text.
- **Graceful fallback:** If JSON parsing fails, the raw LLM text is returned as a summary (no crash).
- **Proxy:** CRA's `proxy` field in `package.json` avoids CORS issues in development.

---

## Time Spent

~3 hours total:
- ~1h backend + LLM integration
- ~1.5h frontend + design
- ~30min README + testing

---

## What I'd Add With More Time

- **Product detail page** (`/products/:id`) with an AI-generated one-liner blurb
- **Response caching** (e.g. Redis) for repeated queries
- **Streaming** the LLM response for a better UX
- **Tests** for the `/api/ask` endpoint (mock OpenAI, test prompt structure and error paths)
- **Deployment** (Vercel for frontend, Railway/Render for backend)
