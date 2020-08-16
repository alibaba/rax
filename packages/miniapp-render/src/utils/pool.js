class Pool {
  constructor(size) {
    this.$_size = size || 3000;
    this.$_cache = [];
  }

  // Add an object
  add(object) {
    if (this.$_cache.length >= this.$_size) return;

    this.$_cache.push(object);
  }

  // Get an object
  get() {
    return this.$_cache.pop();
  }
}

export default Pool;
