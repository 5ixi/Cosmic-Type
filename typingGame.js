const quotes = {
  easy: [
      "Stars shine bright.",
      "The moon is full.",
      "Fly to the sky.",
      "Cosmic dust falls.",
      "The sun burns hot.",
      "Rain falls gently.",
      "Winds whisper low.",
      "Clouds drift away.",
      "Night turns to day.",
      "Time moves forward.",
      "Glow in the dark.",
      "Twist and turn fast.",
      "Jump over the moon.",
      "Run with the stars.",
      "Dance in the void.",
      "Blink and it’s gone.",
      "Wish on a comet.",
      "Float in deep space.",
      "Sing to the planets.",
      "Chase the light rays.",
      "Spin with the galaxy.",
      "Hide in the shadows.",
      "Sparkle like stardust.",
      "Drift on a breeze.",
      "Soar above all.",
      "Dream under stars.",
      "Leap into orbit.",
      "Shine like the sun.",
      "Rush through the night.",
      "Glow with the dawn.",
      "Rest in the twilight."
  ],
  medium: [
      "The galaxy spins through endless time.",
      "Planets orbit in silent harmony.",
      "A comet streaks across the void.",
      "Nebulas glow with cosmic light.",
      "The quick brown fox jumps over the lazy dog.",
      "Life is what happens when you're busy making other plans.",
      "The best way to predict the future is to create it.",
      "Knowledge is power, but enthusiasm pulls the switch.",
      "Believe you can and you're halfway there.",
      "Opportunities don't happen. You create them.",
      "Dream bigger. Do bigger.",
      "Little things make big days.",
      "Work hard in silence. Let success make the noise.",
      "Sometimes later becomes never. Do it now.",
      "Stars align for those who dare to dream.",
      "The universe hums a quiet tune of chaos.",
      "Gravity binds us to this spinning rock.",
      "Light bends around the edges of time.",
      "Every sunrise is a canvas of hope.",
      "The void whispers secrets to the brave.",
      "A single spark can ignite the night sky.",
      "Courage lifts you higher than the stars.",
      "Echoes of the past ripple through space.",
      "Tomorrow is built on today’s small steps.",
      "The cosmos dances to an unseen rhythm.",
      "Fear fades when you chase the unknown.",
      "A meteor showers the sky with wishes.",
      "Hope is the fuel of every bright star.",
      "The night sky hides a million stories.",
      "Leap forward and the path will appear.",
      "The tide of fate turns with every choice."
  ],
  hard: [
      "Interstellar voyages require precision and courage beyond comprehension.",
      "The universe expands infinitely, revealing mysteries in every direction.",
      "Quantum fluctuations ripple through the fabric of spacetime endlessly.",
      "Black holes consume light and matter in an eternal cosmic dance.",
      "The only way to do great work is to love what you do relentlessly every day.",
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "The road to success and the road to failure are almost exactly the same winding path.",
      "In the middle of difficulty lies opportunity waiting to be seized by the bold.",
      "Do not watch the clock. Do what it does. Keep going despite all obstacles.",
      "Hardships often prepare ordinary people for an extraordinary destiny ahead.",
      "Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart.",
      "If you are not willing to risk the usual, you will have to settle for the ordinary life.",
      "Failure is the condiment that gives success its flavor after a long struggle.",
      "The harder you work for something, the greater you’ll feel when you achieve it finally.",
      "Galaxies collide in a symphony of chaos that echoes through the void of existence.",
      "The fabric of reality bends under the weight of unseen forces beyond our grasp.",
      "Every atom vibrates with the energy of a universe waiting to be understood fully.",
      "Time dilates as you approach the speed of light, warping all perceptions drastically.",
      "The cosmos is a puzzle with pieces scattered across infinite dimensions of thought.",
      "Bravery is stepping into the abyss when the stars refuse to light your way forward.",
      "Destiny is forged in the crucible of choice amidst the storms of uncertainty.",
      "A supernova’s brilliance outshines galaxies before fading into eternal darkness.",
      "The mind expands to fill the vast emptiness left by unanswered questions alone.",
      "Through the lens of a telescope, the past reveals itself in distant starlight glow.",
      "Resilience turns fleeting sparks into constellations that guide future generations.",
      "The pull of a black hole teaches us that even light bends to relentless will.",
      "Infinite possibilities spiral outward from every decision made in fleeting moments.",
      "The dance of orbits is a silent testament to the precision of cosmic machinery.",
      "To touch the stars, you must first let go of the ground beneath your trembling feet.",
      "The universe whispers its secrets in a language written in light and shadow play.",
      "Every heartbeat echoes the rhythm of a cosmos that never pauses to rest."
  ]
};

