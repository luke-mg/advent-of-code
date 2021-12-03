import { readFile } from 'fs/promises';
import { count, filter, from, pairwise, windowCount } from 'rxjs';

const readInput = async () => {
  const input = await readFile(new URL('input.txt', import.meta.url), 'utf-8');

  return input
    .split('\n')
    .filter((line) => line !== '')
    .map((str) => parseInt(str, 10));
};

const input = await readInput();

const windows = input.reduce<number[]>((acc, value, index, arr) => {
  if (index - 2 < 0) {
    return acc;
  }

  return [...acc, value + arr[index - 1] + arr[index - 2]];
}, []);

const count$ = from(windows).pipe(
  pairwise(),
  filter(([prev, curr]) => curr > prev),
  count(),
);

count$.subscribe((total) => console.log(total));
