if (typeof window !== 'undefined') {
  if (window.Rx) {
    console.warn('Multiple (conflicting) copies of Rx loaded, make sure to use only one.');
  }
}
