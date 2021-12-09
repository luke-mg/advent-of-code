import { readFile } from 'fs/promises';

const readInput = async (): Promise<string[]> => {
  const contents = await readFile(
    new URL('input.txt', import.meta.url),
    'utf-8',
  );

  return contents.split('\n').filter((line) => line !== '');
};

const mapLines = (lines: string[]): number[][] => {
  return lines.map((line) =>
    line.split('').map((digit) => parseInt(digit, 10)),
  );
};

const heightmap = mapLines(await readInput());

type ValueWithNeighbors = {
  value: number;
  neighbors: number[];
};

const heightmapWithNeighbors: ValueWithNeighbors[] = heightmap.flatMap(
  (row, rowIndex) => {
    return row.map((value, columnIndex) => {
      const left = columnIndex > 0 ? [row[columnIndex - 1]] : [];
      const right = columnIndex < row.length - 1 ? [row[columnIndex + 1]] : [];

      const up = rowIndex > 0 ? [heightmap[rowIndex - 1][columnIndex]] : [];
      const down =
        rowIndex < heightmap.length - 1
          ? [heightmap[rowIndex + 1][columnIndex]]
          : [];

      const neighbors = [...left, ...right, ...up, ...down];

      return {
        value,
        neighbors,
      };
    });
  },
);

const isLowPoint = ({ value, neighbors }: ValueWithNeighbors) =>
  neighbors.every((n) => n > value);

const lowPoints = heightmapWithNeighbors.filter(isLowPoint);

const riskLevels = lowPoints.map(({ value }) => value + 1);

const sumOfRiskLevels = riskLevels.reduce((a, b) => a + b);

console.log(sumOfRiskLevels);
