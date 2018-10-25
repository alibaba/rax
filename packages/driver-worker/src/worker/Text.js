import Node from './Node';
import { TEXT_NODE } from './NodeTypes';
import { mutate } from './MutationObserver';

export default class Text extends Node {
  constructor(text) {
    super(TEXT_NODE, '#text'); // TEXT_NODE
    this.data = text;
  }
  set textContent(text) {
    mutate(this, 'characterData', { newValue: text });
    this.data = text;
  }
  get textContent() {
    return this.data;
  }
}
