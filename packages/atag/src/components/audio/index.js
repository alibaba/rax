import { PolymerElement, html } from '@polymer/polymer';

export default class Audio extends PolymerElement {
  static get is() {
    return 'a-audio';
  }

  static get properties() {
    return {
      src: {
        type: String,
        notify: true,
        reflectToAttribute: true,
      },
      autoplay: {
        type: Boolean,
        reflectToAttribute: true,
      },
      poster: {
        type: String,
        notify: true,
      },
      name: {
        type: String,
        notify: true,
        value: '未知音频',
      },
      author: {
        type: String,
        notify: true,
        value: '未知作者',
      },
      time: {
        type: String,
        notify: true,
        value: '00:00',
      },
      sliderValue: {
        type: Number,
        notify: true,
        value: 0,
      },
      playing: {
        type: Boolean,
        notify: true,
      }
    };
  }

  ready() {
    super.ready();

    if (this.autoplay) this.play();
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.audio.addEventListener('ended', this._handleAudioEnd);
    this.$.progress.addEventListener('change', this._handleProgressChange);
    this.$.thumb.addEventListener('click', this._handleThumbToggle);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.pause();
    this.$.audio.removeEventListener('ended', this._handleAudioEnd);
    this.$.progress.removeEventListener('change', this._handleProgressChange);
    this.$.thumb.removeEventListener('click', this._handleThumbToggle);
  }

  _handleProgressChange = evt => {
    const toPercentage = evt.detail.value;
    this.$.audio.currentTime = parseInt(toPercentage / 100 * this.$.audio.duration) || 0;
  };

  _handleAudioEnd() {
    this.reset();
    this._dispatchEvent('ended');
  };

  play() {
    this.playing = true;
    this.$.playIcon.style.display = 'none';
    const playPromise = this.$.audio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          this._dispatchEvent('play');
        })
        .catch(err => {
          console.error(err, err.message);
          this.pause();
        });
    }
    this.countTime();
  }

  pause() {
    this.playing = false;
    this.$.audio.pause();
    this.$.playIcon.style.display = 'block';
    this._dispatchEvent('pause');
    clearInterval(this._timer);
  }

  countTime() {
    const duration = parseInt(this.$.audio.duration);
    this._timer = setInterval(() => {
      const currentTime = parseInt(this.$.audio.currentTime);

      let s = '00';
      s = '' + currentTime % 60;
      if (s.length === 1) {
        s = '0' + s;
      }

      let m = '00';
      m = '' + parseInt(currentTime / 60);
      if (m.length === 1) {
        m = '0' + m;
      } else if (m.length > 2) {
        m = '99';
      }

      this._dispatchEvent('timeupdate', {
        currentTime,
        duration
      });
      this.time = `${m}:${s}`;

      this.sliderValue = parseInt(100 * currentTime / duration);
    }, 500);
  }

  reset() {
    this.pause();
    this.time = '00:00';
    this.sliderValue = 0;
  }

  _dispatchEvent(type, detail) {
    const event = new CustomEvent(type, { detail });
    this.dispatchEvent(event);
  }

  _handleThumbToggle = () => {
    this.playing ? this.pause() : this.play();
  };

  static get template() {
    return html`
      <style>
      :host {
        display: block;
        padding: 0 12px;
      }

      .audio-container {
        font-size: 15px;
        border-radius: 12px;
        border: 1px solid #D8D8D8;
        padding: 10px;
        background-color: #fff;
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        -webkit-flex-direction: row;
      }

      .audio-thumb {
        width: 90px;
        height: 90px;
        position: relative;
      }

      .audio-play {
        position: absolute;
        width: 40px;
        height: 40px;
        left: 25px;
        top: 25px;
      }

      .audio-thumb-img {
        position: absolute;
        width: 90px;
        height: 90px;
        left: 0;
        top: 0;
        background-size: cover;
        background-position: center center;
        border-radius: 50%;
      }

      .audio-name {
        font-size: 18px;
        color: #333;
      }

      .audio-author {
        font-size: 14px;
        color: #999;
      }

      .audio-content {
        margin-left: 10px;
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        flex-direction: column;
        -webkit-flex-direction: column;
        justify-content: center;
        -webkit-justify-content: center;
      }

      .audio-slider {
        width: 100%;
      }

      .audio-time {
        font-size: 14px;
        color: #999;
      }

      #audio {
        display: none;
      }
    </style>
    <audio id="audio" src="{{src}}" preload></audio>
    <div class="audio-container">
      <div class="audio-thumb" id="thumb">
        <div class="audio-thumb-img" style="background-image: url([[poster]]);"></div>
        <div class="audio-play" id="playIcon">
          <svg viewBox="0 0 76 76" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle id="b" cx="30" cy="30" r="30"/><filter x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" id="a"><feOffset in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="4" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" in="shadowBlurOuter1"/></filter></defs><g fill="none" fill-rule="evenodd"><g fill="#000" transform="translate(8 8)"><use filter="url(#a)" xlink:href="#b"/><circle stroke="#FFF" stroke-width="3" stroke-linejoin="square" fill-opacity=".2" cx="30" cy="30" r="28.5"/></g><path d="M46.093 40.572l-10.216 6.13a3 3 0 0 1-4.544-2.572V31.87a3 3 0 0 1 4.544-2.572l10.216 6.13a3 3 0 0 1 0 5.144z" fill="#FFF"/></g></svg>
        </div>
      </div>
      <div class="audio-content">
        <div class="audio-name">{{name}}</div>
        <div class="audio-author">{{author}}</div>
        <a-slider id="progress" class="audio-slider" max="100" value="{{sliderValue}}"></a-slider>
        <div class="audio-time">{{time}}</div>
      </div>
    </div>
    `;
  }
}

customElements.define(Audio.is, Audio);
