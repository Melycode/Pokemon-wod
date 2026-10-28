const startBtn = document.getElementById('start-btn');
const progressBar = document.getElementById('progress-bar');
const loadingAudio = document.getElementById('loading-audio');

const startBg = document.getElementById('start-bg');
const playersBg = document.getElementById('players-bg');

const shadowOverlay = document.getElementById('shadow-overlay');
const cookieBanner = document.getElementById('cookie-banner');
const btnAccept = document.getElementById('btn-accept');
const btnDeny = document.getElementById('btn-deny');
const backgroundAudio = document.getElementById('background-audio');
const playersAudio = document.getElementById('players-audio');

const playersScreen = document.getElementById('players-screen');
const backBtn = document.getElementById('back-btn');
const playerInput = document.getElementById('player-input');
const addPlayerBtn = document.getElementById('add-player-btn');
const errorMessage = document.getElementById('error-message');
const playersCounter = document.getElementById('players-counter');
const segmentsBar = document.getElementById('segments-bar');
const namesGrid = document.getElementById('names-grid');
const fillExamplesBtn = document.getElementById('fill-examples-btn');
const startGameBtn = document.getElementById('start-game-btn');

const maxPlayers = 16;
let players = [];
const exampleNames = [
    "Julián", "Melisa", "Nacho", "Alfonso", 
    "Jaime", "Luis", "Daniel", "Dani", 
    "Manuel", "Nerea", "Carlos", "Diego", 
    "Alba", "Brandon", "Rafael", "Paloma"
];

function startBackgroundMusic() {
    backgroundAudio.volume = 0.3;
    backgroundAudio.play().catch(e => console.log("Autoplay blocked until interaction", e));
}

function manageCookies() {
    cookieBanner.style.display = 'none';
    shadowOverlay.style.display = 'none';
    startBackgroundMusic();
}

btnAccept.addEventListener('click', manageCookies);
btnDeny.addEventListener('click', manageCookies);

let interval = null;
let emptyInterval = null;
let progress = 0;
const audioStart = 1.5; 

function startPress(e) {
    if (e.cancelable) e.preventDefault();
    if (interval) return; 

    if (emptyInterval) {
        clearInterval(emptyInterval);
        emptyInterval = null;
    }
    
    loadingAudio.currentTime = audioStart; 
    loadingAudio.play();
    
    interval = setInterval(() => {
        progress += 1.2; 
        if (progress >= 100) {
            progress = 100;
            progressBar.style.width = progress + '%';
            stopPress();
            actionCompleted();
        } else {
            progressBar.style.width = progress + '%';
        }
    }, 20);
}

function stopPress() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }

    if (progress < 100) {
        loadingAudio.pause();
    }

    if (progress > 0 && progress < 100 && !emptyInterval) {
        emptyInterval = setInterval(() => {
            progress -= 5;
            if (progress <= 0) {
                progress = 0;
                clearInterval(emptyInterval);
                emptyInterval = null;
                loadingAudio.currentTime = audioStart;
            }
            progressBar.style.width = progress + '%';
        }, 15);
    }
}

function actionCompleted() {
    loadingAudio.pause();
    loadingAudio.currentTime = audioStart;
    
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    
    playersAudio.volume = 0.3;
    playersAudio.play().catch(e => console.log("Players audio autoplay blocked", e));

    startBtn.classList.add('hidden');
    startBg.classList.add('hidden');
    playersBg.classList.remove('hidden');
    playersScreen.classList.remove('hidden');
    progress = 0;
    progressBar.style.width = '0%';
}

startBtn.addEventListener('mousedown', startPress);
window.addEventListener('mouseup', stopPress);
startBtn.addEventListener('mouseleave', stopPress);

startBtn.addEventListener('touchstart', startPress, { passive: false });
window.addEventListener('touchend', stopPress);
startBtn.addEventListener('touchcancel', stopPress);

function initSegments() {
    segmentsBar.innerHTML = '';
    for (let i = 0; i < maxPlayers; i++) {
        const seg = document.createElement('div');
        seg.classList.add('segment');
        segmentsBar.appendChild(seg);
    }
}

function showError(text) {
    errorMessage.textContent = text;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function updatePlayersUI() {
    playersCounter.textContent = `${players.length}/${maxPlayers}`;

    const segments = segmentsBar.querySelectorAll('.segment');
    segments.forEach((seg, index) => {
        if (index < players.length) {
            seg.classList.add('filled');
        } else {
            seg.classList.remove('filled');
        }
    });

    namesGrid.innerHTML = '';
    players.forEach((name, index) => {
        const pill = document.createElement('div');
        pill.classList.add('name-pill');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-name-btn');
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => removePlayer(index));

        pill.appendChild(nameSpan);
        pill.appendChild(removeBtn);
        namesGrid.appendChild(pill);
    });

    const remaining = maxPlayers - players.length;
    if (players.length === 0) {
        startGameBtn.textContent = `COMENZAR · FALTAN 16`;
        startGameBtn.classList.remove('ready');
    } else if (players.length < maxPlayers) {
        startGameBtn.textContent = `COMENZAR · FALTAN ${remaining}`;
        startGameBtn.classList.add('ready');
    } else {
        startGameBtn.textContent = `¡COMENZAR PARTIDA!`;
        startGameBtn.classList.add('ready');
    }
}

function addPlayer() {
    const name = playerInput.value.trim();

    if (players.length >= maxPlayers) {
        showError('¡ERROR! NO PUEDES AÑADIR MÁS DE 16 JUGADORES');
        return;
    }

    if (name === '') {
        showError('¡ESCRIBE UN NOMBRE PRIMERO!');
        return;
    }

    hideError();
    players.push(name);
    playerInput.value = '';
    playerInput.focus();
    updatePlayersUI();
}

function removePlayer(index) {
    players.splice(index, 1);
    hideError();
    updatePlayersUI();
}

addPlayerBtn.addEventListener('click', addPlayer);

playerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addPlayer();
    }
});

fillExamplesBtn.addEventListener('click', () => {
    hideError();
    players = [...exampleNames];
    updatePlayersUI();
});

backBtn.addEventListener('click', () => {
    hideError();
    
    playersAudio.pause();
    playersAudio.currentTime = 0;
    
    backgroundAudio.play().catch(e => console.log("Background audio play blocked", e));

    playersScreen.classList.add('hidden');
    playersBg.classList.add('hidden');
    startBg.classList.remove('hidden');
    startBtn.classList.remove('hidden');
});

startGameBtn.addEventListener('click', () => {
    if (players.length === 0) {
        showError('¡AÑADE AL MENOS 1 JUGADOR PARA EMPEZAR!');
        return;
    }
    hideError();
    alert(`¡Comenzando con ${players.length} jugadores, kbsa!`);
});

initSegments();
updatePlayersUI();