class TypingGame {
  constructor() {
      this.mode = 'easy';
      this.quote = '';
      this.timer = null;
      this.startTime = null;
      this.isRunning = false;
      this.mistakes = 0;
      this.charsTyped = 0;
      this.streak = 0;
      this.records = this.loadRecords();
      this.soundOn = true;
      this.darkTheme = true;
      this.progress = 0;
      this.hintUsed = false;

      this.elements = {
          quoteDisplay: document.getElementById('quote-display'),
          quoteInput: document.getElementById('quote-input'),
          timer: document.getElementById('timer'),
          wpm: document.getElementById('wpm'),
          accuracy: document.getElementById('accuracy'),
          streak: document.getElementById('streak'),
          bestWpm: document.getElementById('best-wpm'),
          bestAcc: document.getElementById('best-acc'),
          startButton: document.getElementById('start-button'),
          resetButton: document.getElementById('reset-button'),
          difficultyButtons: document.querySelectorAll('.difficulty-button'),
          themeToggle: document.getElementById('theme-toggle'),
          soundToggle: document.getElementById('sound-toggle'),
          resultPopup: document.getElementById('result-popup'),
          finalWpm: document.getElementById('final-wpm'),
          finalAccuracy: document.getElementById('final-accuracy'),
          finalStreak: document.getElementById('final-streak'),
          closeResult: document.getElementById('close-result')
      };

      this.sounds = {
          key: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-typewriter-key-1128.mp3'),
          error: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-error-bleep-294.mp3'),
          win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3'),
          powerUp: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magic-shimmer-while-rising-2358.mp3')
      };

      this.init();
  }

