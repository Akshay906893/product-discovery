import { useState, useEffect, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "";

export function useProducts(category = "") {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = category ? `?category=${encodeURIComponent(category)}` : "";
      const res = await fetch(`${API}/api/products${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      setError("Could not load products. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export async function askAI(query) {
  const res = await fetch(`${API}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "AI request failed");
  return data;
}

export async function fetchCategories() {
  const res = await fetch(`${API}/api/categories`);
  const data = await res.json();
  return data.categories || [];
}
