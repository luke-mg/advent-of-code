import { readFile } from 'fs/promises';
import { count, filter, from, pairwise } from 'rxjs';

const readInput = async () => {
  const input = await readFile(new URL('input.txt', import.meta.url), 'utf-8');

  return input
    .split('\n')
    .filter((line) => line !== '')
    .map((str) => parseInt(str, 10));
};

const input = await readInput();

const count$ = from(input).pipe(
  pairwise(),
  filter(([prev, curr]) => curr > prev),
  count(),
);

count$.subscribe((total) => console.log(total));
