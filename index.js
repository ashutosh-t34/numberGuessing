// ================== HIGH SCORE ==================
let highScore = localStorage.getItem("highScore");
const highScoreDisplay = document.getElementById("highScore");

if (highScore) {
  highScoreDisplay.textContent = highScore;
}

// ================== SOUNDS ==================
const winSound = new Audio("sounds/win.mp3");
const loseSound = new Audio("sounds/lose.mp3");
const clickSound = new Audio("sounds/click.mp3");

// ================== GAME STATE ==================
let maxNumber = 20;
let secretNumber = generateSecret();
let attempts = 0;
let gameWon = false;

// ================== DOM ==================
const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");
const input = document.getElementById("guessInput");
const checkBtn = document.getElementById("checkBtn");
const resetBtn = document.getElementById("resetBtn");
const confettiContainer = document.getElementById("confetti-container");

// ================== INIT ==================
setMessage("Choose difficulty to start the game", "neutral");

// ================== ENTER KEY SUPPORT ==================
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    checkBtn.click();
  }
});

// ================== CHECK BUTTON ==================
checkBtn.addEventListener("click", () => {
  if (gameWon) return;

  clickSound.currentTime = 0;
  clickSound.play();

  const guess = Number(input.value);

  if (!guess || guess < 1 || guess > maxNumber) {
    setMessage(`⛔ Enter a number between 1 and ${maxNumber}`, "lose");
    return;
  }

  attempts++;
  attemptsDisplay.textContent = attempts;

  if (guess === secretNumber) {
    handleWin();
  } else {
    loseSound.currentTime = 0;
    loseSound.play();
    setMessage(guess > secretNumber ? "📈 Too High!" : "📉 Too Low!", "lose");
  }
});

// ================== WIN HANDLER ==================
function handleWin() {
  gameWon = true;

  winSound.currentTime = 0;
  winSound.play();

  setMessage("🎉 Correct! You Win!", "win");
  launchConfetti();

  if (!highScore || attempts < highScore) {
    localStorage.setItem("highScore", attempts);
    highScoreDisplay.textContent = attempts;
  }
}

// ================== CONFETTI ==================
function launchConfetti() {
  confettiContainer.innerHTML = "";

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor =
      ["#22c55e", "#ef4444", "#facc15", "#3b82f6"][
        Math.floor(Math.random() * 4)
      ];
    confetti.style.animationDuration = Math.random() + 1 + "s";

    confettiContainer.appendChild(confetti);
  }
}

// ================== DIFFICULTY ==================
document.querySelectorAll("#difficulty button").forEach(button => {
  button.addEventListener("click", () => {
    const level = button.dataset.level;

    if (level === "easy") maxNumber = 10;
    if (level === "medium") maxNumber = 20;
    if (level === "hard") maxNumber = 50;

    resetGame(`New game! Guess between 1 and ${maxNumber}`);
  });
});

// ================== RESET ==================
resetBtn.addEventListener("click", () => {
  resetGame(`Game reset! Guess between 1 and ${maxNumber}`);
});

// ================== HELPERS ==================
function resetGame(text) {
  attempts = 0;
  gameWon = false;
  secretNumber = generateSecret();

  attemptsDisplay.textContent = attempts;
  input.value = "";
  confettiContainer.innerHTML = "";

  setMessage(text, "neutral");
}

function generateSecret() {
  return Math.floor(Math.random() * maxNumber) + 1;
}

function setMessage(text, className) {
  message.textContent = text;
  message.className = className;
}
