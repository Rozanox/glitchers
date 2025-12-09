// Glitchers database
const glitchers = [
    { name: "Hirtz", valorant: "Yes", lol: "No", country: "Khalafawy", spy: "No", trash: "No" },
    { name: "Marwan", valorant: "Yes", lol: "Yes", country: "Zawya", spy: "No", trash: "Yes" },
    { name: "Mo3az", valorant: "Yes", lol: "Yes", country: "Cairo", spy: "No", trash: "No" },
    { name: "Mohab", valorant: "Yes", lol: "No", country: "Khalafawy", spy: "No", trash: "Yes" },
    { name: "Final", valorant: "Yes", lol: "No", country: "Giza", spy: "No", trash: "No" },
    { name: "Ashry", valorant: "Yes", lol: "Yes", country: "Ain shams", spy: "No", trash: "Yes" },
    { name: "Devxon", valorant: "Yes", lol: "Yes", country: "October", spy: "No", trash: "Yes" },
    { name: "Sasuke", valorant: "Yes", lol: "Yes", country: "Gaza", spy: "Yes", trash: "Yes" },
    { name: "Tarik", valorant: "Yes", lol: "Yes", country: "Bet La7m", spy: "Yes", trash: "No" },
    { name: "Soly", valorant: "Yes", lol: "No", country: "Bany sweef", spy: "No", trash: "No" },
    { name: "Salah", valorant: "Yes", lol: "No", country: "Bany sweef", spy: "No", trash: "No" },
    { name: "B7r", valorant: "Yes", lol: "No", country: "Khalafawy", spy: "No", trash: "Yes" },
    { name: "Sherif", valorant: "Yes", lol: "No", country: "Khalafawy", spy: "No", trash: "No" },
    { name: "Oreo", valorant: "Yes", lol: "Yes", country: "Tagamo3", spy: "No", trash: "Yes" },
    { name: "Doom", valorant: "Yes", lol: "Yes", country: "Zawya", spy: "No", trash: "Yes" }
];

// Game state
let dailyGlitcher;
let guesses = [];
let maxAttempts = 8;
let gameOver = false;

// Get daily Glitcher (same for everyone on the same day)
function getDailyGlitcher() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % glitchers.length;
    return glitchers[7];
}

// Initialize game
function init() {
    dailyGlitcher = getDailyGlitcher();
    console.log("Today's Glitcher:", dailyGlitcher.name); // For testing - remove in production
    
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');
    
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keydown', handleKeydown);
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.classList.remove('show');
        }
    });
}

// Handle search input
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const suggestions = document.getElementById('suggestions');
    
    if (query.length === 0) {
        suggestions.classList.remove('show');
        return;
    }
    
    const filtered = glitchers.filter(g => 
        g.name.toLowerCase().includes(query) && 
        !guesses.some(guess => guess.name === g.name)
    );
    
    if (filtered.length > 0) {
        suggestions.innerHTML = filtered.map(g => 
            `<div class="suggestion-item" data-name="${g.name}">${g.name}</div>`
        ).join('');
        
        suggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => selectGlitcher(item.dataset.name));
        });
        
        suggestions.classList.add('show');
    } else {
        suggestions.classList.remove('show');
    }
}

// Handle keyboard navigation
function handleKeydown(e) {
    const suggestions = document.getElementById('suggestions');
    const items = suggestions.querySelectorAll('.suggestion-item');
    
    if (e.key === 'Enter' && items.length > 0) {
        selectGlitcher(items[0].dataset.name);
    }
}

// Select a Glitcher
function selectGlitcher(name) {
    if (gameOver) return;
    
    const selected = glitchers.find(g => g.name === name);
    if (!selected) return;
    
    guesses.push(selected);
    updateAttempts();
    renderGuess(selected);
    
    document.getElementById('searchInput').value = '';
    document.getElementById('suggestions').classList.remove('show');
    
    checkWin(selected);
    
    if (!gameOver && guesses.length >= maxAttempts) {
        endGame(false);
    }
}

// Update attempts counter
function updateAttempts() {
    document.getElementById('attemptCount').textContent = guesses.length;
}

// Render a guess
function renderGuess(guess) {
    const container = document.getElementById('guessesContainer');
    const row = document.createElement('div');
    row.className = 'guess-row';
    
    // Name
    const nameCell = document.createElement('div');
    nameCell.className = `guess-cell ${guess.name === dailyGlitcher.name ? 'correct' : 'incorrect'}`;
    nameCell.textContent = guess.name;
    row.appendChild(nameCell);
    
    // Valorant
    const valorantCell = document.createElement('div');
    valorantCell.className = `guess-cell ${guess.valorant === dailyGlitcher.valorant ? 'correct' : 'incorrect'}`;
    valorantCell.textContent = guess.valorant;
    row.appendChild(valorantCell);
    
    // LoL
    const lolCell = document.createElement('div');
    lolCell.className = `guess-cell ${guess.lol === dailyGlitcher.lol ? 'correct' : 'incorrect'}`;
    lolCell.textContent = guess.lol;
    row.appendChild(lolCell);
    
    // Country
    const countryCell = document.createElement('div');
    countryCell.className = `guess-cell ${guess.country === dailyGlitcher.country ? 'correct' : 'incorrect'}`;
    countryCell.textContent = guess.country;
    row.appendChild(countryCell);
    
    // Spy
    const spyCell = document.createElement('div');
    spyCell.className = `guess-cell ${guess.spy === dailyGlitcher.spy ? 'correct' : 'incorrect'}`;
    spyCell.textContent = guess.spy;
    row.appendChild(spyCell);
    
    // Trash
    const trashCell = document.createElement('div');
    trashCell.className = `guess-cell ${guess.trash === dailyGlitcher.trash ? 'correct' : 'incorrect'}`;
    trashCell.textContent = guess.trash;
    row.appendChild(trashCell);
    
    container.appendChild(row);
}

// Check if won
function checkWin(guess) {
    if (guess.name === dailyGlitcher.name) {
        endGame(true);
    }
}

// End game
function endGame(won) {
    gameOver = true;
    document.getElementById('searchInput').disabled = true;
    
    const result = document.getElementById('result');
    
    if (won) {
        result.innerHTML = `
            <div class="victory">
                <h2>🎉 Congratulations!</h2>
                <p>You guessed the Glitcher in ${guesses.length} attempt${guesses.length > 1 ? 's' : ''}!</p>
                <p style="font-size: 1.5em; margin-top: 15px;">It was <strong>${dailyGlitcher.name}</strong>!</p>
                <button class="reset-btn" onclick="location.reload()">Play Again Tomorrow</button>
            </div>
        `;
    } else {
        result.innerHTML = `
            <div class="defeat">
                <h2>💔 Game Over!</h2>
                <p>You've used all ${maxAttempts} attempts.</p>
                <p>The Glitcher was <strong>${dailyGlitcher.name}</strong>!</p>
                <button class="reset-btn" onclick="location.reload()">Try Again Tomorrow</button>
            </div>
        `;
    }
}

// Start game when page loads
init();