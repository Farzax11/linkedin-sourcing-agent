import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sourcing_search_history';

export function useSearchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  function addSearch(entry) {
    setHistory((prev) => {
      const updated = [{ ...entry, timestamp: new Date().toISOString() }, ...prev];
      return updated.slice(0, 10); // keep last 10
    });
  }

  function clearHistory() {
    setHistory([]);
  }

  return { history, addSearch, clearHistory };
}
