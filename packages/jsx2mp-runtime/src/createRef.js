export default function(initialValue) {
  const ref = {
    current: initialValue
  };
  const refFn = (instance) => {
    ref.current = instance;
  };
  refFn.__proto__ = ref;
  return refFn;
};
