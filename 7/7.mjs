import * as fs from "fs/promises";

run();

async function getPlays() {
  const input = (await fs.readFile("7/7.txt")).toString();
  return input.split(/\r?\n/g).map((line) => {
    const [hand, bid] = line.split(" ");
    return { hand, bid: +bid };
  });
}

let withJokers = false;

async function run() {
  const plays = await getPlays();
  console.log(`The answer to part one is ${partOne(plays)}.`);
  withJokers = true;
  console.log(`The answer to part one is ${partOne(plays)}.`);
}

function partOne(plays) {
  const sortedPlays = plays.sort(sortPlays);
  const total = sortedPlays.reduce(
    (prevValue, currentValue, i) => (prevValue += currentValue.bid * (i + 1)),
    0
  );
  return total;
}

function sortPlays(playA, playB) {
  const countedCardsA = countCards(playA.hand);
  const countedCardsB = countCards(playB.hand);
  if (getTypeIndex(countedCardsA) < getTypeIndex(countedCardsB)) {
    return -1;
  }
  if (getTypeIndex(countedCardsA) > getTypeIndex(countedCardsB)) {
    return 1;
  }
  return sortByHighestCardValue(playA.hand, playB.hand);
}

function countCards(hand) {
  let cards = hand.split("");
  let jokers = 0;
  if (withJokers) {
    cards = cards.filter((card) => {
      if (card === "J") {
        jokers++;
        return false;
      }
      return true;
    });
  }
  const countedCards = cards.reduce((prevValue, currentValue) => {
    prevValue[currentValue] =
      currentValue in prevValue ? prevValue[currentValue] + 1 : 1;
    return prevValue;
  }, {});
  const sortedCounts = Object.entries(countedCards)
    .map(([_, count]) => count)
    .sort((countA, countB) => {
      if (countA < countB) {
        return 1;
      } else if (countA > countB) {
        return -1;
      }
      return 0;
    });

  if (jokers > 0) {
    applyJokers(sortedCounts, jokers);
  }
  return sortedCounts;
}

function applyJokers(sortedCounts, amount) {
  if (amount === 5) {
    sortedCounts[0] = 5;
    return;
  }
  // Unsure why, but this part should not be used.
  //   if (amount === 1 && sortedCounts[0] === 3) {
  //     sortedCounts[1] += amount;
  //     return;
  //   }

  sortedCounts[0] += amount;
}

function getTypeIndex(countedHand) {
  const typeOrder = [
    "HighCard",
    "OnePair",
    "TwoPair",
    "ThreeOfAKind",
    "FullHouse",
    "FourOfAKind",
    "FiveOfAKind",
  ];
  if (countedHand[0] === 5) {
    return typeOrder.indexOf("FiveOfAKind");
  }
  if (countedHand[0] === 4) {
    return typeOrder.indexOf("FourOfAKind");
  }
  if (countedHand[0] === 3) {
    if (countedHand[1] === 2) {
      return typeOrder.indexOf("FullHouse");
    }
    return typeOrder.indexOf("ThreeOfAKind");
  }
  if (countedHand[0] === 2) {
    if (countedHand[1] === 2) {
      return typeOrder.indexOf("TwoPair");
    }
    return typeOrder.indexOf("OnePair");
  }
  return typeOrder.indexOf("HighCard");
}

function sortByHighestCardValue(handA, handB) {
  const cardOrder = withJokers
    ? ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"]
    : ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
  for (let i = 0; i < 5; i++) {
    if (cardOrder.indexOf(handA[i]) < cardOrder.indexOf(handB[i])) {
      return -1;
    }
    if (cardOrder.indexOf(handA[i]) > cardOrder.indexOf(handB[i])) {
      return 1;
    }
  }
  console.log("Unexpectedly, two hands rank the same");
  return 0;
}
