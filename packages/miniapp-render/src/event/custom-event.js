import Event from './event';

class CustomEvent extends Event {
  constructor(name = '', options = {}) {
    super({
      name,
      ...options,
    });
  }
}

export default CustomEvent;
