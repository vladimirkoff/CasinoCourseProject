import {cardsMap, cards} from './utils/cardsMapHelper.js';

const moneyField = document.querySelector('body > div.header > p');
const money = {
  value: parseInt(localStorage.getItem('money')),
  bettedValue: 0,
};

if (!money.value || isNaN(money.value)) {
  money.value = 0;
}

const betField = document
    .querySelector('body > div.main > div.row3 > input[type=text]');
const hitButton = document.querySelector('#hit');
const doubleButton = document.querySelector('#double');
const dealButton = document.querySelector('#deal');
const standButton = document.querySelector('#stand');
const commandTitle =  document.querySelector('#command');


const game = {
  'you': {'scoreSpan': '#yourscore', 'div': '#your-box', 'score': ''},
  'dealer': {'scoreSpan': '#dealerscore', 'div': '#dealer-box', 'score': ''},

  'cards': cards,
  'cardsmap': cardsMap,
};
const You = game['you'];
const Dealer = game['dealer'];


const gameState = (state) => {
  if (!state) {
    betField.disabled = false;
    dealButton.disabled = false;
    doubleButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;
  } else {
    betField.disabled = true;
    dealButton.disabled = true;
    doubleButton.disabled = true;
    hitButton.disabled = false;
    standButton.disabled = false;
  };
};

gameState(false);

const showScore = (activeplayer) => {
  const activeScoreSpan = document.querySelector(activeplayer['scoreSpan']);
  if (activeplayer['score']>21) {
    activeScoreSpan.textContent = 'BUST!';
    activeScoreSpan.style.color = 'yellow';
    gameState(false);
    showResults(findwinner());
  } else if (activeplayer['score'] === 21) {
    activeScoreSpan.textContent = 'BLACKJACK!!!!!';
    activeScoreSpan.style.color = 'blue';
    standButtonClick();
  } else {
    activeScoreSpan.textContent = activeplayer['score'];
  }
};

const updateScore = (currentcard, activeplayer) => {
  if (currentcard == 'AC' ||
      currentcard == 'AD' ||
      currentcard == 'AH' ||
      currentcard == 'AS') {
    if ((activeplayer['score'] + game['cardsmap'][currentcard][1]) <= 21) {
      activeplayer['score'] += game['cardsmap'][currentcard][1];
    } else {
      activeplayer['score'] += game['cardsmap'][currentcard][0];
    }
  } else { // For Other Cases
    activeplayer['score'] += game['cardsmap'][currentcard];
  }
};

const drawCard = (activePlayer) => {
  const randomNumber = Math.floor(Math.random() * (game['cards'].length));
  const currentCard = game['cards'].splice(randomNumber, 1);
  const card = document.createElement('img');
  card.src = `../static/assets/${currentCard}.png`;
  document.querySelector(activePlayer['div']).appendChild(card);
  updateScore(currentCard, activePlayer);
  showScore(activePlayer);
};

const findwinner = () => {
  let winner;

  if (You['score']<=21) {
    if (Dealer['score']<You['score'] || Dealer['score']>21) {
      game['wins']++;
      winner = You;
    } else if (Dealer['score'] == You['score']) {
      game['draws']++;
    } else {
      game['losses']++;
      winner = Dealer;
    }
  } else if (You['score']>21 && Dealer['score']<=21) {
    game['losses']++;
    winner = Dealer;
  } else if (You['score']>21 && Dealer['score']>21) {
    game['draws']++;
  }
  return winner;
};

const showResults = (winner) => {
  console.log("winner");
  if (winner == You) {
    commandTitle.textContent = 'You Won!';
    commandTitle.style.color = 'green';
    money.value += money.bettedValue;
  } else if (winner == Dealer) {
    commandTitle.textContent = 'You Lost!';
    commandTitle.style.color = 'red';
    money.value -= money.bettedValue;
  } else {
    commandTitle.textContent = 'You Drew!';
    commandTitle.style.color = 'orange';
  }
  moneyField.innerHTML = money.value;
  localStorage.setItem('money', money.value);
};

const hitButtonClick = () => {
  if (Dealer['score'] === 0) {
    if (You['score']<=21) {
      drawCard(You);
    }
  }
};

const dealButtonClick = () => {
  if (!betField.value || isNaN(betField.value)) {
    alert('Bet error');
    return;
  }
  const youImg = document.
      querySelector('#your-box').querySelectorAll('img');

  const dealerImg = document.
      querySelector('#dealer-box').querySelectorAll('img');

  for (let i=0; i < youImg.length; i++) {
    youImg[i].remove();
  }
  for (let i=0; i < dealerImg.length; i++) {
    dealerImg[i].remove();
  }

  game['cards'] = cards;
  You['score'] = 0;
  document.querySelector(You['scoreSpan']).textContent = You['score'];
  document.querySelector(You['scoreSpan']).style.color = 'black';
  Dealer['score'] = 0;
  document.querySelector(Dealer['scoreSpan']).textContent = Dealer['score'];
  document.querySelector(Dealer['scoreSpan']).style.color = 'black';

  document.querySelector('#command').textContent = 'Your turn!';
  document.querySelector('#command').style.color = 'black';

  gameState(true);
  money.bettedValue = parseInt(betField.value);
};


const standButtonClick = () => {
  if (You['score']===0) {
    alert('Please Hit Some Cards First!');
  } else {
    while (Dealer['score']<16) {
      drawCard(Dealer);
      if(Dealer['score'] > 21){
        return;
      }
    }
    setTimeout(function() {
      gameState(false);
      showResults(findwinner());
    }, 800);
  }
};

const doubleButtonClick = () => {
  betField.value *= 2;
  if (betField.value == NaN) betField.value = 0;
};

doubleButton.addEventListener('click', doubleButtonClick);
dealButton.addEventListener('click', dealButtonClick);
standButton.addEventListener('click', standButtonClick);
hitButton.addEventListener('click', hitButtonClick);