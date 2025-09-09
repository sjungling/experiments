class NumberMunchers {
    constructor() {
        this.gridWidth = 8;
        this.gridHeight = 6;
        this.playerPos = { x: 0, y: 0 };
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.timeLeft = 60;
        this.grid = [];
        this.monsters = [];
        this.gameRunning = false;
        this.gameTimer = null;
        this.monsterTimer = null;
        this.challenges = [
            // Kindergarten - Number Recognition
            { name: "Numbers = 1", check: n => n === 1 },
            { name: "Numbers = 2", check: n => n === 2 },
            { name: "Numbers = 3", check: n => n === 3 },
            { name: "Numbers = 4", check: n => n === 4 },
            { name: "Numbers = 5", check: n => n === 5 },
            
            // K-1 - Size Comparison
            { name: "Small Numbers (1,2,3)", check: n => n <= 3 },
            { name: "Big Numbers (7,8,9)", check: n => n >= 7 },
            { name: "Numbers > 5", check: n => n > 5 },
            { name: "Numbers < 5", check: n => n < 5 },
            { name: "Middle Numbers (4,5,6)", check: n => n >= 4 && n <= 6 },
            
            // 1st Grade - Patterns & Counting
            { name: "Even Numbers (2,4,6,8)", check: n => n % 2 === 0 },
            { name: "Odd Numbers (1,3,5,7,9)", check: n => n % 2 === 1 },
            { name: "Count by 2s (2,4,6,8)", check: n => n % 2 === 0 },
            { name: "Count by 3s (3,6,9)", check: n => n % 3 === 0 },
            
            
            // Future use - more advanced concepts
            // { name: "Prime Numbers", check: n => this.isPrime(n) }
        ];
        this.currentChallenge = this.challenges[0];
        
        this.initializeGame();
        this.setupEventListeners();
    }

    isPrime(n) {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }

    initializeGame() {
        this.generateGrid();
        this.updateDisplay();
        this.renderGrid();
    }

    generateGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                if (x === this.playerPos.x && y === this.playerPos.y) {
                    this.grid[y][x] = { type: 'player', emoji: '🤖' };
                } else {
                    // Generate random number 1-9
                    const number = Math.floor(Math.random() * 9) + 1;
                    this.grid[y][x] = { 
                        type: 'number', 
                        value: number,
                        emoji: this.numberToEmoji(number),
                        isCorrect: this.currentChallenge.check(number)
                    };
                }
            }
        }
        
        // Add some monsters
        this.monsters = [];
        const monsterCount = Math.min(this.level, 3);
        for (let i = 0; i < monsterCount; i++) {
            this.addMonster();
        }
    }

    numberToEmoji(num) {
        const emojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        return emojis[num];
    }

    addMonster() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.gridWidth);
            y = Math.floor(Math.random() * this.gridHeight);
        } while ((x === this.playerPos.x && y === this.playerPos.y) || 
                 this.monsters.some(m => m.x === x && m.y === y));
        
        this.monsters.push({ x, y, emoji: '👾' });
        this.grid[y][x] = { type: 'monster', emoji: '👾' };
    }

    movePlayer(dx, dy) {
        if (!this.gameRunning) return;

        const newX = Math.max(0, Math.min(this.gridWidth - 1, this.playerPos.x + dx));
        const newY = Math.max(0, Math.min(this.gridHeight - 1, this.playerPos.y + dy));

        // Check for monster collision
        if (this.monsters.some(m => m.x === newX && m.y === newY)) {
            this.loseLife(true);
            return;
        }

        // Restore the old position to what was there before (or empty if nothing)
        if (this.grid[this.playerPos.y][this.playerPos.x].previousCell) {
            this.grid[this.playerPos.y][this.playerPos.x] = this.grid[this.playerPos.y][this.playerPos.x].previousCell;
        } else {
            this.grid[this.playerPos.y][this.playerPos.x] = { type: 'empty', emoji: '' };
        }
        
        // Store what's at the new position before moving player there
        const targetCell = this.grid[newY][newX];
        
        // Update position
        this.playerPos.x = newX;
        this.playerPos.y = newY;
        
        // Set new position with player, storing the previous content
        this.grid[this.playerPos.y][this.playerPos.x] = { 
            type: 'player', 
            emoji: '🤖',
            previousCell: targetCell.type === 'number' ? targetCell : null
        };
        
        this.renderGrid();
    }

    munchNumber() {
        if (!this.gameRunning) return;

        const cell = this.grid[this.playerPos.y][this.playerPos.x];
        // Check if there's a number stored underneath the player
        if (cell.previousCell && cell.previousCell.type === 'number') {
            if (cell.previousCell.isCorrect) {
                this.score += 10;
                // Clear the stored number so it's eaten
                this.grid[this.playerPos.y][this.playerPos.x].previousCell = null;
                // Trigger success animation
                this.triggerAnimation('munching');
            } else {
                // Trigger fail animation
                this.triggerAnimation('munch-fail');
                this.loseLife();
            }
            this.updateDisplay();
            this.checkWinCondition();
        }
    }

    triggerAnimation(animationClass, duration = 600) {
        // Find the player cell in the rendered grid
        const gridElement = document.getElementById('game-grid');
        const cellIndex = this.playerPos.y * this.gridWidth + this.playerPos.x;
        const playerCell = gridElement.children[cellIndex];
        
        if (playerCell) {
            // Add the animation class
            playerCell.classList.add(animationClass);
            
            // Remove the class after animation completes
            setTimeout(() => {
                playerCell.classList.remove(animationClass);
            }, duration);
        }
    }

    loseLife(isMonsterCollision = false) {
        // Trigger eaten animation if it's a monster collision
        if (isMonsterCollision) {
            this.triggerAnimation('eaten', 800);
        }
        this.lives--;
        this.updateDisplay();
        if (this.lives <= 0) {
            this.endGame(false);
        }
    }

    checkWinCondition() {
        let correctNumbers = 0;
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.grid[y][x];
                if (cell.type === 'number' && cell.isCorrect) {
                    correctNumbers++;
                }
                // Also check if there's a correct number stored under the player
                if (cell.type === 'player' && cell.previousCell && 
                    cell.previousCell.type === 'number' && cell.previousCell.isCorrect) {
                    correctNumbers++;
                }
            }
        }
        
        if (correctNumbers === 0) {
            this.nextLevel();
        }
    }

    nextLevel() {
        this.level++;
        this.timeLeft = 60;
        this.currentChallenge = this.challenges[Math.floor(Math.random() * this.challenges.length)];
        this.playerPos = { x: 0, y: 0 };
        this.generateGrid();
        this.updateDisplay();
        this.renderGrid();
    }

    moveMonsters() {
        if (!this.gameRunning) return;

        let collisionOccurred = false;

        this.monsters.forEach(monster => {
            // Skip if we already had a collision this turn
            if (collisionOccurred) return;

            // Clear old position
            if (this.grid[monster.y] && this.grid[monster.y][monster.x] && 
                this.grid[monster.y][monster.x].type === 'monster') {
                const number = Math.floor(Math.random() * 9) + 1;
                this.grid[monster.y][monster.x] = { 
                    type: 'number', 
                    value: number,
                    emoji: this.numberToEmoji(number),
                    isCorrect: this.currentChallenge.check(number)
                };
            }

            // Move towards player (but only move one step at a time)
            const dx = this.playerPos.x > monster.x ? 1 : this.playerPos.x < monster.x ? -1 : 0;
            const dy = this.playerPos.y > monster.y ? 1 : this.playerPos.y < monster.y ? -1 : 0;
            
            // Calculate new position
            let newX = monster.x;
            let newY = monster.y;
            
            // Only move in one direction at a time for clearer movement
            if (dx !== 0 && dy !== 0) {
                // Prefer horizontal movement
                if (Math.random() < 0.5) {
                    newX = Math.max(0, Math.min(this.gridWidth - 1, monster.x + dx));
                } else {
                    newY = Math.max(0, Math.min(this.gridHeight - 1, monster.y + dy));
                }
            } else {
                newX = Math.max(0, Math.min(this.gridWidth - 1, monster.x + dx));
                newY = Math.max(0, Math.min(this.gridHeight - 1, monster.y + dy));
            }
            
            // Check if another monster is already at the target position
            const otherMonsterAtTarget = this.monsters.some(m => 
                m !== monster && m.x === newX && m.y === newY
            );
            
            // Only move if no other monster is there
            if (!otherMonsterAtTarget) {
                monster.x = newX;
                monster.y = newY;
            }

            // Check collision with player
            if (monster.x === this.playerPos.x && monster.y === this.playerPos.y) {
                this.loseLife(true);
                collisionOccurred = true;
                return;
            }

            // Only set monster position if not colliding with player
            if (!(monster.x === this.playerPos.x && monster.y === this.playerPos.y)) {
                // Don't overwrite if player is there
                const targetCell = this.grid[monster.y][monster.x];
                if (targetCell.type !== 'player') {
                    this.grid[monster.y][monster.x] = { type: 'monster', emoji: '👾' };
                }
            }
        });

        this.renderGrid();
    }

    renderGrid() {
        const gridElement = document.getElementById('game-grid');
        gridElement.innerHTML = '';

        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = document.createElement('div');
                const gridCell = this.grid[y][x];
                
                // If it's a player cell with a number underneath, show both
                if (gridCell.type === 'player' && gridCell.previousCell) {
                    cell.className = `grid-cell player`;
                    // Show the number underneath with the player on top
                    cell.textContent = gridCell.emoji;
                    // You could also show both: cell.textContent = gridCell.previousCell.emoji + gridCell.emoji;
                } else {
                    cell.className = `grid-cell ${gridCell.type}`;
                    cell.textContent = gridCell.emoji || gridCell.value || '';
                }
                
                if (gridCell.className) {
                    cell.classList.add(gridCell.className);
                }
                
                gridElement.appendChild(cell);
            }
        }
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('timer').textContent = this.timeLeft;
        document.getElementById('challenge-text').textContent = `Munch ${this.currentChallenge.name}!`;
        
        const hearts = '❤️'.repeat(this.lives) + '🖤'.repeat(3 - this.lives);
        document.getElementById('lives').textContent = hearts;
    }

    startGame() {
        this.gameRunning = true;
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            if (this.timeLeft <= 0) {
                this.endGame(false);
            }
        }, 1000);

        this.monsterTimer = setInterval(() => {
            this.moveMonsters();
        }, 2000);
    }

    pauseGame() {
        this.gameRunning = !this.gameRunning;
        if (this.gameRunning) {
            this.startGame();
        } else {
            clearInterval(this.gameTimer);
            clearInterval(this.monsterTimer);
        }
    }

    endGame(won) {
        this.gameRunning = false;
        clearInterval(this.gameTimer);
        clearInterval(this.monsterTimer);
        
        const messageDiv = document.getElementById('game-message');
        if (won) {
            messageDiv.innerHTML = `
                <div class="game-over win">
                    <div>🎉 You Win! 🎉</div>
                    <button class="restart-btn" onclick="startNewGame()">🎮 New Game</button>
                </div>`;
        } else {
            messageDiv.innerHTML = `
                <div class="game-over">
                    <div>💀 Game Over! 💀</div>
                    <button class="restart-btn" onclick="startNewGame()">🎮 New Game</button>
                </div>`;
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.movePlayer(0, -1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.movePlayer(0, 1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.movePlayer(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.movePlayer(1, 0);
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.munchNumber();
                    break;
            }
        });
    }
}

