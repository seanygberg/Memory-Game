const gameContainer = document.getElementById("game");
const startGameButton = document.getElementById("startGame");
const restartGameButton = document.getElementById("restartGame");
const scoreText = document.getElementById("score");
const lowestScoreText = document.getElementById("lowestScore");
let cardOne = null;
let cardTwo = null;
let canClick = false;
let score = 0;
let lowestScore = localStorage.getItem("lowestScore") || Infinity;

const numOfColors = 10;
let cardsMatched = 0;

const COLORS = generateRandomColors(numOfColors);

function generateRandomColors(numColors) {
  let colors = [];
  for (let i = 0; i < numColors; i++) {
    let color = randomColor();
    // Colors are added twice to get matches
    colors.push(color);
    colors.push(color);
  }
  return colors;
}

function startGame() {
  score = 0;
  scoreText.innerText = "Score: " + score;
  lowestScore = localStorage.getItem("lowestScore") || Infinity;
  lowestScoreText.innerText = "Best Score: " + lowestScore;
  canClick = true;
  createDivsForColors(shuffledColors);
}

function restartGame() {
  gameContainer.innerHTML = "";
  colors = [];
  startGame();
}

function endGame() {
  gameContainer.innerHTML = "";
  let message = document.createElement('h1');
  if (score < lowestScore) {
    lowestScore = score;
    localStorage.setItem("lowestScore", lowestScore);
  }
  message.innerText = "You Win!\nCongratulations! Your score is " + score;
  gameContainer.appendChild(message);
}

function randomColor() {
  const r = Math.floor(Math.random()*256);
  const g = Math.floor(Math.random()*256);
  const b = Math.floor(Math.random()*256);
  return `rgb(${r},${g},${b})`
}

startGameButton.addEventListener("click", startGame);
restartGameButton.addEventListener("click", restartGame);

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!

function handleCardClick(event) {

  // Will stop user from clicking too quickly
  if (!canClick) {
    return;
  }

  let card = event.target

  // Check if card is not first card
  if (card === cardOne) {
    return;
  }

  score += 1;
  scoreText.innerText = "Score: " + score;

  // Change background color of card
  card.style.backgroundColor = card.classList[0];

  // Keep track of the first and second card
  if (cardOne === null) {
    cardOne = card;
    return;
  } else {
    cardTwo = card;
    canClick = false;
  }

  // Do we have a match?
  if (cardOne.classList.value === cardTwo.classList.value) {
    cardsMatched += 1;
    cardOne.removeEventListener("click", handleCardClick);
    cardTwo.removeEventListener("click", handleCardClick);
    cardOne = null;
    cardTwo = null;
    canClick = true;
    if (cardsMatched === numOfColors) {
      setTimeout(endGame, 1000);
    }
  } else {
    setTimeout(function() {
      cardOne.style.backgroundColor = "";
      cardTwo.style.backgroundColor = "";
      cardOne = null;
      cardTwo = null;
      canClick = true;
    }, 1000);
  }
}

// when the DOM loads