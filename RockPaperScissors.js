const choices = document.querySelectorAll(".choice");
const playerScoreElem = document.getElementById("player1-score");
const computerScoreElem = document.getElementById("computer-score");
const taunt = document.getElementById("taunt");
const resetBtn = document.getElementById("reset");

const overlay = document.getElementById("showdown-overlay");
const caption = document.getElementById("caption");
const showdownTaunt = document.getElementById("showdown-taunt");

let playerScore = 0;
let computerScore = 0;

const emojiMap = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

const taunts = [
  "You’ll need more practice!",
  "Not bad for a human.",
  "My circuits are impressed… barely.",
  "Next time, I’ll crush you!",
  "That was predictable.",
  "Try me again, if you dare.",
];

function getComputerChoice() {
  const options = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * 3)];
}

function determineWinner(player, computer) {
  if (player === computer) return "draw";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) return "player";
  return "computer";
}

function playRound(playerChoice) {
  const computerChoice = getComputerChoice();
  const winner = determineWinner(playerChoice, computerChoice);
  showShowdown(playerChoice, computerChoice, winner);
}

function showShowdown(player, computer, winner) {
  overlay.style.display = "flex";

  const container = document.querySelector(".emoji-container");
  const playerEmoji = document.getElementById("player-emoji");
  const computerEmoji = document.getElementById("computer-emoji");

  // Reset collision emojis
  playerEmoji.textContent = emojiMap[player];
  computerEmoji.textContent = emojiMap[computer];
  playerEmoji.style.opacity = "1";
  computerEmoji.style.opacity = "1";
  playerEmoji.style.animation = "none";
  computerEmoji.style.animation = "none";
  void playerEmoji.offsetWidth;

  caption.textContent = "";
  showdownTaunt.textContent = "";

  // Run collision animation
  playerEmoji.style.animation = "collide 1.2s ease forwards";
  computerEmoji.style.animation = "collide-right 1.2s ease forwards";

  setTimeout(() => {
    // Hide collision emojis
    playerEmoji.style.opacity = "0";
    computerEmoji.style.opacity = "0";

    // Clear previous winner emoji
    const existingWin = container.querySelector(".winner-emoji");
    if (existingWin) existingWin.remove();

    // Determine winner emoji
    const winnerEmoji =
      winner === "player" ? playerEmoji.textContent :
      winner === "computer" ? computerEmoji.textContent : "🤝";

    // Create and append winner emoji
    const winSymbol = document.createElement("div");
    winSymbol.textContent = winnerEmoji;
    winSymbol.classList.add("winner-emoji");

    // Initial style
    winSymbol.style.opacity = "0";

    container.appendChild(winSymbol);

    // Force smooth animation without jump
    requestAnimationFrame(() => {
      winSymbol.style.animation = "fadeIn 0.8s ease forwards, fadeOut 1.5s ease 1s forwards";
      winSymbol.style.opacity = "1";
    });

    // Show captions and taunts
    if (winner === "draw") {
      caption.textContent = "It's a tie!";
      showdownTaunt.textContent = "Neither of us wins... this time.";
    } else if (winner === "player") {
      caption.textContent = "You win!";
      showdownTaunt.textContent = "I'll calculate a comeback...";
    } else {
      caption.textContent = "Computer wins!";
      showdownTaunt.textContent = "Told you, human!";
    }

    updateScores(winner);
    taunt.textContent = taunts[Math.floor(Math.random() * taunts.length)];

    setTimeout(() => {
      overlay.style.display = "none";
      winSymbol.remove();
    }, 2500);
  }, 1200);
}

function updateScores(winner) {
  if (winner === "player") playerScore++;
  else if (winner === "computer") computerScore++;
  playerScoreElem.textContent = playerScore;
  computerScoreElem.textContent = computerScore;
}

choices.forEach((choice) =>
  choice.addEventListener("click", (e) => playRound(e.target.dataset.choice))
);

resetBtn.addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  playerScoreElem.textContent = "0";
  computerScoreElem.textContent = "0";
  taunt.textContent = "Ready to lose, human?";
});
