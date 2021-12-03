import { readFile } from 'fs/promises';

type Bit = 0 | 1;
type BitCount = Record<Bit, number>;

const readInput = async () => {
  const contents = await readFile(
    new URL('input.txt', import.meta.url),
    'utf-8',
  );

  return contents
    .split('\n')
    .filter((line) => line !== '')
    .map((line) =>
      line.split('').map((digitStr) => parseInt(digitStr, 0) as Bit),
    );
};

const input = await readInput();
const binaryLength = input[0].length;

/*

        0 (20)            1 (30)
        /   \              /  \
   0 (31)   1 (19)     0 (3)   1 (47)



*/

type Children = [Node, Node];

type Root = {
  children: Children;
};

type Node = {
  type: 'node';
  value: number;
  children: Children;
} | null;

const head = <T>([h]: T[]) => h;
const tail = <T>([_, ...rest]: T[]) => rest;

const splitBits = (candidates: Bit[][]) => {
  const zeroes = candidates.filter((bits) => head(bits) === 0).map(tail);
  const ones = candidates.filter((bits) => head(bits) === 1).map(tail);
  return [zeroes, ones];
};

const buildChildren = (candidates: Bit[][]): Children => {
  const [zeroes, ones] = splitBits(candidates);
  return [buildChild(zeroes), buildChild(ones)];
};

const buildChild = (candidates: Bit[][]): Node => {
  if (candidates.length === 0 || candidates[0].length === 0) {
    return null;
  }
  
  return {
    type: 'node',
    value: candidates.length,
    children: buildChildren(candidates),
  };
};

const tree: Root = {
  children: buildChildren(input),
};

type Comparison = (zeroesValue: number, onesValue: number) => Bit;

const chooseBit = (zeroes: Node, ones: Node, comparison: Comparison): Bit => {

  if (zeroes === null) {
    return 1;
  }

  if (ones === null) {
    return 0;
  }

  return comparison(zeroes.value, ones.value);
}

const calculateRating = (
  [zeroes, ones]: Children,
  comparison: Comparison,
): Bit[] => {
  const chosenBit = chooseBit(zeroes, ones, comparison)

  const next = chosenBit === 0 ? zeroes : ones;

  if (next === null) {
    return [chosenBit];
  }

  return [chosenBit, ...calculateRating(next.children, comparison)];
};

const oxygenGeneratorRatingBinary = calculateRating(
  tree.children,
  (zeroesValue, onesValue) => (onesValue >= zeroesValue ? 1 : 0),
).join('');
console.log(oxygenGeneratorRatingBinary);
const oxygenGeneratorRating = parseInt(oxygenGeneratorRatingBinary, 2);

const co2ScrubberRatingBinary = calculateRating(
  tree.children,
  (zeroesValue, onesValue) => (zeroesValue <= onesValue ? 0 : 1),
).join('');
console.log(co2ScrubberRatingBinary);
const co2ScrubberRating = parseInt(co2ScrubberRatingBinary, 2);

console.log(oxygenGeneratorRating * co2ScrubberRating);