// Global game instance and touch control variables
let game;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const minSwipeDistance = 30; // Minimum distance for a swipe

// Handle swipe gestures
function handleGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if the swipe distance is significant
    if (Math.max(absDeltaX, absDeltaY) < minSwipeDistance) {
        return;
    }

    if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
            game.movePlayer(1, 0); // Swipe right
        } else {
            game.movePlayer(-1, 0); // Swipe left
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            game.movePlayer(0, 1); // Swipe down
        } else {
            game.movePlayer(0, -1); // Swipe up
        }
    }
}

// Touch event listeners for swipe
document.addEventListener('touchstart', function(e) {
    // Don't interfere with button touches
    if (e.target.classList.contains('touch-btn') || 
        e.target.classList.contains('btn')) {
        return;
    }
    
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    // Don't interfere with button touches
    if (e.target.classList.contains('touch-btn') || 
        e.target.classList.contains('btn')) {
        return;
    }
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    if (game && game.gameRunning) {
        handleGesture();
    }
}, { passive: true });

// Double tap to munch
let lastTapTime = 0;
document.addEventListener('touchend', function(e) {
    if (e.target.classList.contains('grid-cell') || 
        e.target.closest('.game-grid')) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        if (tapLength < 300 && tapLength > 0) {
            // Double tap detected
            if (game && game.gameRunning) {
                game.munchNumber();
            }
            e.preventDefault();
        }
        lastTapTime = currentTime;
    }
});

