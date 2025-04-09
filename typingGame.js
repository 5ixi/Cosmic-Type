const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Coding is like poetry should be short and concise.",
  "Life is what happens when you're busy making other plans.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The best way to predict the future is to create it.",
  "Knowledge is power, but enthusiasm pulls the switch.",
  "The road to success and the road to failure are almost exactly the same.",
  "Believe you can and you're halfway there.",
  "It always seems impossible until it's done.",
  "In the middle of difficulty lies opportunity.",
  "Do not watch the clock. Do what it does. Keep going.",
  "Opportunities don't happen. You create them.",
  "Whether you think you can or you think you can't, you're right.",
  "Don't wait for opportunity. Create it.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
  "You don't have to be great to start, but you have to start to be great.",
  "Push yourself, because no one else is going to do it for you.",
  "Dream bigger. Do bigger.",
  "Great things never come from comfort zones.",
  "Work hard in silence. Let success make the noise.",
  "Your limitation—it's only your imagination.",
  "Sometimes later becomes never. Do it now.",
  "Little things make big days.",
  "If you are not willing to risk the usual, you will have to settle for the ordinary.",
  "Failure is the condiment that gives success its flavor.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Don’t limit your challenges. Challenge your limits.",
  "If you can dream it, you can do it."
];

// DOM Elements
const gameContainer = document.getElementById('game-container');
const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const resultPopup = document.getElementById('result-popup');
const finalWpm = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const closeResultButton = document.getElementById('close-result');
const difficultyButtons = document.querySelectorAll('.difficulty-button');
const themeToggle = document.getElementById('theme-toggle');
const soundToggle = document.getElementById('sound-toggle');

// Game state
let currentQuote = '';
let startTime;
let timer;
let timerRunning = false;
let mistakes = 0;
let totalChars = 0;
let gameMode = 'normal'; // 'normal', 'hard', 'expert'
let soundEnabled = true;
let darkTheme = true;

// Sound effects
const keySound = new Audio();
keySound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-fast-small-sweep-transition-166.mp3';
keySound.volume = 0.2;

const successSound = new Audio();
successSound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3';
successSound.volume = 0.3;

const errorSound = new Audio();
errorSound.src = 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-electricity-buzz-955.mp3';
errorSound.volume = 0.2;

// Initialize game
function initGame() {
  difficultyButtons.forEach(button => {
      button.addEventListener('click', () => {
          setDifficulty(button.dataset.mode);
          difficultyButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
      });
  });

  startButton.addEventListener('click', startGame);
  resetButton.addEventListener('click', resetGame);
  closeResultButton.addEventListener('click', () => {
      resultPopup.classList.remove('show');
  });

  quoteInput.addEventListener('input', checkInput);
  themeToggle.addEventListener('click', toggleTheme);
  soundToggle.addEventListener('click', toggleSound);

  document.body.classList.add('dark-theme');
}

// Set game difficulty
function setDifficulty(mode) {
  gameMode = mode;
  resetGame();
}

// Toggle theme
function toggleTheme() {
  darkTheme = !darkTheme;
  document.body.classList.toggle('dark-theme', darkTheme);
  document.body.classList.toggle('light-theme', !darkTheme);
  themeToggle.innerHTML = darkTheme ? 
      '<span class="material-icons">light_mode</span>' : 
      '<span class="material-icons">dark_mode</span>';
}

// Toggle sound
function toggleSound() {
  soundEnabled = !soundEnabled;
  soundToggle.innerHTML = soundEnabled ? 
      '<span class="material-icons">volume_up</span>' : 
      '<span class="material-icons">volume_off</span>';
}

// Start game
function startGame() {
  if (timerRunning) return;
  
  mistakes = 0;
  totalChars = 0;
  
  currentQuote = getRandomQuote();
  displayQuote(currentQuote);
  
  quoteInput.value = '';
  quoteInput.disabled = false;
  quoteInput.focus();
  startTime = new Date();
  timerRunning = true;
  
  startButton.disabled = true;
  resetButton.disabled = false;
  
  timer = setInterval(updateTimer, 1000);
  updateTimer();
}

