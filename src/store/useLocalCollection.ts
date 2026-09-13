import { useCallback, useEffect, useState } from "react";

/** Small localStorage-backed collection store — no backend, this is a client-only
 * field journal. Reads once on mount, writes through on every mutation. */
export function useLocalCollection<T extends { id: string }>(key: string, seed: T[] = []) {
  const [items, setItems] = useState<T[]>(() => {
    if (typeof window === "undefined") return seed;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return seed;
      const parsed = JSON.parse(raw) as T[];
      return Array.isArray(parsed) && parsed.length ? parsed : seed;
    } catch {
      return seed;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // storage full or unavailable — fail silently, in-memory state still works
    }
  }, [key, items]);

  const add = useCallback((item: T) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const update = useCallback((id: string, patch: Partial<T>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  return { items, add, remove, update, setItems };
}

export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