// Virtual button controls
function setupTouchControls() {
    const touchButtons = document.querySelectorAll('.touch-btn');
    
    touchButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!game || !game.gameRunning) return;
            
            const action = this.dataset.action;
            switch(action) {
                case 'up':
                    game.movePlayer(0, -1);
                    break;
                case 'down':
                    game.movePlayer(0, 1);
                    break;
                case 'left':
                    game.movePlayer(-1, 0);
                    break;
                case 'right':
                    game.movePlayer(1, 0);
                    break;
                case 'space':
                    game.munchNumber();
                    break;
            }
        });

        // Prevent touch delay
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.classList.add('active');
        });

        btn.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.classList.remove('active');
            this.click();
        });
    });
}

function startNewGame() {
    document.getElementById('game-message').innerHTML = '';
    game = new NumberMunchers();
    game.startGame();
}

function pauseGame() {
    if (game) {
        game.pauseGame();
    }
}

// Settings Management
class Settings {
    constructor() {
        this.settings = this.loadSettings();
        this.setupEventListeners();
        this.applySettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('numberMunchersSettings');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            showDpad: true
        };
    }

    saveSettings() {
        localStorage.setItem('numberMunchersSettings', JSON.stringify(this.settings));
    }

    setupEventListeners() {
        const settingsBtn = document.getElementById('settings-btn');
        const modal = document.getElementById('settings-modal');
        const closeBtn = document.getElementById('close-settings');
        const dpadToggle = document.getElementById('dpad-toggle');

        // Open modal
        settingsBtn.addEventListener('click', () => {
            modal.classList.add('show');
            dpadToggle.checked = this.settings.showDpad;
        });

        // Close modal
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        // Handle D-pad toggle
        dpadToggle.addEventListener('change', (e) => {
            this.settings.showDpad = e.target.checked;
            this.saveSettings();
            this.applySettings();
        });
    }

    applySettings() {
        const mobileControls = document.getElementById('mobile-controls');
        const gameGrid = document.getElementById('game-grid');

        if (this.settings.showDpad) {
            mobileControls.classList.remove('hidden');
            gameGrid.classList.remove('expanded');
        } else {
            mobileControls.classList.add('hidden');
            gameGrid.classList.add('expanded');
        }
    }
}

let settings;

// Initialize game on page load
window.onload = () => {
    settings = new Settings();
    startNewGame();
    setupTouchControls();
    
    // Prevent zooming on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevent pull-to-refresh
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.closest('.game-grid') || e.target.closest('.mobile-controls')) {
            e.preventDefault();
        }
    }, { passive: false });
};