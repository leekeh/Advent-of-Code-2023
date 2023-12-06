import * as fs from "fs/promises";

run();

async function getInput() {
  const input = (await fs.readFile("6/6.txt")).toString();
  const [times, distances] = input.split("\n").map((line) =>
    line
      .split(/[ ]+/)
      .slice(1)
      .map((numString) => +numString)
  );
  const games = times.map((time, i) => ({ time, distance: distances[i] }));
  return games;
}

async function run() {
  const games = await getInput();
  console.log(`The answer to part one is ${partOne(games)}.`);
  console.log(`The answer to part two is ${partTwo(games)}.`);
}

function partOne(games) {
  let product = 1;

  games.forEach(({ time, distance }) => {
    //Buckle in, we're going to use the quadratic formula
    //To calculate the minimum and maximum value that you need to hold
    //The base of it is this:
    //HoldTime * (duration - holdTime) = distance + 1
    //i.e. we will find the value of holdTime for which it intersects
    //with the minimum winning score
    const a = 1;
    const b = -time;
    const c = distance + 1;
    const discriminantRoot = Math.sqrt(b ** 2 - 4 * a * c);
    const x1 = ((-b - discriminantRoot) / 2) * a;
    const x2 = ((-b + discriminantRoot) / 2) * a;
    //In the game, you can only hold for full integer values of ms
    //For the minimum, round up so we will have passed the distance to beat
    //For the maximum, round down so we will not have gone under the distance to beat
    const min = Math.ceil(x1);
    const max = Math.floor(x2);
    //The number of integer values between min and max is the solution, including the min
    const possibleSolutions = max - min + 1;
    product *= possibleSolutions;
  });
  return product;
}

function partTwo(games) {
  const game = games.reduce(
    (prevValue, accumulator) => {
      return {
        time: +`${prevValue.time}${accumulator.time}`,
        distance: +`${prevValue.distance}${accumulator.distance}`,
      };
    },
    { time: 0, distance: 0 }
  );
  return partOne([game]);
}
