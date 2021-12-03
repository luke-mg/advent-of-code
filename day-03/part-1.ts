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

const initialState: BitCount[] = Array(binaryLength).fill({ 0: 0, 1: 0 });

const totals = input.reduce<BitCount[]>(
  (inputAcc, binaryList) =>
    binaryList.reduce(
      (acc, binary, index) =>
        Object.assign([], {
          ...acc,
          [index]: { ...acc[index], [binary]: acc[index][binary] + 1 },
        }),
      inputAcc,
    ),
  initialState,
);

const mostCommonBits = totals.reduce<Bit[]>(
  (acc, bitCount) => [...acc, bitCount[0] > bitCount[1] ? 0 : 1],
  [],
);
const leastCommonBits = mostCommonBits.map((bit) => (bit === 0 ? 1 : 0));

const gammaBinary = mostCommonBits.join('');
const epsilonBinary = leastCommonBits.join('');

const gamma = parseInt(gammaBinary, 2);
const epsilon = parseInt(epsilonBinary, 2);

console.log(gamma * epsilon);
// 101110111100 010001000011
