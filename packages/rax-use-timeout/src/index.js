import { useEffect, useRef } from 'rax';

function clearTimer(id) {
  if (id != null) clearTimeout(id);
}

export default function useTimeout(fn, delay) {
  const ref = useRef();

  // Update to the latest function.
  useEffect(() => {
    ref.fn = fn;
  }, [fn]);

  useEffect(() => {
    // Clear before timer if delay time updated
    clearTimer(ref.id);
    if (typeof delay === 'number') {
      ref.id = setTimeout(() => ref.fn(), delay);
      return () => clearTimer(ref.id);
    }
  }, [delay]);
}
