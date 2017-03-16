'use strict';

let ease;

class Easing {
  /**
   * A stepping function, returns 1 for any positive value of `n`.
   */
  static step0(n) {
    return n > 0 ? 1 : 0;
  }

  /**
   * A stepping function, returns 1 if `n` is greater than or equal to 1.
   */
  static step1(n) {
    return n >= 1 ? 1 : 0;
  }

  /**
   * A linear function, `f(t) = t`. Position correlates to elapsed time one to
   * one.
   *
   * http://cubic-bezier.com/#0,0,1,1
   */
  static linear(t) {
    return t;
  }

  /**
   * A simple inertial interaction, similar to an object slowly accelerating to
   * speed.
   *
   * http://cubic-bezier.com/#.42,0,1,1
   */
  static ease(t: number): number {
    if (!ease) {
      ease = Easing.bezier(0.42, 0, 1, 1);
    }
    return ease(t);
  }

  /**
   * A quadratic function, `f(t) = t * t`. Position equals the square of elapsed
   * time.
   *
   * http://easings.net/#easeInQuad
   */
  static quad(t) {
    return t * t;
  }

  /**
   * A cubic function, `f(t) = t * t * t`. Position equals the cube of elapsed
   * time.
   *
   * http://easings.net/#easeInCubic
   */
  static cubic(t) {
    return t * t * t;
  }

  /**
   * A power function. Position is equal to the Nth power of elapsed time.
   *
   * n = 4: http://easings.net/#easeInQuart
   * n = 5: http://easings.net/#easeInQuint
   */
  static poly(n) {
    return (t) => Math.pow(t, n);
  }

  /**
   * A sinusoidal function.
   *
   * http://easings.net/#easeInSine
   */
  static sin(t) {
    return 1 - Math.cos(t * Math.PI / 2);
  }

  /**
   * A circular function.
   *
   * http://easings.net/#easeInCirc
   */
  static circle(t) {
    return 1 - Math.sqrt(1 - t * t);
  }

  /**
   * An exponential function.
   *
   * http://easings.net/#easeInExpo
   */
  static exp(t) {
    return Math.pow(2, 10 * (t - 1));
  }

  /**
   * A simple elastic interaction, similar to a spring oscillating back and
   * forth.
   *
   * Default bounciness is 1, which overshoots a little bit once. 0 bounciness
   * doesn't overshoot at all, and bounciness of N > 1 will overshoot about N
   * times.
   *
   * http://easings.net/#easeInElastic
   *
   * Wolfram Plots:
   *
   * - http://tiny.cc/elastic_b_1 (bounciness = 1, default)
   * - http://tiny.cc/elastic_b_3 (bounciness = 3)
   */
  static elastic(bounciness: number = 1): (t: number) => number {
    const p = bounciness * Math.PI;
    return (t) => 1 - Math.pow(Math.cos(t * Math.PI / 2), 3) * Math.cos(t * p);
  }

  /**
   * Use with `Animated.parallel()` to create a simple effect where the object
   * animates back slightly as the animation starts.
   *
   * Wolfram Plot:
   *
   * - http://tiny.cc/back_default (s = 1.70158, default)
   */
  static back(s: number): (t: number) => number {
    if (s === undefined) {
      s = 1.70158;
    }
    return (t) => t * t * ((s + 1) * t - s);
  }

  /**
   * Provides a simple bouncing effect.
   *
   * http://easings.net/#easeInBounce
   */
  static bounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    }

    if (t < 2 / 2.75) {
      t -= 1.5 / 2.75;
      return 7.5625 * t * t + 0.75;
    }

    if (t < 2.5 / 2.75) {
      t -= 2.25 / 2.75;
      return 7.5625 * t * t + 0.9375;
    }

    t -= 2.625 / 2.75;
    return 7.5625 * t * t + 0.984375;
  }

  /**
   * Provides a cubic bezier curve, equivalent to CSS Transitions'
   * `transition-timing-function`.
   *
   * A useful tool to visualize cubic bezier curves can be found at
   * http://cubic-bezier.com/
   */
  static bezier(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): (t: number) => number {
    const _bezier = require('bezier');
    return _bezier(x1, y1, x2, y2);
  }

  /**
   * Runs an easing function forwards.
   */
  static in(
    easing: (t: number) => number,
  ): (t: number) => number {
    return easing;
  }

  /**
   * Runs an easing function backwards.
   */
  static out(
    easing: (t: number) => number,
  ): (t: number) => number {
    return (t) => 1 - easing(1 - t);
  }

  /**
   * Makes any easing function symmetrical. The easing function will run
   * forwards for half of the duration, then backwards for the rest of the
   * duration.
   */
  static inOut(
    easing: (t: number) => number,
  ): (t: number) => number {
    return (t) => {
      if (t < 0.5) {
        return easing(t * 2) / 2;
      }
      return 1 - easing((1 - t) * 2) / 2;
    };
  }
}

export default Easing;
