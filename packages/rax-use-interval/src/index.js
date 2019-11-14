import { useEffect, useRef } from 'rax';

function clearTimer(id) {
  if (id != null) clearInterval(id);
}

export default function useInterval(fn, delay) {
  const ref = useRef();

  // Update to the latest function.
  useEffect(() => {
    ref.fn = fn;
  }, [fn]);

  useEffect(() => {
    // Clear before timer if delay time updated
    clearTimer(ref.id);
    if (typeof delay === 'number') {
      ref.id = setInterval(() => ref.fn(), delay);
      return () => clearTimer(ref.id);
    }
  }, [delay]);
}
