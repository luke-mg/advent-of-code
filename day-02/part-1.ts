import { readFile } from 'fs/promises';

type Direction = 'forward' | 'up' | 'down';
type Position = { horizontal: number; depth: number };
type Input = { direction: Direction; amount: number };

const readInputs = async () => {
  const contents = await readFile(
    new URL('input.txt', import.meta.url),
    'utf-8',
  );

  return contents
    .split('\n')
    .filter((line) => line !== '')
    .map((str): Input => {
      const [direction, amount] = str.split(' ');

      return {
        direction: direction as Direction,
        amount: parseInt(amount, 10),
      };
    });
};

const fns: Record<Direction, (position: Position, amount: number) => Position> =
  {
    forward: (position, amount) => ({
      ...position,
      horizontal: position.horizontal + amount,
    }),
    up: (position, amount) => ({ ...position, depth: position.depth - amount }),
    down: (position, amount) => ({
      ...position,
      depth: position.depth + amount,
    }),
  };

const inputs = await readInputs();

const startPosition: Position = { horizontal: 0, depth: 0 };

const finalPosition = inputs.reduce(
  (acc, input) => fns[input.direction](acc, input.amount),
  startPosition,
);

console.log(finalPosition.depth * finalPosition.horizontal);
