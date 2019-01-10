import { PolymerElement, html } from '@polymer/polymer';
import afterNextRender from '../../shared/afterNextRender';

const pauseImage = require('./images/pause.png');
const playImage = require('./images/play.png');
const fullscreenImage = require('./images/fullscreen.png');

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

  fullscreen = () => {
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

  showPause = () => {
    const $image = this.$.image;
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
  handlePlay = () => {
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

  ready() {
    super.ready();
    this._listen();
    this.handleStyle();
    const autoplay = this.getAttribute('autoplay');
    this.playing = !autoplay;
    this.$.fullscreen.src = fullscreenImage;
    this.handlePlay();
    this.delayHideControls();
    this.handleSeekBar();
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.image.addEventListener('click', this.handlePlay);
    this.$.fullscreen.addEventListener('click', this.fullscreen);
    this.$.video.addEventListener('click', this.showPause);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.$.image.removeEventListener('click', this.handlePlay);
    this.$.fullscreen.removeEventListener('click', this.fullscreen);
    this.$.video.removeEventListener('click', this.showPause);
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
      lineFront.style.width = value + '%';
      seekBar.style.left = value - 5 + '%';
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
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');
    this.$.container.style.width = this.$.controls.style.width = this.$.video.style.width = width ? `${width}px` : '100%';
    this.$.video.style.height = `${height}px`;
    this.$.image.style.opacity = 1;
  }

  static get template() {
    return html`
      <style>
      /* shadow DOM styles go here */
      :host {
        display: inline;
        box-sizing: border-box;
        -webkit-user-select: none;
        user-select: none;
      }

      :host #container {
        position: relative;
        max-width: 100vw;
      }

      :host #image {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -40px;
        margin-left: -30px;
        z-index: 100;
        width: 60px;
        height: 60px;
        opacity: 0;
      }

      :host #controls {
        width: 100%;
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
        display: -webkit-flex;
        justify-items: center;
        -webkit-justify-items: center;
        align-items: center;
        -webkit-align-items: center;
        background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.4));;
        height: 48px;
        position: absolute;
        bottom: 4.5px;
        left: 0;
        z-index: 101;
      }

      :host #line {
        width: 100%;
        height: 2px;
        position: relative;
      }

      :host #lineBackground {
        width: 100%;
        height: 2px;
        opacity: 0.25;
        background-color: #FFFFFF;
      }

      :host #lineFront {
        height: 2px;
        background-color: #FF5000;
        position: absolute;
        left: 0;
        top: 0;
      }

      :host #fullscreen {
        width: 20px;
        height: 20px;
        margin-right: 14px;
      }

      :host button:hover {
        cursor: pointer;
      }

      :host #seekbar {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #fff;
        position: absolute;
        top: -6px;
      }

      :host #fullscreen {
        width: 16px;
        height: 16px;
        margin-left: 12px;
      }

      :host span {
        color: #ffffff;
        font-size: 14px;
        padding-left: 9px;
        padding-right: 9px;
      }
    </style>
    <!-- shadow DOM goes here -->
    <div class="container" id="container">
      <img id="image" src="./images/play.png" alt="">
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
        <img id="fullscreen" src="./images/fullscreen.png" alt="" />
      </div>
    </div>`;
  }
}
