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
      loop: {
        type: Boolean,
        value: false
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
      // 0 - 100
      frame: {
        type: Number,
        value: 0
      },
      // 用来控制动画状态 play/stop/pause
      status: {
        type: String,
        value: '',
        observer: '_observerStatus'
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
    // 生成 lottie name，每个实例都会有固定的 name
    this.name = this.name || 'lottieAnim' + date.getTime();
    const animationData = {
      animType: this.rendererType,
      loop: this.loop,
      autoplay: this.autoplay,
      path: this.path,
      name: this.name,
      wrapper: this.shadowRoot.firstElementChild
    };
    this.animation = lottie.loadAnimation(animationData);
    this.totalFrame = this.animation.getDuration(true);
    if (this.autoReverse) {
      lottie.setDirection(-1);
    }
    if (this.quality !== 'high') {
      lottie.setQuality(this.quality);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.animation.addEventListener('complete', this._handleComplete, true);
    this.animation.addEventListener('loopComplete', this._handleLoopComplete, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.animation.addEventListener('complete', this._handleComplete);
    this.animation.addEventListener('loopComplete', this._handleLoopComplete);
  }

  _observerStatus() {
    switch (this.status) {
      case 'play':
        this.play();
        break;
      case 'goToAndPlay':
        const startTotalFrame = this.animation.getDuration(true);
        const startFrame = startTotalFrame * this.frame / 100;
        this.animation.goToAndPlay(startFrame, true);
        break;
      case 'goToAndStop':
        const stopTotalFrame = this.animation.getDuration(true);
        const stopFrame = stopTotalFrame * this.frame / 100;
        this.animation.goToAndStop(stopFrame, true);
        break;
      case 'pause':
        this.pause();
        break;
      case 'stop':
        this.stop();
        break;
    }
  }

  _observerSpeed() {
    this.setSpeed(this.speed);
  }

  _observerAutoReverse() {
    const direction = this.autoReverse ? -1 : 1;
    this.setDirection(direction);
  }

  _handleComplete = (event) => {
    this.fire('complete', event);
  }

  _handleLoopComplete = (event) => {
    this.fire('loopcomplete', event);
  }

  fire(name, data) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          ...data
        }
      })
    );
  }

  play() {
    lottie.play(this.name);
  }

  goToAndPlay(value) {
    lottie.play(value, true);
  }

  pause() {
    lottie.pause(this.name);
  }

  stop() {
    lottie.stop(this.name);
  }

  setSpeed(value = 1) {
    lottie.setSpeed(value, this.name);
  }

  setDirection(direction = 1) {
    lottie.setDirection(direction, this.name);
  }

  static get template() {
    return html`<div></div>`;
  }
}

customElements.define(Lottie.is, Lottie);
