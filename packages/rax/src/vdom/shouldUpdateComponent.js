function shouldUpdateComponent(prevElement, nextElement) {
  let prevEmpty = prevElement === null;
  let nextEmpty = nextElement === null;
  if (prevEmpty || nextEmpty) {
    return prevEmpty === nextEmpty;
  }

  if (Array.isArray(prevElement) && Array.isArray(nextElement)) {
    return true;
  }

  let prevType = typeof prevElement;
  let nextType = typeof nextElement;
  if (prevType === 'string' || prevType === 'number') {
    return nextType === 'string' || nextType === 'number';
  } else {
    // prevElement and nextElement could be array, typeof [] is "object"
    return (
      prevType === 'object' &&
      nextType === 'object' &&
      prevElement.type === nextElement.type &&
      prevElement.key === nextElement.key
    );
  }
}

export default shouldUpdateComponent;
