/**
 * Thanks sizzle：https://github.com/jquery/sizzle/tree/master
 */

const PSEUDO_CHECK = {
  checked: node => node.checked || node.selected,
  disabled: node => node.disabled,
  enabled: node => !node.disabled,
  'first-child': node => node.parentNode.children[0] === node,
  'last-child': node => node.parentNode.children[node.parentNode.children.length - 1] === node,
  'nth-child': (node, param) => {
    const children = node.parentNode.children;
    const {a, b} = param;
    const index = children.indexOf(node) + 1;

    if (a) {
      return (index - b) % a === 0;
    } else {
      return index === b;
    }
  },
};

const ATTR_CHECK = {
  '=': (nodeVal, val) => nodeVal === val,
  '~=': (nodeVal, val) => nodeVal.split(/\s+/).indexOf(val) !== -1,
  '|=': (nodeVal, val) => nodeVal === val || nodeVal.indexOf(val + '-') === 0,
  '^=': (nodeVal, val) => nodeVal.indexOf(val) === 0,
  '$=': (nodeVal, val) => nodeVal.substr(nodeVal.length - val.length) === val,
  '*=': (nodeVal, val) => nodeVal.indexOf(val) !== -1,
};

const KINSHIP_CHECK = {
  ' ': (node, kinshipRule) => {
    let kinshipNode = node.parentNode;

    while (kinshipNode) {
      if (checkHit(kinshipNode, kinshipRule)) return kinshipNode;

      kinshipNode = kinshipNode.parentNode;
    }

    return null;
  },
  '>': (node, kinshipRule) => {
    const kinshipNode = node.parentNode;

    return checkHit(kinshipNode, kinshipRule) ? kinshipNode : null;
  },
  '+': (node, kinshipRule) => {
    const children = node.parentNode;

    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i];

      if (child === node) {
        const kinshipNode = children[i - 1];

        return checkHit(kinshipNode, kinshipRule) ? kinshipNode : null;
      }
    }

    return null;
  },
  '~': (node, kinshipRule) => {
    const children = node.parentNode;
    let foundCurrent = false;

    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];

      if (foundCurrent && checkHit(child, kinshipRule)) return child;
      if (child === node) foundCurrent = true;
    }

    return null;
  },
};

/**
 * Check if the node conforms to the rule
 */
function checkHit(node, rule) {
  if (!node) return false;

  const {
    id, class: classList, tag, pseudo, attr
  } = rule;

  if (id) {
    if (node.id !== id) return false;
  }

  if (classList && classList.length) {
    for (const className of classList) {
      if (!node.classList || !node.classList.contains(className)) return false;
    }
  }

  if (tag && tag !== '*') {
    if (node.tagName !== tag.toUpperCase()) return false;
  }

  if (pseudo) {
    for (const {name, param} of pseudo) {
      const checkPseudo = PSEUDO_CHECK[name];
      if (!checkPseudo || !checkPseudo(node, param)) return false;
    }
  }

  if (attr) {
    for (const {name, opr, val} of attr) {
      const nodeVal = node[name] || node.getAttribute(name);

      if (nodeVal === undefined) return false;
      if (opr) {
        // Existence operator
        const checkAttr = ATTR_CHECK[opr];
        if (!checkAttr || !checkAttr(nodeVal, val)) return false;
      }
    }
  }

  return true;
}

function unique(list) {
  for (let i = 0; i < list.length; i++) {
    const a = list[i];

    for (let j = i + 1; j < list.length; j++) {
      const b = list[j];
      if (a === b) list.splice(j, 1);
    }
  }

  return list;
}

function sortNodes(list) {
  list.sort((a, b) => {
    const aList = [a];
    const bList = [b];
    let aParent = a.parentNode;
    let bParent = b.parentNode;

    if (aParent === bParent) {
      // Check the order
      const children = aParent.children;
      return children.indexOf(a) - children.indexOf(b);
    }

    // A to the root list
    while (aParent) {
      aList.unshift(aParent);
      aParent = aParent.parentNode;
    }

    // B to the root list
    while (bParent) {
      bList.unshift(bParent);
      bParent = bParent.parentNode;
    }

    // Find the closest common ancestor
    let i = 0;
    while (aList[i] === bList[i]) i++;

    // Check the order
    const children = aList[i - 1].children;
    return children.indexOf(aList[i]) - children.indexOf(bList[i]);
  });

  return list;
}

class QuerySelector {
  constructor() {
    this.parseCache = {};
    this.parseCacheKeys = [];

    const idReg = '#([\\\\\\w-]+)';
    const tagReg = '\\*|builtin-component|[a-zA-Z-]\\w*';
    const classReg = '\\.([\\\\\\w-]+)';
    const pseudoReg = ':([\\\\\\w-]+)(?:\\(([^\\(\\)]*|(?:\\([^\\)]+\\)|[^\\(\\)]*)+)\\))?';
    const attrReg = '\\[\\s*([\\\\\\w-]+)(?:([*^$|~!]?=)[\'"]?([^\'"\\[]+)[\'"]?)?\\s*\\]';
    const kinshipReg = '\\s*([>\\s+~](?!=))\\s*';
    this.regexp = new RegExp(`^(?:(${idReg})|(${tagReg})|(${classReg})|(${pseudoReg})|(${attrReg})|(${kinshipReg}))`);
  }

