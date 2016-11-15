require('file?name=[name].[ext]!index.html');

const d3 = require('d3');

class Line {
  constructor(x1 : string, x2 : string, y1 : string, y2 : string) {
    this.x1 = x1; this.x2 = x2; this.y1 = y1; this.y2 = y2;
  }
  public x1: string;
  public x2: string;
  public y1: string;
  public y2: string;
}

function generate_trame(nbtrame : number) : Line[] {
  const lines : Line[] = [];
  for (const i of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    lines.push(new Line(String(i), String(i), '0', '100%'));
    lines.push(new Line('0', '100%', String(i), String(i)));
  }
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
                .attr('stroke', 'black');
  }
}

function main() {
  const svgContainer = d3.select('body').append('svg')
                         .attr('viewBox', '0 0 1000 1000');
  generate_svg(svgContainer, generate_trame(1));
  return 0;
}

main();
