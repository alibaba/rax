function ClassList(element, onUpdate) {
  this._init(element, onUpdate);
}

ClassList._create = function(element, onUpdate) {
  return new ClassList(element, onUpdate);
};

ClassList.prototype = Object.assign([], {
  _init(element, onUpdate) {
    this.__element = element;
    this._doUpdate = onUpdate;
  },

  _destroy() {
    this.__element = null;
    this._doUpdate = null;
    this.length = 0;
  },

  _recycle() {
    this._destroy();
  },

  _parse(className = '') {
    this.length = 0;

    className = className.trim();
    className = className ? className.split(/\s+/) : [];

    for (const item of className) {
      this.push(item);
    }

    const payload = {
      path: `${this.__element._path}.className`,
      value: this.slice().join(' ')
    };

    this._doUpdate(payload);
  },

  item(index) {
    return this[index];
  },

  contains(className) {
    if (typeof className !== 'string') return false;

    return this.indexOf(className) !== -1;
  },

  add(...args) {
    let isUpdate = false;

    for (let className of args) {
      if (typeof className !== 'string') continue;

      className = className.trim();

      if (className && this.indexOf(className) === -1) {
        this.push(className);
        isUpdate = true;
      }
    }

    if (isUpdate) {
      const payload = {
        path: `${this.__element._path}.className`,
        value: this.slice().join(' ')
      };
      this._doUpdate(payload);
    }
  },

  remove(...args) {
    let isUpdate = false;

    for (let className of args) {
      if (typeof className !== 'string') continue;

      className = className.trim();

      if (!className) continue;

      const index = this.indexOf(className);
      if (index >= 0) {
        this.splice(index, 1);
        isUpdate = true;
      }
    }

    if (isUpdate) {
      const payload = {
        path: `${this.__element._path}.className`,
        value: this.slice().join(' ')
      };
      this._doUpdate(payload);
    }
  },

  toggle(className, force) {
    if (typeof className !== 'string') return false;

    className = className.trim();

    if (!className) return false;

    const isNotContain = this.indexOf(className) === -1;
    let action = isNotContain ? 'add' : 'remove';
    action = force === true ? 'add' : force === false ? 'remove' : action;

    if (action === 'add') {
      this.add(className);
    } else {
      this.remove(className);
    }

    return force === true || force === false ? force : isNotContain;
  },

  toString() {
    return this.join(' ');
  },
});

export default ClassList;