// Update timer display
function updateTimer() {
  const currentTime = new Date();
  const timeElapsed = Math.floor((currentTime - startTime) / 1000);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  if (quoteInput.value.length > 0) {
      updateWPM(timeElapsed);
  }
}

// Get random quote based on difficulty
function getRandomQuote() {
  let filteredQuotes = quotes;
  
  if (gameMode === 'hard') {
      filteredQuotes = quotes.filter(quote => quote.length > 50);
  } else if (gameMode === 'expert') {
      filteredQuotes = quotes.filter(quote => quote.length > 80);
  }
  
  if (filteredQuotes.length === 0) {
      filteredQuotes = quotes;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  return filteredQuotes[randomIndex];
}

// Display quote with character-by-character styling
function displayQuote(quote) {
  quoteDisplay.innerHTML = '';
  
  for (let i = 0; i < quote.length; i++) {
      const charSpan = document.createElement('span');
      charSpan.textContent = quote[i];
      charSpan.className = 'character';
      quoteDisplay.appendChild(charSpan);
  }
}

// Check input against current quote
function checkInput() {
  const quoteArray = quoteDisplay.querySelectorAll('span');
  const inputArray = quoteInput.value.split('');
  
  if (soundEnabled) {
      keySound.currentTime = 0;
      keySound.play();
  }
  
  quoteArray.forEach((charSpan, index) => {
      const inputChar = inputArray[index];
      
      if (inputChar == null) {
          charSpan.classList.remove('correct', 'incorrect');
      } else if (inputChar === charSpan.textContent) {
          charSpan.classList.add('correct');
          charSpan.classList.remove('incorrect');
      } else {
          charSpan.classList.add('incorrect');
          charSpan.classList.remove('correct');
          
          if (!charSpan.classList.contains('counted-mistake')) {
              mistakes++;
              charSpan.classList.add('counted-mistake');
              
              if (soundEnabled) {
                  errorSound.currentTime = 0;
                  errorSound.play();
              }
          }
      }
  });
  
  totalChars = Math.max(totalChars, inputArray.length);
  updateAccuracy();
  
  // Finish when the input length matches the quote length, regardless of correctness
  if (inputArray.length === quoteArray.length) {
      finishGame();
  }
}

// Update WPM display
function updateWPM(timeElapsed) {
  const minutes = timeElapsed / 60;
  const wpm = Math.round((quoteInput.value.length / 5) / (minutes || 1));
  wpmDisplay.textContent = wpm;
}

// Update accuracy display
function updateAccuracy() {
  const accuracy = totalChars > 0 ? Math.round(((totalChars - mistakes) / totalChars) * 100) : 100;
  accuracyDisplay.textContent = `${accuracy}%`;
}

// Finish game
function finishGame() {
  clearInterval(timer);
  timerRunning = false;
  quoteInput.disabled = true;
  startButton.disabled = false;
  
  const timeElapsed = (new Date() - startTime) / 1000;
  const minutes = timeElapsed / 60;
  const finalWpmValue = Math.round((quoteInput.value.length / 5) / (minutes || 1));
  const finalAccuracyValue = totalChars > 0 ? Math.round(((totalChars - mistakes) / totalChars) * 100) : 100;
  
  finalWpm.textContent = finalWpmValue;
  finalAccuracy.textContent = `${finalAccuracyValue}%`;
  resultPopup.classList.add('show');
  
  if (soundEnabled) {
      successSound.play();
  }
}

// Reset game
function resetGame() {
  clearInterval(timer);
  timerRunning = false;
  quoteInput.value = '';
  quoteInput.disabled = true;
  quoteDisplay.innerHTML = '<span class="quote-placeholder">Click "Start" to begin typing...</span>';
  timerDisplay.textContent = '00:00';
  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '100%';
  startButton.disabled = false;
  resetButton.disabled = true;
  resultPopup.classList.remove('show');
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initGame();
  resetGame();
});
