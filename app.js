// State
let participants = [];
let pairings = {}; // { "Giver": "Receiver" }

// DOM Elements
const nameInput = document.getElementById('nameInput');
const nameList = document.getElementById('nameList');
const setupPhase = document.getElementById('setup-phase');
const gamePhase = document.getElementById('game-phase');
const statusText = document.getElementById('status-text');
const cardsContainer = document.getElementById('cardsContainer');
const resultModal = document.getElementById('resultModal');
const winnerNameDisplay = document.getElementById('winnerName');
const giftAnim = document.getElementById('giftAnim');
const loadingText = document.getElementById('loadingText');
const resultContent = document.getElementById('resultContent');
const modalBtn = document.querySelector('.modal-btn');

// --- SETUP FUNCTIONS ---
function handleEnter(e) {
    if (e.key === 'Enter') addName();
}

function addName() {
    const name = nameInput.value.trim();
    if (!name) return;
    
    if (participants.includes(name)) {
        alert('ชื่อนี้มีอยู่แล้ว!');
        return;
    }

    participants.push(name);
    renderList();
    nameInput.value = '';
    nameInput.focus();
}

function removeName(index) {
    participants.splice(index, 1);
    renderList();
}

function renderList() {
    nameList.innerHTML = '';
    participants.forEach((name, index) => {
        const li = document.createElement('li');
        li.className = 'name-item';
        li.innerHTML = `
            <span>${index + 1}. ${name}</span>
            <button class="delete-btn" onclick="removeName(${index})">×</button>
        `;
        nameList.appendChild(li);
    });
}

// --- GAME LOGIC ---
function startGame() {
    if (participants.length < 2) {
        alert('ต้องมีอย่างน้อย 2 คนนะ ถึงจะจับสลากได้!');
        return;
    }

    // Generate Logic (Derangement Shuffle)
    let isValid = false;
    let receivers = [];

    while (!isValid) {
        receivers = [...participants];
        // Shuffle receivers
        for (let i = receivers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
        }

        // Check self-match
        isValid = true;
        for (let i = 0; i < participants.length; i++) {
            if (participants[i] === receivers[i]) {
                isValid = false;
                break;
            }
        }
    }

    // Map pairings
    pairings = {};
    participants.forEach((giver, index) => {
        pairings[giver] = receivers[index];
    });

    // UI Transition
    setupPhase.style.display = 'none';
    gamePhase.style.display = 'block';
    statusText.textContent = "เลือกชื่อของคุณเพื่อดูว่าได้ของใคร";
    renderCards();
}

function renderCards() {
    cardsContainer.innerHTML = '';
    participants.forEach(name => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.onclick = () => openCard(card, name);
        card.innerHTML = `
            <span class="card-icon">🎅</span>
            <div class="card-name">${name}</div>
        `;
        cardsContainer.appendChild(card);
    });
}

function openCard(cardElement, giverName) {
    if (cardElement.classList.contains('disabled')) return;

    // Show Modal with Animation
    resultModal.classList.add('active');
    giftAnim.classList.add('shake');
    loadingText.style.display = 'block';
    resultContent.style.display = 'none';
    modalBtn.style.display = 'none';

    // Fake delay for suspense
    setTimeout(() => {
        giftAnim.classList.remove('shake');
        loadingText.style.display = 'none';
        
        // Show Result
        winnerNameDisplay.textContent = pairings[giverName];
        resultContent.style.display = 'block';
        resultContent.style.animation = 'slideIn 0.5s';
        modalBtn.style.display = 'inline-block';
        
        // Create Confetti
        createConfetti();

        // Mark card as done
        cardElement.classList.add('disabled');
        cardElement.innerHTML = `
            <span class="card-icon">🎁</span>
            <div class="card-name done">${giverName}</div>
        `;

    }, 1500);
}

function closeModal() {
    resultModal.classList.remove('active');
    // Remove confetti
    document.querySelectorAll('.confetti').forEach(e => e.remove());
}

function resetGame() {
    const resetModal = document.getElementById('resetModal');
    if (resetModal) resetModal.classList.add('active');
}

function closeResetModal() {
    const resetModal = document.getElementById('resetModal');
    if (resetModal) resetModal.classList.remove('active');
}

function doReset() {
    participants = [];
    pairings = {};
    renderList();
    setupPhase.style.display = 'block';
    gamePhase.style.display = 'none';
    statusText.textContent = "เพิ่มชื่อเพื่อนๆ เพื่อเริ่มจับสลาก";
    closeResetModal();
}

// --- VISUAL FX ---
function createConfetti() {
    const colors = ['#D42426', '#165B33', '#F8B229', '#FFFFFF'];
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animationDuration = (Math.random() * 2 + 1) + 's';
        document.body.appendChild(conf);
    }
}
