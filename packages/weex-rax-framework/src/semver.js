export default {
  satisfies(left, right) {
    let regex = /(\W+)?([\d|.]+)/;

    if (typeof left + typeof right != 'stringstring')
      return false;

    if (right == '*') {
      return true;
    }

    let arr = right.match(regex);
    let a = left.split('.'),
      i = 0,
      b = arr[2].split('.'),
      len = Math.max(a.length, b.length);

    let flag = 0;
    for (let i = 0; i < len; i++) {
      if (a[i] && !b[i] && parseInt(a[i]) > 0 || parseInt(a[i]) > parseInt(b[i])) {
        flag = 1;
        break;
      } else if (b[i] && !a[i] && parseInt(b[i]) > 0 || parseInt(a[i]) < parseInt(b[i])) {
        flag = -1;
        break;
      }
    }

    switch (arr[1]) {
      case '<':
        if (flag === -1) {
          return true;
        }
        break;
      case '<=':
        if (flag !== 1) {
          return true;
        }
        break;
      case '>':
        if (flag === 1) {
          return true;
        }
        break;
      case '>=':
        if (flag !== -1) {
          return true;
        }
        break;
      default:
        if (flag === 0) {
          return true;
        }
        break;
    }
    return false;
  }
};
