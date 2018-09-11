import nextTick from './nextTick';

export const MAX_UPDATE_COUNT = 100;

const queue = [];
/* { [key: number]: ?true } */
let has = {};
let waiting = false;
let flushing = false;
let index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
  queue.length = 0;
  has = {};
  waiting = flushing = false;
}


/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
  flushing = true;

  /**
   * 在刷新前排序队列，原因：
   * 1、组件都是先更新父组件，然后是子组件。父组件总是比子组件早创建。
   * 2、组件用户watcher总是比render watcher早执行，因为userWatcher总是比render Watcher早创建。
   * 3、如果一个组件在父watcher在执行的时候被销毁，那么他的watcher也会被强制停止。
   */
  queue.sort((prev, next) => prev.id - next.id);

  // do not cache length, for more watchers might be pushed
  // share the same index
  for (index = 0; index < queue.length; index++) {
    const watcher = queue[index];
    const id = watcher.id;
    has[id] = null;
    watcher.run();
    // todo: check circular update
  }

  resetSchedulerState();
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher(watcher) {
  const { id } = watcher;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // 如果已经在刷新，把 watcher 加入的队列中，
      // 并从小到大排列，如果 flush 的时候，id 比他大的都已经执行，他会被立即执行
      let i = queue.length - 1;
      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

