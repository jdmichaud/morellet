// npm install lodash @types/lodash @types/node typescript ts-node
// echo '{"compilerOptions": {"strict": true}}' > tsconfig.json
// echo morellet.ts | entr sh -c 'reset && node_modules/.bin/ts-node --type-check morellet.ts'
import * as assert from 'assert';
import * as lodash from 'lodash';
import * as d3 from 'd3';


class Vector {
  constructor(public angle: number, public norm: number) {}
  public add(rhs: Vector): Vector {
    return new Vector(0, 0);
  }
}

class AffineTransform {
  public static createFrom2Points(pointA: number[], pointB: number[]): AffineTransform {
    const slope: number = (pointB[1] - pointA[1]) / (pointB[0] - pointA[0]);
    return new AffineTransform(
      slope,
      pointA[1] - slope * pointA[0]
    );
  }

  constructor(
    public a : number,
    public b : number) {}

  public apply(x: number): number { return this.a * x + this.b;   }
  public solve(y: number): number { return (y - this.b) / this.a; }
}
assert.deepEqual(AffineTransform.createFrom2Points([1, 1], [2, 2]), { a: 1, b: 0 });
assert.deepEqual(AffineTransform.createFrom2Points([0, 1], [1, 1]), { a: 0, b: 1 });
assert.deepEqual(AffineTransform.createFrom2Points([1, 1], [2, 2]).apply(3), 3);
assert.deepEqual(AffineTransform.createFrom2Points([0, 1], [1, 1]).apply(2), 1);

class Line {
  public static createFromNormalVector(v: Vector, width: number, height: number): Line {
    if (v.angle % (2 * Math.PI) === 0) {
      return new Line(v.norm, 0, v.norm, 1);
    } else if (v.angle % Math.PI === 0) {
      return new Line(- v.norm, 0, - v.norm, 1);
    } // else
    const arbitrary_angle = 0.5;
    const affine = AffineTransform.createFrom2Points(
      [v.norm * Math.cos(v.angle), v.norm * Math.sin(v.angle)],
      [v.norm / Math.cos(arbitrary_angle) * Math.cos(v.angle + arbitrary_angle),
       v.norm / Math.cos(arbitrary_angle) * Math.sin(v.angle + arbitrary_angle)]
    );
    let pois: number[][] = []; // point of interesections with canvas borders
    pois.push([0, affine.apply(0)]);
    pois.push([width, affine.apply(width)]);
    pois.push([affine.solve(0), 0]);
    pois.push([affine.solve(height), height]);
    // Only keep the 2 intersection points
    pois = pois.filter(point =>
      point[0] >= 0 && point[0] <= width && point[1] >= 0 && point[1] <= height);
    // sanity check
    if (pois.length !== 2) throw new RangeError('Line do not cross canvas');
    return new Line(pois[0][0], pois[0][1], pois[1][0], pois[1][1]);
  }

  constructor(
    public x1 : number,
    public y1 : number,
    public x2 : number,
    public y2 : number,
    public color: string = 'black') {}
}
assert.deepEqual(Line.createFromNormalVector(new Vector(0, 1), 10, 20),           { x1:  1, y1: 0, x2:  1, y2: 1, color: 'black' });
assert.deepEqual(Line.createFromNormalVector(new Vector(Math.PI / 2, 1), 10, 20), { x1:  0, y1: 1, x2:  10, y2: 1, color: 'black' });
assert.deepEqual(Line.createFromNormalVector(new Vector(Math.PI, 1), 10, 20),     { x1: -1, y1: 0, x2: -1, y2: 1, color: 'black' });
assert.deepEqual(Line.createFromNormalVector(new Vector(Math.PI * 2, 1), 10, 20), { x1:  1, y1: 0, x2:  1, y2: 1, color: 'black' });
assert(Math.abs(Line.createFromNormalVector(new Vector(Math.PI / 4, Math.sqrt(2)), 10, 20).x2 - 2) < 0.0001);
assert(Math.abs(Line.createFromNormalVector(new Vector(Math.PI / 4, Math.sqrt(2)), 10, 20).y1 - 2) < 0.0001);

function irandom(lower: number, higher: number): number {
  return Math.floor(Math.random() * (higher + 1)) + lower;
}

function frandom(lower: number, higher: number): number {
  return Math.random() * higher + lower;
}

function generate_vector(count: number, norm: number): Vector[] {
  return lodash.range(count)
    .map(value => new Vector(frandom(0, Math.PI), norm));
}

function generate_shifts(count: number, maxnorm: number): Vector[] {
  return lodash.range(count)
    .map(value => new Vector(frandom(0, Math.PI), irandom(0, maxnorm)));
}

function generate_welt(width: number, height: number, v: Vector): Line[] {
  function generate_line(vprime: Vector, multiplier: number, invert: boolean): Line | null {
    try {
      const norm = vprime.norm * multiplier || vprime.norm * 0.00001;
      const angle = invert ? vprime.angle + (Math.PI) % (Math.PI * 2) : vprime.angle;
      return Line.createFromNormalVector(new Vector(angle, norm), width, height);
    } catch (e) {
      return null;
    }
  }
  function generate_half_welt(vprime: Vector): Line[] {
    let lines: Line[] = lodash.range(Math.max(width, height) / vprime.norm * 2)
      .map((multiplier) => generate_line(vprime, multiplier, false))
      .filter(line => line !== null) as Line[];
    lines = lines.concat(lodash.range(Math.max(width, height) / vprime.norm * 2)
      .map(multiplier => generate_line(vprime, multiplier, true))
      .filter(line => line !== null)  as Line[]);
    return lines;
  }

  return lodash.flatten([
    generate_half_welt(v),
    generate_half_welt(new Vector(v.angle + Math.PI / 2, v.norm))
  ]);
}

function generate_svg(svgContainer, lines: Line[]) {
  for (const line of lines) {
    svgContainer.append('line')
                .attr('x1', line.x1)
                .attr('y1', line.y1)
                .attr('x2', line.x2)
                .attr('y2', line.y2)
                .attr('stroke-width', 1)
                .attr('stroke', line.color);
  }
}

function main() {
  const svgContainer = d3.select('body').append('svg')
                         .attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
  const dvectors = generate_vector(3, 20); // direction vectors which will generate the welt
  // const shifts = generate_shifts(5, 10);
  const welts = dvectors.map(generate_welt.bind(null, window.innerWidth, window.innerHeight)) as Line[][];
  welts.map(generate_svg.bind(null, svgContainer));
  return 0;
}

main();