  init() {
      this.elements.difficultyButtons.forEach(btn => btn.addEventListener('click', () => this.setMode(btn.dataset.mode)));
      this.elements.startButton.addEventListener('click', () => this.start());
      this.elements.resetButton.addEventListener('click', () => this.reset());
      this.elements.quoteInput.addEventListener('input', () => this.checkInput());
      this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
      this.elements.soundToggle.addEventListener('click', () => this.toggleSound());
      this.elements.closeResult.addEventListener('click', () => this.elements.resultPopup.classList.remove('show'));

      document.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !this.isRunning) this.start();
          if (e.key === 'Escape') this.reset();
          if (e.ctrlKey && e.key === 'h' && this.isRunning && !this.hintUsed) this.showHint();
      });

      this.reset();
  }

  loadRecords() {
      return JSON.parse(localStorage.getItem('cosmicTyperRecords')) || {
          easy: { wpm: 0, accuracy: 0 },
          medium: { wpm: 0, accuracy: 0 },
          hard: { wpm: 0, accuracy: 0 }
      };
  }

  saveRecords() {
      localStorage.setItem('cosmicTyperRecords', JSON.stringify(this.records));
  }

  setMode(mode) {
      this.mode = mode;
      this.elements.difficultyButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
      this.reset();
      this.updateRecordsDisplay();
  }

  toggleTheme() {
      this.darkTheme = !this.darkTheme;
      document.body.classList.toggle('light-theme', !this.darkTheme);
      document.body.classList.toggle('dark-theme', this.darkTheme);
      this.elements.themeToggle.querySelector('span').textContent = this.darkTheme ? 'light_mode' : 'dark_mode';
  }

  toggleSound() {
      this.soundOn = !this.soundOn;
      this.elements.soundToggle.querySelector('span').textContent = this.soundOn ? 'volume_up' : 'volume_off';
  }

  start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.mistakes = 0;
      this.charsTyped = 0;
      this.streak = 0;
      this.progress = 0;
      this.hintUsed = false;
      this.quote = this.mode === 'record' ? this.getRecordQuote() : this.getRandomQuote();
      this.renderQuote();
      this.elements.quoteInput.value = '';
      this.elements.quoteInput.disabled = false;
      this.elements.quoteInput.focus();
      this.startTime = new Date();
      this.elements.startButton.disabled = true;
      this.elements.resetButton.disabled = false;
      this.timer = setInterval(() => this.updateStats(), 1000);
      this.updateStats();
      this.maybeTriggerPowerUp();
  }

  getRandomQuote() {
      const quoteList = quotes[this.mode] || quotes.easy;
      return quoteList[Math.floor(Math.random() * quoteList.length)];
  }

  getRecordQuote() {
      const baseMode = 'hard';
      return quotes[baseMode].sort((a, b) => b.length - a.length)[0];
  }

  renderQuote() {
      this.elements.quoteDisplay.innerHTML = this.quote.split('').map(char => `<span class="character">${char}</span>`).join('');
  }

  checkInput() {
      const input = this.elements.quoteInput.value;
      const quoteSpans = this.elements.quoteDisplay.querySelectorAll('.character');
      if (this.soundOn) this.sounds.key.play();

      quoteSpans.forEach((span, i) => {
          if (i < input.length) {
              if (input[i] === span.textContent) {
                  span.classList.add('correct');
                  span.classList.remove('incorrect');
                  if (i === input.length - 1) this.streak++;
              } else {
                  span.classList.add('incorrect');
                  span.classList.remove('correct');
                  if (!span.classList.contains('mistake-counted')) {
                      this.mistakes++;
                      span.classList.add('mistake-counted');
                      this.streak = 0;
                      if (this.soundOn) this.sounds.error.play();
                  }
              }
          } else {
              span.classList.remove('correct', 'incorrect');
          }
      });

      this.charsTyped = input.length;
      this.progress = Math.round((this.charsTyped / this.quote.length) * 100);
      this.updateStats();
      if (input.length === this.quote.length) this.finish();
  }

  updateStats() {
      const elapsed = (new Date() - this.startTime) / 1000;
      const minutes = elapsed / 60;
      const wpm = Math.round((this.charsTyped / 5) / (minutes || 1));
      const accuracy = this.charsTyped ? Math.round(((this.charsTyped - this.mistakes) / this.charsTyped) * 100) : 100;

      this.elements.timer.textContent = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${Math.floor(elapsed % 60).toString().padStart(2, '0')}`;
      this.elements.wpm.textContent = wpm;
      this.elements.accuracy.textContent = `${accuracy}%`;
      this.elements.streak.textContent = this.streak;
      this.elements.streak.classList.toggle('pulse', this.streak >= 10);
  }

  updateRecordsDisplay() {
      const baseMode = this.mode === 'record' ? 'hard' : this.mode;
      this.elements.bestWpm.textContent = this.records[baseMode].wpm;
      this.elements.bestAcc.textContent = `${this.records[baseMode].accuracy}%`;
  }

  finish() {
      clearInterval(this.timer);
      this.isRunning = false;
      this.elements.quoteInput.disabled = true;
      this.elements.startButton.disabled = false;

      const elapsed = (new Date() - this.startTime) / 1000;
      const minutes = elapsed / 60;
      const wpm = Math.round((this.charsTyped / 5) / (minutes || 1));
      const accuracy = this.charsTyped ? Math.round(((this.charsTyped - this.mistakes) / this.charsTyped) * 100) : 100;

      const baseMode = this.mode === 'record' ? 'hard' : this.mode;
      if (wpm > this.records[baseMode].wpm || accuracy > this.records[baseMode].accuracy) {
          this.records[baseMode].wpm = Math.max(wpm, this.records[baseMode].wpm);
          this.records[baseMode].accuracy = Math.max(accuracy, this.records[baseMode].accuracy);
          this.saveRecords();
          this.updateRecordsDisplay();
      }

      this.elements.finalWpm.textContent = wpm;
      this.elements.finalAccuracy.textContent = `${accuracy}%`;
      this.elements.finalStreak.textContent = this.streak;
      this.elements.resultPopup.classList.add('show');
      if (this.soundOn) this.sounds.win.play();
  }

  reset() {
      clearInterval(this.timer);
      this.isRunning = false;
      this.elements.quoteInput.value = '';
      this.elements.quoteInput.disabled = true;
      this.elements.quoteDisplay.innerHTML = 'Press Start to begin your cosmic journey...';
      this.elements.timer.textContent = '00:00';
      this.elements.wpm.textContent = '0';
      this.elements.accuracy.textContent = '100%';
      this.elements.streak.textContent = '0';
      this.elements.streak.classList.remove('pulse');
      this.elements.startButton.disabled = false;
      this.elements.resetButton.disabled = true;
      this.elements.resultPopup.classList.remove('show');
      this.updateRecordsDisplay();
  }

  showHint() {
      if (this.hintUsed || !this.isRunning) return;
      this.hintUsed = true;
      const input = this.elements.quoteInput.value;
      const nextChars = this.quote.slice(input.length, input.length + 3);
      this.elements.quoteInput.placeholder = `Next: ${nextChars}`;
      setTimeout(() => this.elements.quoteInput.placeholder = 'Type here...', 3000);
      if (this.soundOn) this.sounds.powerUp.play();
  }

  maybeTriggerPowerUp() {
      if (Math.random() < 0.2) {
          setTimeout(() => {
              if (!this.isRunning) return;
              const input = this.elements.quoteInput.value;
              const words = this.quote.slice(0, input.length).split(' ');
              const lastWord = words[words.length - 1];
              const nextSpace = this.quote.indexOf(' ', input.length);
              const nextWordEnd = nextSpace === -1 ? this.quote.length : nextSpace;
              const nextWord = this.quote.slice(input.length, nextWordEnd);
              this.elements.quoteInput.value = input + nextWord;
              this.checkInput();
              if (this.soundOn) this.sounds.powerUp.play();
          }, 5000);
      }
  }

  exportStats() {
      const stats = `Cosmic Type Stats\nMode: ${this.mode}\nWPM: ${this.elements.wpm.textContent}\nAccuracy: ${this.elements.accuracy.textContent}\nStreak: ${this.streak}\nBest WPM: ${this.records[this.mode].wpm}\nBest Accuracy: ${this.records[this.mode].accuracy}%`;
      navigator.clipboard.writeText(stats);
      alert('Stats copied to clipboard!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new TypingGame();
  document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'e') game.exportStats();
  });
});
