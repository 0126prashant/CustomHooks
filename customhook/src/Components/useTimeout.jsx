import { useEffect, useRef } from 'react';

export const useTimeout = (callback, delay) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const timer = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(timer);
  }, [delay]);
};
