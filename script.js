const cells = document.querySelectorAll('.cell');
const resultScreen = document.getElementById('result-screen');
const resultMessage = document.getElementById('result-message');
const resetBtn = document.getElementById('reset-btn');
const newGameBtn = document.getElementById('new-game-btn');
const status = document.getElementById('status');
const welcomeScreen = document.getElementById('welcome-screen');
const gameContainer = document.querySelector('.game-container');
const playFriendsBtn = document.getElementById('play-friends');
const playBotBtn = document.getElementById('play-bot');

let currentPlayer = 'X';
let boardState = Array(9).fill(null);
let playWithBot = false;

const checkWinner = () => {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of winPatterns) {
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    return boardState.includes(null) ? null : 'Tie';
};

const updateStatus = () => {
    status.textContent = playWithBot && currentPlayer === 'O' ? "Bot's turn" : `Player ${currentPlayer}'s turn`;
};

const botMove = () => {
    let availableMoves = boardState.map((value, index) => value === null ? index : null).filter(value => value !== null);
    if (availableMoves.length === 0) return;
    let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    boardState[randomMove] = 'O';
    cells[randomMove].textContent = 'O';
};

const handleClick = (e) => {
    const index = e.target.dataset.index;
    if (boardState[index] || !resultScreen.classList.contains('hidden')) return;

    boardState[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    const winner = checkWinner();
    if (winner) {
        if (winner === 'Tie') {
            resultMessage.textContent = "It's a tie!";
        } else {
            resultMessage.textContent = `Player ${winner} wins!`;
        }
        resultScreen.classList.remove('hidden');
    } else {
        if (playWithBot && currentPlayer === 'X') {
            currentPlayer = 'O';
            updateStatus();
            botMove();
            const winnerAfterBotMove = checkWinner();
            if (winnerAfterBotMove) {
                if (winnerAfterBotMove === 'Tie') {
                    resultMessage.textContent = "It's a tie!";
                } else {
                    resultMessage.textContent = `Player ${winnerAfterBotMove} wins!`;
                }
                resultScreen.classList.remove('hidden');
            } else {
                currentPlayer = 'X';
                updateStatus();
            }
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
        }
    }
};

const resetGame = () => {
    boardState.fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    updateStatus();
    resultScreen.classList.add('hidden');
};

const startGame = (playBot) => {
    playWithBot = playBot;
    welcomeScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    resetGame();
};

playFriendsBtn.addEventListener('click', () => startGame(false));
playBotBtn.addEventListener('click', () => startGame(true));
resetBtn.addEventListener('click', resetGame);
newGameBtn.addEventListener('click', () => {
    resetGame();
    resultScreen.classList.add('hidden');
});

cells.forEach(cell => cell.addEventListener('click', handleClick));

updateStatus(); // Initialize status
