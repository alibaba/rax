import { PolymerElement, html } from '@polymer/polymer';
import lottie from 'lottie-web';

export default class Lottie extends PolymerElement {
  static get is() {
    return 'a-lottie';
  }

  static get properties() {
    return {
      path: {
        type: String
      },
      rendererType: {
        type: String,
        value: 'svg'
      },
      name: {
        type: String
      },
      repeatCount: {
        type: Number,
        value: 0
      },
      autoplay: {
        type: Boolean,
        value: false
      },
      autoReverse: {
        type: Boolean,
        value: false,
        observer: '_observerAutoReverse'
      },
      speed: {
        type: Number,
        value: 1,
        observer: '_observerSpeed'
      },
      quality: {
        type: String,
        value: 'high'
      }
    };
  }

  ready() {
    super.ready();
    const date = new Date();
    // 循环次数
    this._count = 0;
    this.direction = 1;
    // 生成 lottie name，每个实例都会有固定的 name
    this.name = this.name || 'lottieAnim' + date.getTime();
    const animationData = {
      animType: this.rendererType,
      loop: true,
      autoplay: this.autoplay,
      path: this.path,
      name: this.name,
      wrapper: this.shadowRoot.firstElementChild
    };
    this.animation = lottie.loadAnimation(animationData);
    this.totalFrame = this.animation.getDuration(true);
    if (this.autoReverse) {
      this.setDirection(-1);
    }
    if (this.quality !== 'high') {
      lottie.setQuality(this.quality);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.animation.addEventListener('complete', this._handleComplete, true);
    this.animation.addEventListener('loopComplete', this._handleLoopComplete, true);
    this.animation.addEventListener('data_ready', this._handleDataReady, true);
    this.animation.addEventListener('data_failed', this._handleDataFailed, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.animation.removeEventListener('complete', this._handleComplete);
    this.animation.removeEventListener('loopComplete', this._handleLoopComplete);
    this.animation.removeEventListener('data_ready', this._handleDataReady);
    this.animation.removeEventListener('data_failed', this._handleDataFailed);
  }

  _observerSpeed() {
    this.setSpeed(this.speed);
  }

  _observerAutoReverse() {
    const direction = this.autoReverse ? -1 : 1;
    this.setDirection(direction);
  }

  _handleComplete = (event) => {
    this.fire('animationend', event);
  }

  _handleLoopComplete = (event) => {
    this._count++;
    if (this._count > this.repeatCount) {
      this.stop();
      this._handleComplete({
        type: 'complete',
        direction: this.direction
      });
    } else {
      this.fire('animationrepeat', event);
    }
  }

  _handleDataReady = () => {
    this.fire('dataready');
  }

  _handleDataFailed = () => {
    this.fire('datafailed');
  }

  fire(name, data = {}) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          ...data
        }
      })
    );
  }

  getDuration(inFrames) {
    return this.animation.getDuration(inFrames);
  }

  play() {
    lottie.play(this.name);
    this.fire('animationstart');
  }

  goToAndPlay(value) {
    this.animation.goToAndPlay(value, true);
  }

  goToAndStop(value) {
    this.animation.goToAndStop(value, true);
  }

  pause() {
    lottie.pause(this.name);
  }

  stop() {
    this._count = 0;
    lottie.stop(this.name);
    this.fire('animationcancel');
  }

  setSpeed(value = 1) {
    lottie.setSpeed(value, this.name);
  }

  setDirection(direction = 1) {
    this.direction = direction;
    lottie.setDirection(direction, this.name);
  }

  playSegments(segments) {
    this.animation.playSegments(segments);
  }

  // 最小帧 ~ 最大帧
  playFromMinToMaxFrame(min, max) {
    this.playSegments([min, max]);
  }

  // 0.0 ~ 1.0
  playFromMinToMaxProgress(min, max) {
    const frames = this.getDuration(true);
    const minFrame = frames * min;
    const maxFrame = frames * max;
    this.playSegments([minFrame, maxFrame]);
  }

  destroy() {
    lottie.destroy(this.name);
  }

  static get template() {
    return html`<div></div>`;
  }
}

customElements.define(Lottie.is, Lottie);
