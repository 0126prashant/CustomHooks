import { useState, useEffect } from 'react';

export const useFetch = (url, options = {}, retries = 3, cacheTime = 300000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cache = new Map();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async (attemptsLeft) => {
      if (cache.has(url)) {
        const cached = cache.get(url);
        if (Date.now() - cached.timestamp < cacheTime) {
          setData(cached.data);
          setLoading(false);
          return;
        }
      }

      try {
        setLoading(true);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network error');
        const result = await response.json();
        if (isMounted) {
          cache.set(url, { data: result, timestamp: Date.now() });
          setData(result);
        }
      } catch (err) {
        if (attemptsLeft > 0) {
          fetchData(attemptsLeft - 1);
        } else if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData(retries);
    return () => {
      isMounted = false;
    };
  }, [url, options, retries, cacheTime]);

  return { data, loading, error };
};
