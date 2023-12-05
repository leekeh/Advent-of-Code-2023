import * as fs from "fs/promises";

run();

async function getInput() {
  const input = (await fs.readFile("5/5.txt")).toString().split("\n\n");

  const seeds = input[0]
    .split(": ")[1]
    .split(" ")
    .map((seed) => +seed);
  const conversions = input.slice(1).map((string) => {
    const splitString = string.split(":");
    const ranges = splitString[1]
      .split("\n")
      .slice(1)
      .map((line) => {
        const [destRangeStart, srcRangeStart, rngLength] = line.split(" ");
        return {
          destRangeStart: +destRangeStart,
          srcRangeStart: +srcRangeStart,
          rngLength: +rngLength,
        };
      });
    return ranges;
  });
  return { conversions, seeds };
}

async function run() {
  const input = await getInput();
  console.log(`The answer to part one is ${partOne(input)}.`);
  console.log(`The answer to part two is ${partTwo(input)}.`);
}

function partOne(input) {
  const { conversions, seeds } = input;
  const finalLocations = seeds.map((seed) => {
    let seedLocation = seed;
    stepIteration: for (const conversionStep of conversions) {
      for (const range of conversionStep) {
        const distanceFromStart = seedLocation - range.srcRangeStart;
        if (distanceFromStart >= 0 && distanceFromStart < range.rngLength) {
          seedLocation = range.destRangeStart + distanceFromStart;
          continue stepIteration;
        }
      }
    }
    return seedLocation;
  });
  return Math.min(...finalLocations);
}

function partTwo(input) {
  const { conversions, seeds } = input;
  const lowestSeedsInRanges = [];
  for (let i = 0; i < seeds.length; i += 2) {
    const seedStart = seeds[i];
    const seedEnd = seeds[i + 1] + seedStart;
    lowestSeedsInRanges.push(
      getLowestFinalPos(seedStart, seedEnd, conversions)
    );
  }
  return Math.min(...lowestSeedsInRanges);
}

/** 
Find lowest final position of a range of seeds.
@param {{
  destRangeStart: number,
  srcRangeStart: number,
  rngLength: number
}[][]} conversions 
@param {number} start start of inital seed range
@param {number} end end of inital seed range
@returns {number}
*/
function getLowestFinalPos(start, end, conversions) {
  //Group seed locations in ranges to save performance
  let seedLocationRanges = [{ start, end }];
  //For every step, we update the seedLocationRanges with the mapped values
  //as well as the original ranges that did not get converted
  for (const conversionStep of conversions) {
    const convertedValues = [];
    let unconvertedValues = [...seedLocationRanges];
    for (const conversionRange of conversionStep) {
      const conversionSrc = {
        start: conversionRange.srcRangeStart,
        end: conversionRange.srcRangeStart + conversionRange.rngLength - 1,
      };
      const conversionValue =
        conversionRange.destRangeStart - conversionRange.srcRangeStart;
      const conversionRemainder = [];

      unconvertedValues.forEach((unconvertedValue) => {
        const { result, remainder } = mapRange(
          unconvertedValue,
          conversionSrc,
          conversionValue
        );
        if (result) {
          convertedValues.push(result);
        }
        conversionRemainder.push(...remainder);
      });
      unconvertedValues = conversionRemainder;
    }
    seedLocationRanges = [...convertedValues, ...unconvertedValues];
  }
  return Math.min(...seedLocationRanges.map((range) => range.start));
}

function mapRange(srcRange, conversionRange, conversionValue) {
  let result = undefined;
  const remainder = [];

  const convertableRange = {
    start: Math.max(srcRange.start, conversionRange.start),
    end: Math.min(srcRange.end, conversionRange.end),
  };

  if (convertableRange.start <= convertableRange.end) {
    result = {
      start: convertableRange.start + conversionValue,
      end: convertableRange.end + conversionValue,
    };
    if (srcRange.start < convertableRange.start) {
      remainder.push({
        start: srcRange.start,
        end: convertableRange.start - 1,
      });
    }
    if (srcRange.end > convertableRange.end) {
      remainder.push({
        start: convertableRange.end + 1,
        end: srcRange.end,
      });
    }
  } else {
    remainder.push(srcRange);
  }
  return { result, remainder };
}
