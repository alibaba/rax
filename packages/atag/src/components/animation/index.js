import { PolymerElement, html } from '@polymer/polymer';
import { converStyleString, generateTemplate } from './helpers';
import Event from './Event';
import Timeline from './Timeline';

export default class Animation extends PolymerElement {
  static get is() {
    return 'a-animation';
  }

  static get properties() {
    return {
      id: {
        type: String
      },
      keyframes: {
        type: Array,
        value: []
      },
      // frame object name
      scope: {
        type: String,
        value: 'frame'
      },
      eventType: {
        type: String,
        value: 'timing'
      },
      eventOrigin: {
        type: String
      },
      // Optional: normal|reverse
      direction: {
        type: String,
        value: 'normal'
      },
      duration: {
        type: Number,
        value: 1000
      },
      delay: {
        type: Number,
        value: 0
      },
      easing: {
        type: String
      },
      iterations: {
        type: Number,
        value: 1
      }
    };
  }

  static get observers() {
    return ['_observerMultiple(keyframes, direction, duration, delay, easing, iterations)'];
  }

  _observerMultiple(keyframes, direction, duration, delay, easing, iterations) {
    this.timeline.update(keyframes, {
      direction,
      duration,
      delay,
      easing,
      iterations
    });
  }

  constructor() {
    super();

    this.timeline = new Timeline([], {}, {
      onFrame: this.update,
      onFinish: this.finish
    });
    this.finished = true;
    this.event = {};
    this.styleProp = 'animation-style';
  }

  connectedCallback() {
    super.connectedCallback();
    this.event = new Event({
      origin: this.eventOrigin,
      type: this.eventType,
      callback: this.play
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.mounted = false;
    this.cancel();
    this.event.destroy();
  }

  play = (event) => {
    this.finished = false;
    this.event = event;
    this._emitEvent('play', {
      ...event
    });
    // no keyframes, use gesture
    if (!this.keyframes || this.keyframes.length === 0) {
      this.update(event, false);
    } else {
      this.timeline.play();
    }
  }

  cancel = () => {
    this.timeline.cancel();
    this._emitEvent('cancel');
  }

  finish = () => {
    this.finished = true;
    this._emitEvent('finish');
  }

  pause() {
    this.timeline.pause();
    this._emitEvent('pause');
  }

  update = (value) => {
    const params = {
      [this.scope]: value,
      event: this.event
    };
    this.updateStyle(this.childNodes, params);
    this._emitEvent('frame', value);
  };

  /**
   * update node style
   */
  updateStyle = (nodeList, value) => {
    for (let index = 0; index < nodeList.length; index++) {
      const node = nodeList[index];
      if (node.getAttribute) {
        const style = node.getAttribute(this.styleProp);
        if (style) {
          // 取到当前节点的位置信息，点击，需要联动的场景需要
          this.firstPosition = this.firstPosition || node.getBoundingClientRect();
          const templateString = generateTemplate({
            ...value,
            firstPosition: this.firstPosition
          }, style);
          const styleObject = converStyleString(templateString);
          this.setNodeStyle(node, styleObject);
        }
      }
      if (node.childNodes) {
        this.updateStyle(node.childNodes, value);
      }
    }
  };

  setNodeStyle = (node, styleObject) => {
    Object.keys(styleObject).forEach((property) => {
      node.style[property] = styleObject[property];
    });
  };

  _emitEvent(name, data) {
    const event = new CustomEvent(name, {
      bubbles: false,
      cancelable: true,
      detail: {
        ...data
      },
    });

    this.dispatchEvent(event);
  }

  static get template() {
    return html`
      <slot></slot>
    `;
  }
}

customElements.define(Animation.is, Animation);
