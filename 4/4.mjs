const testInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

import * as fs from "fs/promises";

run();

async function getNumbers() {
  const input = (await fs.readFile("./4.txt")).toString().split(/\r?\n/g);
  return input.map((line) => {
    line = line.split(":")[1];
    let [elfsNumbers, winningNumbers] = line.split("|");
    elfsNumbers = elfsNumbers.trim().split(/\s+/g);
    winningNumbers = winningNumbers.trim().split(/\s+/g);
    return [elfsNumbers, winningNumbers];
  });
}

async function run() {
  const numbers = await getNumbers();
  console.log(`The answer to part one is ${partOne(numbers)}.`);
  console.log(`The answer to part one is ${partTwo(numbers)}.`);
}

function partOne(numbers) {
  let score = 0;
  numbers.forEach(([elfNumbers, winningNumbers]) => {
    let cardScore = 0;
    elfNumbers.forEach((number) => {
      if (winningNumbers.includes(number)) {
        if (cardScore == 0) {
          cardScore = 1;
        } else {
          cardScore *= 2;
        }
      }
    });
    score += cardScore;
  });
  return score;
}

function partTwo(numbers) {
  numbers = numbers.map((card) => ({ card, amount: 1 }));
  numbers.forEach(({ card: [elfNumbers, winningNumbers], amount }, i) => {
    const matches = elfNumbers.filter((number) =>
      winningNumbers.includes(number)
    );
    for (let j = 1; j <= matches.length; j++) {
      numbers[i + j].amount += amount;
    }
  });
  return numbers.reduce(
    (prevValue, currentValue) => (prevValue += currentValue.amount),
    0
  );
}
