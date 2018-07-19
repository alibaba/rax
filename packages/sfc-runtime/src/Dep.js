let uid = 0;

export default class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }

  removeSub(sub) {
    const index = this.subs.indexOf(sub);
    if (index > -1) {
      return this.subs.splice(index, 1);
    }
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

Dep.target = null;
const targetStack = [];
export function pushTarget(_target) {
  if (Dep.target) {
    targetStack.push(Dep.target);
  }
  Dep.target = _target;
}

export function popTarget() {
  Dep.target = targetStack.pop();
}
