import GM from 'g2-mobile';

let WeexGM = GM;

class Chart extends GM.Chart {
  constructor(options) {
    super(options);
    this.options = options;
  }

  render() {
    super.render(this);
    this.options.context.render();
  }
}

WeexGM.Chart = Chart;

export default WeexGM;
