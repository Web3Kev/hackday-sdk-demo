// useElementSize.ts
import { useState, useRef, useEffect, RefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

export function useElementSize(): [RefObject<HTMLDivElement>, Size] {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateSize() {
      const element = ref.current;
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        setSize({
          width: parseInt(computedStyle.width, 10),
          height: parseInt(computedStyle.height, 10),
        });
      }
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return [ref, size];
}
