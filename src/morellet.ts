require('file?name=[name].[ext]!index.html');

const d3 = require('d3');

class Line {
  constructor(x1 : number, x2 : number, y1 : number, y2 : number, color: string) {
    this.x1 = x1; this.x2 = x2; this.y1 = y1; this.y2 = y2; this.color = color;
  }
  public x1: number;
  public x2: number;
  public y1: number;
  public y2: number;
  public color: string;
}

// y = a.x + b
function generate_trame(angles : number[], distance: number,
                        width: number, height: number) : Line[] {
  const largest = Math.max(width, height);
  const n = largest / distance;
  let i = 0;
  const lines = [].concat.apply([], angles.map((angle) => {
    // [...Array(Math.round(2 * n))] --> https://github.com/Microsoft/TypeScript/issues/8856
    i++;
    return Array.apply(null, Array(Math.round(2 * n)))
      .map((e, i) => (i - n) * distance * Math.sqrt(angle ** 2 + 1))
      .map((shift) => new Line(0, shift, width, width * angle + shift, '#' + i + i + i));
    }
  ));
  return lines;
}

function generate_svg(svgContainer, lines: Line[]) {
  for (const line of lines) {
    svgContainer.append('line')
                .attr('x1', line.x1)
                .attr('y1', line.y1)
                .attr('x2', line.x2)
                .attr('y2', line.y2)
                .attr('stroke-width', 2)
                .attr('stroke', line.color);
  }
}

function main() {
  const svgContainer = d3.select('body').append('svg')
                         .attr('viewBox', '0 0 1000 1000');
  // generate_svg(svgContainer, generate_trame([0, -0.5, -1, -2], 30, 1000, 1000));
  generate_svg(svgContainer, generate_trame([-0.5], 30, 1000, 1000));
  return 0;
}

main();
