const buttons = document.querySelectorAll(".choice");
const resultDisplay = document.getElementById("result");
const turnIndicator = document.getElementById("turn-indicator");
const player1ScoreEl = document.getElementById("player1-score");
const player2ScoreEl = document.getElementById("player2-score");
const resetBtn = document.getElementById("reset");
const tauntEl = document.getElementById("taunt");
const computerMoveEl = document.getElementById("computer-move");

let player1Score = 0;
let player2Score = 0;
let singlePlayer = true;

// === MODE TOGGLE ===
document.getElementById("single-btn").addEventListener("click", () => {
	singlePlayer = true;
	document.getElementById("single-btn").classList.add("active");
	document.getElementById("multi-btn").classList.remove("active");
	document.getElementById("player2-label").textContent = "Computer: ";
});

document.getElementById("multi-btn").addEventListener("click", () => {
	singlePlayer = false;
	document.getElementById("multi-btn").classList.add("active");
	document.getElementById("single-btn").classList.remove("active");
	document.getElementById("player2-label").textContent = "Player 2: ";
});

// === GAME LOGIC ===
let player1Choice = null;
let player2Choice = null;
let waitingForP2 = false;

buttons.forEach(button => {
	button.addEventListener("click", () => {
		const choice = button.dataset.choice;

		if (singlePlayer) {
			playSinglePlayer(choice);
		} else {
			playTwoPlayer(choice);
		}
	});
});

function playSinglePlayer(playerChoice) {
	const choices = ["rock", "paper", "scissors"];
	const computerChoice = choices[Math.floor(Math.random() * 3)];

	const winner = getWinner(playerChoice, computerChoice);

	triggerShowdown(playerChoice, computerChoice, winner);

	updateScore(winner);
	updateResult(winner, playerChoice, computerChoice);
	showTaunt(winner);
}

function playTwoPlayer(choice) {
	if (!waitingForP2) {
		player1Choice = choice;
		waitingForP2 = true;
		turnIndicator.textContent = "Player 2's turn!";
	} else {
		player2Choice = choice;
		const winner = getWinner(player1Choice, player2Choice);

		triggerShowdown(player1Choice, player2Choice, winner);

		updateScore(winner);
		updateResult(winner, player1Choice, player2Choice);
		waitingForP2 = false;
		turnIndicator.textContent = "Player 1's turn!";
	}
}

function getWinner(p1, p2) {
	if (p1 === p2) return "tie";
	if (
		(p1 === "rock" && p2 === "scissors") ||
		(p1 === "paper" && p2 === "rock") ||
		(p1 === "scissors" && p2 === "paper")
	) {
		return "player";
	} else {
		return "computer";
	}
}

function updateScore(winner) {
	if (winner === "player") player1Score++;
	else if (winner === "computer") player2Score++;

	player1ScoreEl.textContent = player1Score;
	player2ScoreEl.textContent = player2Score;
}

function updateResult(winner, p1, p2) {
	let text = "";

	if (winner === "tie") text = `Both chose ${p1}. It's a tie!`;
	else if (winner === "player") text = `${p1} beats ${p2}. You win!`;
	else text = `${p2} beats ${p1}. You lose!`;

	resultDisplay.textContent = text;
	computerMoveEl.textContent = "🤖 " + p2;
}

function showTaunt(winner) {
	const taunts = {
		win: ["Nooo!", "Impossible!", "You cheated!", "Lucky shot!"],
		lose: ["Haha!", "Too easy!", "Try harder!", "Pathetic!"],
		tie: ["Huh, not bad.", "Even match!", "A tie? How boring."]
	};

	if (winner === "player") {
		tauntEl.textContent = taunts.win[Math.floor(Math.random() * taunts.win.length)];
	} else if (winner === "computer") {
		tauntEl.textContent = taunts.lose[Math.floor(Math.random() * taunts.lose.length)];
	} else {
		tauntEl.textContent = taunts.tie[Math.floor(Math.random() * taunts.tie.length)];
	}
}

// === RESET BUTTON ===
resetBtn.addEventListener("click", () => {
	player1Score = 0;
	player2Score = 0;
	player1ScoreEl.textContent = "0";
	player2ScoreEl.textContent = "0";
	resultDisplay.textContent = "";
	turnIndicator.textContent = "Make your move!";
	tauntEl.textContent = "Ready to lose, human?";
	computerMoveEl.textContent = "";
});

/* =====================
   SHOWDOWN ANIMATION
===================== */
function triggerShowdown(playerChoice, computerChoice, winner) {
	const overlay = document.getElementById("showdown-overlay");
	const playerEmoji = document.getElementById("player-emoji");
	const computerEmoji = document.getElementById("computer-emoji");
	const caption = document.getElementById("countdown-text");

	const emojiMap = {
		rock: "🪨",
		paper: "📄",
		scissors: "✂️"
	};

	playerEmoji.textContent = emojiMap[playerChoice];
	computerEmoji.textContent = emojiMap[computerChoice];
	caption.textContent = "3";
	overlay.classList.add("active");

	// Countdown
	let count = 2;
	const timer = setInterval(() => {
		caption.textContent = count;
		count--;
		if (count < 0) {
			clearInterval(timer);
			caption.textContent = "SHOOT!";
			startAnimation();
		}
	}, 700);

	function startAnimation() {
		playerEmoji.style.left = "30px";
		computerEmoji.style.right = "30px";

		playerEmoji.style.animation = "collide 1.5s ease-in-out 3 alternate";
		computerEmoji.style.animation = "collide-right 1.5s ease-in-out 3 alternate";

		setTimeout(() => {
			if (winner === "player") {
				computerEmoji.style.animation = "lose-slide 1s forwards";
				playerEmoji.style.animation = "glow 1.5s ease-in-out infinite alternate";
			} else if (winner === "computer") {
				playerEmoji.style.animation = "lose-slide 1s forwards";
				computerEmoji.style.animation = "glow 1.5s ease-in-out infinite alternate";
			} else {
				playerEmoji.style.opacity = "0.5";
				computerEmoji.style.opacity = "0.5";
				caption.textContent = "It's a tie!";
			}
			setTimeout(() => {
				overlay.classList.remove("active");
				playerEmoji.removeAttribute("style");
				computerEmoji.removeAttribute("style");
				caption.textContent = "";
			}, 2000);
		}, 2400);
	}
}