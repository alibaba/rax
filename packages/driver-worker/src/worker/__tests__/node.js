import Node from '../Node';
import { ELEMENT_NODE} from '../NodeTypes';

describe('Node', () => {
  it('node type', () => {
    const node = new Node(ELEMENT_NODE, 'view');
    expect(node.nodeType).toEqual(ELEMENT_NODE);
    expect(node.nodeName).toEqual('view');
  });

  it('node structures', () => {
    const parent = new Node(ELEMENT_NODE, 'view');
    const child1 = new Node(ELEMENT_NODE, 'view');
    const child2 = new Node(ELEMENT_NODE, 'view');
    const child3 = new Node(ELEMENT_NODE, 'view');
    parent.appendChild(child1);
    parent.appendChild(child2);
    parent.appendChild(child3);

    expect(parent.childNodes).toMatchObject([child1, child2, child3]);
    expect(child1.parentNode).toEqual(parent);
    expect(child1.nextSibling).toEqual(child2);
    expect(child2.previousSibling).toEqual(child1);
    expect(parent.firstChild).toEqual(child1);
    expect(parent.lastChild).toEqual(child3);
  });

  it('replace child', () => {
    const parent = new Node(ELEMENT_NODE, 'view');
    const child1 = new Node(ELEMENT_NODE, 'view');
    const child2 = new Node(ELEMENT_NODE, 'view');
    const child3 = new Node(ELEMENT_NODE, 'view');
    const child4 = new Node(ELEMENT_NODE, 'view');
    parent.appendChild(child1);
    parent.appendChild(child2);
    parent.appendChild(child3);

    parent.replaceChild(child4, child2);
    expect(parent.childNodes[1] === child4).toEqual(true);
  });

  it('remove child', () => {
    const parent = new Node(ELEMENT_NODE, 'view');
    const child1 = new Node(ELEMENT_NODE, 'view');
    const child2 = new Node(ELEMENT_NODE, 'view');
    const child3 = new Node(ELEMENT_NODE, 'view');
    parent.appendChild(child1);
    parent.appendChild(child2);
    parent.appendChild(child3);

    parent.removeChild(child2);
    expect(parent.childNodes).toEqual([child1, child3]);
  });

  it('mutate child nodes', () => {
    const parent = new Node(ELEMENT_NODE, 'view');
    const child1 = new Node(ELEMENT_NODE, 'view');
    const child2 = new Node(ELEMENT_NODE, 'view');
    const child3 = new Node(ELEMENT_NODE, 'view');
    parent.appendChild(child1);
    parent.appendChild(child2);
    parent.appendChild(child3);

    const root = new Node(ELEMENT_NODE, 'view');
    root.appendChild(parent);
  });
});
