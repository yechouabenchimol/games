const cards = document.querySelectorAll('.card');

let hasFlippedCard = false; // keeps track of whether a card has been flipped
let lockBoard = false; // prevents player from clicking on cards while cards are flipping or a match is being checked
let firstCard, secondCard; // references to the first and second card that were clicked

// flip the card and add the 'flip' class to the element
function flipCard() {
  if (lockBoard) return; // do not allow player to click on cards while cards are flipping or a match is being checked
  if (this === firstCard) return; // do not allow player to click on the same card twice

  this.classList.add('flip'); // flip the card

  if (!hasFlippedCard) {
    // first click: set hasFlippedCard to true and set the firstCard
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click: set secondCard
  secondCard = this;

  checkForMatch();
}

// check if the data-framework attribute of the two cards match
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards(); // if the cards match, disable them; otherwise, unflip them
}

// disable the two cards by removing the event listener that allows them to be clicked
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

// unflip the two cards and lock the board to prevent player from clicking on other cards
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

// reset the hasFlippedCard, lockBoard, firstCard, and secondCard variables
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// shuffle the cards by assigning a random order to each card
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

// add an event listener to each card that allows it to be clicked and flipped
cards.forEach(card => card.addEventListener('click', flipCard));
