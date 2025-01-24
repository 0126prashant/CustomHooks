import { useState, useEffect, useRef } from 'react';

export const useIntersectionObserver = (options) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    const current = ref.current;
    if (current) observer.observe(current);

    return () => current && observer.unobserve(current);
  }, [options]);

  return [ref, isVisible];
};