  setParseCache(key, value) {
    if (this.parseCacheKeys.length > 50) {
      delete this.parseCache[this.parseCacheKeys.shift()];
    }

    this.parseCacheKeys.push(key);
    this.parseCache[key] = value;

    return value;
  }

  getParseCache(key) {
    return this.parseCache[key];
  }

  parse(selector) {
    const segment = [{tag: '*'}];
    const regexp = this.regexp;

    const onProcess = (all, idAll, id, tagAll, classAll, className, pseudoAll, pseudoName, pseudoParam, attrAll, attrName, attrOpr, attrVal, kinshipAll, kinship) => {
      if (idAll) {
        segment[segment.length - 1].id = id;
      } else if (tagAll) {
        segment[segment.length - 1].tag = tagAll.toLowerCase();
      } else if (classAll) {
        const currentRule = segment[segment.length - 1];
        currentRule.class = currentRule.class || [];

        currentRule.class.push(className);
      } else if (pseudoAll) {
        const currentRule = segment[segment.length - 1];
        currentRule.pseudo = currentRule.pseudo || [];
        pseudoName = pseudoName.toLowerCase();

        const pseudo = {name: pseudoName};

        if (pseudoParam) pseudoParam = pseudoParam.trim();
        if (pseudoName === 'nth-child') {
          // Handle nth-child pseudo-class, parameter unified processing into the format of an + b
          pseudoParam = pseudoParam.replace(/\s+/g, '');

          if (pseudoParam === 'even') {
            // 偶数个
            pseudoParam = {a: 2, b: 2};
          } else if (pseudoParam === 'odd') {
            pseudoParam = {a: 2, b: 1};
          } else if (pseudoParam) {
            const nthParsed = pseudoParam.match(/^(?:(\d+)|(\d*)?n([+-]\d+)?)$/);

            if (!nthParsed) {
              pseudoParam = {a: 0, b: 1};
            } else if (nthParsed[1]) {
              pseudoParam = {a: 0, b: +nthParsed[1]};
            } else {
              pseudoParam = {
                a: nthParsed[2] ? +nthParsed[2] : 1,
                b: nthParsed[3] ? +nthParsed[3] : 0,
              };
            }
          } else {
            // Take the first by default
            pseudoParam = {a: 0, b: 1};
          }
        }
        if (pseudoParam) pseudo.param = pseudoParam;

        currentRule.pseudo.push(pseudo);
      } else if (attrAll) {
        const currentRule = segment[segment.length - 1];

        currentRule.attr = currentRule.attr || [];
        currentRule.attr.push({
          name: attrName,
          opr: attrOpr,
          val: attrVal
        });
      } else if (kinshipAll) {
        segment[segment.length - 1].kinship = kinship;
        segment.push({tag: '*'});
      }

      return '';
    };

    // Selector resolution
    let lastParse;
    selector = selector.replace(regexp, onProcess);

    while (lastParse !== selector) {
      lastParse = selector;
      selector = selector.replace(regexp, onProcess);
    }

    return selector ? '' : segment;
  }

  exec(selector, extra) {
    selector = selector.trim().replace(/\s+/g, ' ').replace(/\s*(,|[>\s+~](?!=)|[*^$|~!]?=)\s*/g, '$1');
    const {idMap, tagMap, classMap} = extra;

    let segment = this.getParseCache(selector);

    if (!segment) {
      segment = this.parse(selector);

      if (!segment) return [];

      this.setParseCache(selector, segment);
    }

    if (!segment[0]) return [];

    const lastRule = segment[segment.length - 1];
    const {id, class: classList, tag} = lastRule;
    let hitNodes = [];

    if (id) {
      const node = idMap[id];
      hitNodes = node ? [node] : [];
    } else if (classList && classList.length) {
      for (const className of classList) {
        const classNodes = classMap[className];
        if (classNodes) {
          for (const classNode of classNodes) {
            if (hitNodes.indexOf(classNode) === -1) hitNodes.push(classNode);
          }
        }
      }
    } else if (tag && tag !== '*') {
      const tagName = tag.toUpperCase();
      const tagNodes = tagMap[tagName];
      if (tagNodes) hitNodes = tagNodes;
    } else {
      Object.keys(tagMap).forEach(key => {
        const tagNodes = tagMap[key];
        if (tagNodes) {
          for (const tagNode of tagNodes) hitNodes.push(tagNode);
        }
      });
    }

    if (hitNodes.length && segment.length) {
      for (let i = hitNodes.length - 1; i >= 0; i--) {
        let checkNode = hitNodes[i];
        let isMatched = false;

        for (let j = segment.length - 1; j >= 0; j--) {
          const prevRule = segment[j - 1];

          if (j === segment.length - 1) isMatched = checkHit(checkNode, lastRule);

          if (isMatched && prevRule) {
            const kinship = prevRule.kinship;
            const checkKinship = KINSHIP_CHECK[kinship];

            if (checkKinship) checkNode = checkKinship(checkNode, prevRule);

            if (!checkNode) {
              isMatched = false;
              break;
            }
          } else {
            break;
          }
        }

        if (!isMatched) hitNodes.splice(i, 1);
      }
    }

    if (hitNodes.length) {
      hitNodes = unique(hitNodes);
      hitNodes = sortNodes(hitNodes);
    }

    return hitNodes;
  }
}

export default QuerySelector;
