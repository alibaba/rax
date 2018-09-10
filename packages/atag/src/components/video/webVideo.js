import { PolymerElement } from 'Element';
import { html } from '@polymer/polymer';

const videoHub = window.videoHub = window.videoHub ? window.videoHub : {};

const pauseImage =
  'https://gw.alicdn.com/tfs/TB1xd9AuamWBuNjy1XaXXXCbXXa-142-142.png';
const playImage =
  'https://gw.alicdn.com/tfs/TB1Ob3Ht3mTBuNjy1XbXXaMrVXa-142-142.png';

export default class VideoElement extends PolymerElement {
  static get is() {
    return 'a-video';
  }

  constructor() {
    super();
    this.playing = false;
  }

  static get properties() {
    return {
      src: {
        type: String,
        notify: true
      },
      poster: {
        type: String,
        notify: true
      },
      width: {
        type: String
      },
      height: {
        type: String
      },
      muted: {
        type: Boolean
      },
      loop: {
        type: Boolean
      },
      autoplay: {
        type: Boolean,
        value: false
      },
      controls: {
        type: Boolean
      }
    };
  }

  play() {
    this.playing = true;
    this.$.video.play();
  }

  pause() {
    this.playing = false;
    this.$.video.pause();
  }

  fullscreen() {
    const video = this.$.video;

    if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    } else if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen(); // Firefox
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(); // Chrome and Safari
    }
  }

  showPause() {
    const $image = this.$.image;
    const $container = this.$.container;
    const $controls = this.$.controls;

    if (this.playing) {
      $image.src = pauseImage;
      $image.style.opacity = 1;
      $controls.style.opacity = 1;
    }

    setTimeout(() => {
      if (this.playing) {
        $image.style.opacity = 0;
        $controls.style.opacity = 0;
      }
    }, 4000);
  }

  delayHideControls() {
    setTimeout(() => {
      if (this.playing) {
        this.$.controls.style.opacity = 0;
      }
    }, 3000);
  }
  handlePlay() {
    if (this.playing) {
      this.pause();
      this.$.image.style.opacity = 1;
      this.$.image.src = playImage;
      this.$.controls.style.opacity = 1;
    } else {
      this.play();
      this.$.image.style.opacity = 0;
      this.$.image.src = pauseImage;
      this.$.controls.style.opacity = 0;
    }
  }

  _listen() {
    this.$.video.controls = false;
    this.$.video.addEventListener('timeupdate', e => {
      const currentTime = this.$.video.currentTime;
      const minutes = parseInt(currentTime / 60, 10);
      const seconds = parseInt(currentTime % 60);
      this.$.currentTime.innerHTML =
        (minutes === 0 ? '00' : minutes) +
        ':' +
        (seconds < 10 ? '0' + seconds : seconds);
    });

    const i = setInterval(() => {
      const video = this.$.video;
      if (video && video.readyState && video.readyState > 0) {
        const minutes = parseInt(video.duration / 60, 10);
        const seconds = parseInt(video.duration % 60);

        // (Put the minutes and seconds in the display)
        this.$.totalTime.innerHTML = minutes + ':' + seconds;
        this.$.controls.style.opacity = 1;
        clearInterval(i);
      }
    }, 200);
  }

  connectedCallback() {
    super.connectedCallback();
    // 在全局 videoHub 注册本实例
    if (this.id) {
      videoHub[this.id] = this;
    }
  }

  ready() {
    super.ready();
    this._listen();

    this.$.image.addEventListener('click', this.handlePlay.bind(this));
    this.$.fullscreen.addEventListener('click', this.fullscreen.bind(this));
    this.$.video.addEventListener('click', this.showPause.bind(this));

    this.handleStyle();

    const autoplay = this.getAttribute('autoplay');
    this.playing = !autoplay;
    this.handlePlay();

    this.delayHideControls();
    this.handleSeekBar();
  }

  handleSeekBar() {
    const seekBar = this.$.seekbar;
    const video = this.$.video;
    const lineFront = this.$.lineFront;
    // Update the seek bar as the video plays
    video.addEventListener('timeupdate', function() {
      // Calculate the slider value
      var value = 100 / video.duration * video.currentTime;
      // Update the slider value
      lineFront.style.width = value * 60 / 100 + 'vw';
      seekBar.style.left = value * 60 / 100 - 1.6 + 'vw';
    });

    video.addEventListener('ended', e => {
      this.$.image.style.opacity = 1;
      this.$.image.src = playImage;
      this.$.controls.style.opacity = 1;
      this.playing = false;
    });
    // Pause the video when the seek handle is being dragged
    seekBar.addEventListener('touchstart', e => {
      this.pause();
    });
    // Play the video when the seek handle is dropped
    seekBar.addEventListener('touchend', e => {
      this.play();
      this.$.image.style.opacity = 0;
      this.$.image.src = pauseImage;
      this.$.controls.style.opacity = 0;
      this.playing = true;
    });

    seekBar.addEventListener('touchmove', e => {
      const pageX = e.touches[0].pageX;
      if (pageX < 70 || pageX > 295) return;
      seekBar.style.left = pageX - 70 + 'px';
      lineFront.style.width = pageX - 70 + 'px';
      const time = video.duration * ((pageX - 70) / 225);
      // Update the video time
      video.currentTime = time;
    });
  }
  handleStyle() {
    const width = this.getAttribute('width') || '100';
    const height = this.getAttribute('height');
    const styleEl = this.shadowRoot.querySelector('#style');
    styleEl.innerHTML += `
        :host .container {
          width: ${width}vw;
          position: relative;
        }
        :host #controls {
          width: ${width}vw;
        }

        :host #video {
          width: ${width}vw;
          height: ${height}vw;
        }
        :host #image {
        position: absolute;
        z-index: 100;
        left: ${(width - 16.8) / 2}vw;
        top: 50%;
        margin-top: -40px;
        opacity: 1;
      }
      `;
  }

  static get template() {
    return html`
      <style id="style">
      /* shadow DOM styles go here */
      :host {
        display: inline;
        box-sizing: border-box;

        -webkit-user-select: none;
        user-select: none;

      }

      :host #container {
        position: relative;
        width: 100vw;
      }

      :host #image {
        position: absolute;
        z-index: 100;
        width: 16.8vw;
        height: 16.8vw;
        opacity: 0;
      }

      :host #controls {
        width: 100vw;
        -webkit-transition: opacity .3s;
        -moz-transition: opacity .3s;
        -o-transition: opacity .3s;
        -ms-transition: opacity .3s;
        transition: opacity .8s;
        opacity: 0;
        margin: 0;
        padding: 0;
        line-height: 0;
        display: flex;
        justify-items: center;
        align-items: center;
        background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.4));;
        height: 12.8vw;
        position: absolute;
        bottom: 1.2vw;
        left: 0;
        z-index: 101;
      }

      :host #line {
        width: 60vw;
        height: 0.5333333333333333vw;
        position: relative;

      }

      :host #lineBackground {
        width: 60vw;
        height: 0.5333333333333333vw;
        opacity: 0.25;
        background-color: #FFFFFF;

      }

      :host #lineFront {
        width: 20vw;
        height: 0.5333333333333333vw;
        background-color: #FF5000;
        position: absolute;
        left: 0;
        top: 0;
      }

      :host #fullscreen {
        width: 5.333333333333333vw;
        height: 5.333333333333333vw;
        margin-right: 3.8666666666666667vw;
      }

      :host button:hover {
        cursor: pointer;
      }

      :host #seekbar {
        width: 3.2vw;
        height: 3.2vw;
        border-radius: 50%;
        background-color: #fff;
        position: absolute;
        top: -1.6vw;
      }

      :host #fullscreen {
        width: 4.333333333333333vw;
        height: 4.333333333333333vw;
        margin-left: 3.2vw;
      }

      :host span {
        color: #ffffff;
        font-size: 3.8666666666666667vw;
        padding-left: 2.4vw;
        padding-right: 2.4vw;
      }
    </style>
    <!-- shadow DOM goes here -->
    <div class="container" id="container">
      <img id="image" src="https://gw.alicdn.com/tfs/TB1Ob3Ht3mTBuNjy1XbXXaMrVXa-142-142.png" alt="">
      <video id="video" src="{{src}}" autoplay="{{autoplay}}" height="{{height}}" width="{{width}}" mute="{{mute}}" loop="{{loop}}"
             poster="{{poster}}" webkit-playsinline playsinline>
        <slot></slot>
      </video>
      <div id="controls" class="green">
        <span id="currentTime">00:00</span>
        <div id="line">
          <div id="lineBackground"></div>
          <div id="lineFront"></div>
          <div id="seekbar"></div>
        </div>

        <span id="totalTime"> </span>
        <img id="fullscreen" src="https://gw.alicdn.com/tfs/TB1tJs6t29TBuNjy0FcXXbeiFXa-40-40.png" alt="" />
      </div>
    </div>`;
  }
}
