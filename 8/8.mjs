import * as fs from "fs/promises";

run();

async function getInput() {
  const input = (await fs.readFile("8/8.txt")).toString();
  const testInput = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

  let [instructions, map] = input.split("\n\n");
  instructions = instructions.split("");
  map = map.split("\n").reduce((prevValue, currentValue) => {
    const [key, elements] = currentValue.split(" = ");
    const [left, right] = elements.replace(/[()]/g, "").split(", ");
    prevValue[key] = { left, right };
    return prevValue;
  }, {});
  return { instructions, map };
}

async function run() {
  const input = await getInput();
  console.log(`The answer to part one is ${partOne(input)}.`);
  console.log(`The answer to part two is ${partTwo(input)}.`);
}

function partOne(input) {
  const { instructions, map } = input;
  let position = "AAA";
  let steps = 0;
  while (position !== "ZZZ") {
    position = map[position][getInstruction(instructions, steps)];
    steps++;
  }
  return steps;
}

function partTwo(input) {
  const { instructions, map } = input;
  const startPositions = Object.keys(map).filter((key) => key.endsWith("A"));
  const stepsPerPosition = startPositions.map((startPosition) => {
    let steps = 0;
    let position = startPosition;
    while (!position.endsWith("Z")) {
      const instruction = getInstruction(instructions, steps);
      position = map[position][instruction];
      steps++;
    }
    return steps;
  });

  return leastCommonMultiple(stepsPerPosition);
}

/** Taken from https://www.30secondsofcode.org/js/s/lcm/ */
const leastCommonMultiple = (numbers) => {
  const greatestCommonDivisor = (x, y) =>
    !y ? x : greatestCommonDivisor(y, x % y);
  const leastCommonMultiple = (x, y) => (x * y) / greatestCommonDivisor(x, y);
  return numbers.reduce((a, b) => leastCommonMultiple(a, b));
};

function getInstruction(instructions, index) {
  return instructions[index % instructions.length] === "L" ? "left" : "right";
}
