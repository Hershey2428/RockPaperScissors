const choices = document.querySelectorAll('.choice');
const result = document.getElementById('result');
const taunt = document.getElementById('taunt');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
const resetBtn = document.getElementById('reset');
const turnIndicator = document.getElementById('turn-indicator');
const computerMoveContainer = document.getElementById("computer-move"); // NEW: computer move container

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
		startRound(playerChoice);
	});
});

function startRound(playerChoice) {
	choices.forEach(btn => btn.disabled = true);

	let count = 3;

	// ===== NEW: Big, bold countdown in center =====
	turnIndicator.textContent = count;
	turnIndicator.style.fontSize = "3rem"; // NEW
	turnIndicator.style.fontWeight = "bold"; // NEW
	turnIndicator.style.color = "#333"; // NEW

	// ===== NEW: Highlight player choice in center =====
	choices.forEach(btn => {
		if (btn.dataset.choice === playerChoice) {
			btn.style.transition = "all 0.5s ease"; // NEW
			btn.style.transform = "scale(2)"; // NEW: grow bigger
			btn.style.fontWeight = "bold"; // NEW: bold
			btn.style.zIndex = "10"; // NEW: bring to front
		} else {
			btn.style.visibility = "hidden"; // NEW: hide other choices
		}
	});

	const countdown = setInterval(() => {
		count--;
		if (count > 0) {
			turnIndicator.textContent = count;
		} else {
			clearInterval(countdown);
			revealRound(playerChoice);
		}
	}, 500);
}

function revealRound(playerChoice) {
	const computerChoice = getComputerChoice();
	const winner = getWinner(playerChoice, computerChoice);

	if (winner === 'player') playerScore++;
	else if (winner === 'computer') computerScore++;

	player1Score.textContent = playerScore;
	player2Score.textContent = computerScore;

	// ===== NEW: Show computer move under bot =====
	const computerEmoji = computerChoice === "rock" ? "🪨" :
							computerChoice === "paper" ? "📄" : "✂️";
	computerMoveContainer.textContent = computerEmoji; // NEW
	computerMoveContainer.style.opacity = 1; // NEW
	computerMoveContainer.style.transform = "scale(1.2)"; // NEW
	setTimeout(() => computerMoveContainer.style.transform = "scale(1)", 200); // NEW

	// ===== NEW: Show result in turnIndicator =====
	turnIndicator.textContent = getResultText(winner, playerChoice, computerChoice); // NEW
	turnIndicator.style.fontSize = "2rem"; // NEW
	turnIndicator.style.fontWeight = "bold"; // NEW
	turnIndicator.style.color = winner === "player" ? "green" : winner === "computer" ? "red" : "orange"; // NEW

	taunt.textContent = taunts[Math.floor(Math.random() * taunts.length)];

	// Reset buttons and countdown after delay
	setTimeout(() => {
		choices.forEach(btn => {
			btn.style.transform = "scale(1)";
			btn.style.fontWeight = "normal";
			btn.style.visibility = "visible";
			btn.style.zIndex = "1";
			btn.disabled = false;
		});
		turnIndicator.textContent = "Make your move!";
		turnIndicator.style.fontSize = "1rem"; // NEW: reset size
		turnIndicator.style.color = "#333"; // NEW: reset color
	}, 1500);
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
	turnIndicator.textContent = "Make your move!";
	computerMoveContainer.textContent = ''; // NEW
	computerMoveContainer.style.opacity = 0; // NEW
	computerMoveContainer.style.transform = "scale(0.5)"; // NEW
	choices.forEach(btn => {
		btn.style.transform = "scale(1)";
		btn.style.fontWeight = "normal";
		btn.style.visibility = "visible";
		btn.disabled = false;
	});
});