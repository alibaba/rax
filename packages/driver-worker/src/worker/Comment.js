import Node from './Node';
import { COMMENT_NODE } from './NodeTypes';

export default class Comment extends Node {
  constructor(text) {
    super(COMMENT_NODE, '#comment');
    this.data = text;
  }
}
