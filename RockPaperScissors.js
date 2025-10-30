const choices = document.querySelectorAll('.choice');
const result = document.getElementById('result');
const taunt = document.getElementById('taunt');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
const resetBtn = document.getElementById('reset');

let playerScore = 0;
let computerScore = 0;

const taunts = [
  "Is that all you've got?",
  "You call that a move?",
  "Predictable…",
  "Nice try, human!",
  "Processing your defeat..."
];

choices.forEach(button => {
  button.addEventListener('click', () => {
    const playerChoice = button.dataset.choice;
    playRound(playerChoice);
  });
});

function playRound(playerChoice) {
  const computerChoice = getComputerChoice();
  const winner = getWinner(playerChoice, computerChoice);

  if (winner === 'player') playerScore++;
  else if (winner === 'computer') computerScore++;

  player1Score.textContent = playerScore;
  player2Score.textContent = computerScore;

  result.textContent = getResultText(winner, playerChoice, computerChoice);
  taunt.textContent = taunts[Math.floor(Math.random() * taunts.length)];
}

function getComputerChoice() {
  const options = ['rock', 'paper', 'scissors'];
  return options[Math.floor(Math.random() * options.length)];
}

function getWinner(player, computer) {
  if (player === computer) return 'draw';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) return 'player';
  return 'computer';
}

function getResultText(winner, player, computer) {
  if (winner === 'draw') return `Both chose ${player}. It's a draw!`;
  if (winner === 'player') return `You win! ${player} beats ${computer}!`;
  return `You lose! ${computer} beats ${player}!`;
}

resetBtn.addEventListener('click', () => {
  playerScore = 0;
  computerScore = 0;
  player1Score.textContent = 0;
  player2Score.textContent = 0;
  result.textContent = '';
  taunt.textContent = 'Ready to lose, human?';
});