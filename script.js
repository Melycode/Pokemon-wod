// PARTE 1
const maxPlayers = 16;
const throwDuration = 1600;

let gameState = {
    names: [],
    pending: [],
    teams: [],
    usedIds: new Set(),
    lastCaughtName: "",
    phase: "ready"
};

let currentWildPokemon = null;
let currentWildLevel = 0;

const LOCAL_POKEMON_LIST = [
    { id: 1, name: "Bulbasaur", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662482/bulbasaur.gif" },
    { id: 2, name: "Charmander", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662496/charmander.gif" },
    { id: 3, name: "Squirtle", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662505/squirtle.gif" },
    { id: 4, name: "Pikachu", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662569/pikachu.gif" },
    { id: 5, name: "Jigglypuff", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662619/jigglypuff.gif" },
    { id: 6, name: "Machop", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662708/machop.gif" },
    { id: 7, name: "Gengar", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662806/gengar.gif" },
    { id: 8, name: "Eevee", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662936/eevee.gif" },
    { id: 9, name: "Articuno", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662972/articuno.gif" },
    { id: 10, name: "Zapdos", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662975/zapdos.gif" },
    { id: 11, name: "Moltres", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792662983/moltres.gif" },
    { id: 12, name: "Chikorita", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792663002/chikorita.gif" },
    { id: 13, name: "Cyndaquil", sprite: "https://res.cloudinary.com/dfhwxnhsl/image/upload/v1793128035/ezgif-resized_y04ohd.gif" },
    { id: 14, name: "Grovyle", sprite: "https://res.cloudinary.com/det6jfwzx/image/upload/v1792663371/grovyle.gif" },
    { id: 15, name: "Totodile", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/158.gif" },
    { id: 16, name: "Mewtwo", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/150.gif" }
];

const exampleNames = [
    "Julián", "Melisa", "Nacho", "Alfonso", "Jaime", "Luis", "Daniel", "Dani", 
    "Manuel", "Nerea", "Carlos", "Diego", "Alba", "Brandon", "Rafel", "Paloma"
];

const startBtn = document.getElementById('start-btn');
const progressBar = document.getElementById('progress-bar');
const startBg = document.getElementById('start-bg');
const playersBg = document.getElementById('players-bg');
const shadowOverlay = document.getElementById('shadow-overlay');
const cookieBanner = document.getElementById('cookie-banner');
const btnAccept = document.getElementById('btn-accept');
const btnDeny = document.getElementById('btn-deny');

const loadingAudio = document.getElementById('loading-audio');
const backgroundAudio = document.getElementById('background-audio');
const playersAudio = document.getElementById('players-audio');

const playersScreen = document.getElementById('players-screen');
const backBtn = document.getElementById('back-btn');
const nameForm = document.getElementById('nameForm');
const playerInput = document.getElementById('player-input');
const errorMessage = document.getElementById('error-message');
const playersCounter = document.getElementById('players-counter');
const segmentsBar = document.getElementById('segments-bar');
const namesGrid = document.getElementById('names-grid');
const fillExamplesBtn = document.getElementById('fill-examples-btn');
const startGameBtn = document.getElementById('start-game-btn');

const gameScreen = document.getElementById('game-screen');
const btnClose = document.getElementById('btnClose');
const caughtCount = document.getElementById('caughtCount');
const btnTeams = document.getElementById('btnTeams');
const wildName = document.getElementById('wildName');
const wildLevel = document.getElementById('wildLevel');
const slot = document.getElementById('slot');
const sprite = document.getElementById('sprite');
const dialogText = document.getElementById('dialogText');
const btnCatch = document.getElementById('btnCatch');
const catchLabel = document.getElementById('catchLabel');

const teamsDialog = document.getElementById('teamsDialog');
const teamsCounter = document.getElementById('teamsCounter');
const btnTeamsClose = document.getElementById('btnTeamsClose');
const teamList = document.getElementById('teamList');
const btnFinish = document.getElementById('btnFinish');

const finalScreen = document.getElementById('final-screen');
const finalGrid = document.getElementById('final-grid');
const playAgainBtn = document.getElementById('play-again-btn');
const copyResultsBtn = document.getElementById('copy-results-btn');

let audioContext = null;
let soundOn = true;

function getAudioContext() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
}

function playTone(frequency, delay, duration, endFrequency = frequency, waveType = "square", volume = 0.1) {
    const context = getAudioContext();
    const startTime = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    if (endFrequency !== frequency) {
        oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startTime + duration);
    }
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

const sounds = {
    add() { playTone(880, 0, 0.08, 1320); },
    remove() { playTone(440, 0, 0.1, 220); },
    error() { playTone(150, 0, 0.18, 110, "sawtooth", 0.08); },
    throwBall() {
        playTone(300, 0, 0.35, 1200, "triangle", 0.2);
        playTone(180, 0.4, 0.12, 80, "square", 0.15);
        [0.55, 1.15].forEach((time) => { playTone(660, time, 0.06); playTone(520, time + 0.08, 0.06); });
    },
    caught() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((note, i) => {
            playTone(note, i * 0.1, i === notes.length - 1 ? 0.4 : 0.1, note, "square", 0.12);
        });
    },
};

function playSound(name) {
    if (!soundOn) return;
    try { sounds[name](); } catch {}
}

function startBackgroundMusic() {
    backgroundAudio.volume = 0.3;
    backgroundAudio.play().catch(e => console.log("Autoplay bloqueado", e));
}

function manageCookies() {
    cookieBanner.classList.add('hidden');
    shadowOverlay.classList.add('hidden');
    updatePlayersUI();
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
    if (emptyInterval) { clearInterval(emptyInterval); emptyInterval = null; }
    
    loadingAudio.currentTime = audioStart; 
    loadingAudio.play();
    
    interval = setInterval(() => {
        progress += 1.2; 
        if (progress >= 100) {
            progress = 100; progressBar.style.width = progress + '%';
            stopPress(); actionCompleted();
        } else {
            progressBar.style.width = progress + '%';
        }
    }, 20);
}

function stopPress() {
    if (interval) { clearInterval(interval); interval = null; }
    if (progress < 100) { loadingAudio.pause(); }
    if (progress > 0 && progress < 100 && !emptyInterval) {
        emptyInterval = setInterval(() => {
            progress -= 5;
            if (progress <= 0) {
                progress = 0; clearInterval(emptyInterval); emptyInterval = null;
                loadingAudio.currentTime = audioStart;
            }
            progressBar.style.width = progress + '%';
        }, 15);
    }
}

function actionCompleted() {
    loadingAudio.pause(); loadingAudio.currentTime = audioStart;
    backgroundAudio.pause(); backgroundAudio.currentTime = 0;
    
    playersAudio.volume = 0.3;
    playersAudio.play().catch(e => console.log("Players audio bloqueado", e));

    startBtn.classList.add('hidden');
    startBg.classList.add('hidden');
    playersBg.classList.remove('hidden');
    
    playersScreen.classList.remove('hidden');
    progress = 0; progressBar.style.width = '0%';
}

startBtn.addEventListener('mousedown', startPress);
window.addEventListener('mouseup', stopPress);
startBtn.addEventListener('mouseleave', stopPress);
startBtn.addEventListener('touchstart', startPress, { passive: false });
window.addEventListener('touchend', stopPress);
startBtn.addEventListener('touchcancel', stopPress);

// PARTE 2
function initSegments() {
    segmentsBar.innerHTML = '';
    for (let i = 0; i < maxPlayers; i++) {
        const seg = document.createElement('div');
        seg.classList.add('segment');
        segmentsBar.appendChild(seg);
    }
}

function showError(text) {
    if (!text) { errorMessage.classList.add('hidden'); return; }
    errorMessage.textContent = text;
    errorMessage.classList.remove('hidden');
}

function updatePlayersUI(animateFrom = Infinity) {
    const total = gameState.names.length;
    const remaining = maxPlayers - total;
    
    playersCounter.textContent = `${total}/${maxPlayers}`;

    if (total > 0) {
        fillExamplesBtn.textContent = 'VACIAR LISTA';
    } else {
        fillExamplesBtn.textContent = 'RELLENAR CON EJEMPLOS';
    }

    const segments = segmentsBar.querySelectorAll('.segment');
    segments.forEach((seg, index) => {
        seg.classList.toggle('filled', index < total);
    });

    namesGrid.innerHTML = '';
    gameState.names.forEach((name, index) => {
        const pill = document.createElement('div');
        pill.classList.add('name-pill');
        if (index >= animateFrom) pill.classList.add('isNew');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-name-btn');
        removeBtn.textContent = '×';
        removeBtn.type = 'button';
        removeBtn.setAttribute('aria-label', `Eliminar ${name}`);
        removeBtn.addEventListener('click', () => removePlayer(index));

        pill.appendChild(nameSpan);
        pill.appendChild(removeBtn);
        namesGrid.appendChild(pill);
    });

    startGameBtn.disabled = remaining > 0;
    if (remaining === 0) {
        startGameBtn.textContent = `¡COMENZAR PARTIDA!`;
        startGameBtn.classList.add('ready');
        playerInput.disabled = true;
    } else {
        startGameBtn.textContent = `COMENZAR · FALTAN ${remaining}`;
        startGameBtn.classList.remove('ready');
        playerInput.disabled = false;
    }
}

function addPlayer(text) {
    const name = text.trim();
    if (!name) return "¡ESCRIBE UN NOMBRE PRIMERO!";
    if (gameState.names.length >= maxPlayers) return "¡ERROR! MÁXIMO 16 JUGADORES";
    if (gameState.names.some(n => n.toLowerCase() === name.toLowerCase())) return `¡"${name}" YA ESTÁ EN LA LISTA!`;

    gameState.names.push(name);
    return "";
}

function removePlayer(index) {
    gameState.names.splice(index, 1);
    playSound("remove");
    showError("");
    updatePlayersUI();
}

nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const beforeCount = gameState.names.length;
    const errorMsg = addPlayer(playerInput.value);
    
    showError(errorMsg);
    if (errorMsg) {
        playSound("error");
    } else {
        playerInput.value = '';
        playSound("add");
    }
    playerInput.focus();
    updatePlayersUI(beforeCount);
});

fillExamplesBtn.addEventListener('click', () => {
    if (gameState.names.length > 0) {
        gameState.names = [];
        playSound("remove");
        showError("");
        updatePlayersUI();
    } else {
        const beforeCount = gameState.names.length;
        for (const ex of exampleNames) {
            if (gameState.names.length >= maxPlayers) break;
            gameState.names.push(ex);
        }
        showError("");
        playSound("add");
        updatePlayersUI(beforeCount);
    }
});

backBtn.addEventListener('click', () => {
    showError("");
    closeTeams();
    playersAudio.pause(); playersAudio.currentTime = 0;
    backgroundAudio.play().catch(e => console.log("Bg audio bloqueado", e));
    
    playersScreen.classList.add('hidden');
    playersBg.classList.add('hidden');
    startBg.classList.remove('hidden');
    startBtn.classList.remove('hidden');
});

startGameBtn.addEventListener('click', () => {
    gameState.pending = [...gameState.names];
    gameState.teams = [];
    gameState.usedIds.clear();
    gameState.lastCaughtName = "";
    openGameScreen();
});

initSegments();


// PARTE 3
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function openGameScreen() {
    closeTeams();
    finalScreen.classList.add('hidden');
    playersScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    caughtCount.textContent = `${gameState.teams.length}/${maxPlayers}`;
    resetEncounter();
}

function resetEncounter() {
    if (gameState.pending.length === 0 && gameState.teams.length === maxPlayers) {
        showFinalScreen();
        return;
    }

    gameState.phase = "ready";
    
    let availablePokemon = LOCAL_POKEMON_LIST.filter(p => !gameState.usedIds.has(p.id));
    currentWildPokemon = availablePokemon[randomInt(0, availablePokemon.length - 1)];
    currentWildLevel = randomInt(5, 50);

    slot.classList.remove("isThrowing");
    slot.classList.add("isRevealed");
    
    sprite.src = currentWildPokemon.sprite;
    sprite.alt = currentWildPokemon.name;
    
    wildName.textContent = "???";
    wildLevel.textContent = `${currentWildPokemon.name} salvaje · Nvl. ${currentWildLevel}`;
    dialogText.innerHTML = `¡Un ${currentWildPokemon.name} salvaje apareció!<br>¿A quién pertenecerá?`;
    
    catchLabel.textContent = "ATRAPAR";
    btnCatch.disabled = gameState.pending.length === 0;
    btnCatch.classList.toggle('ready', gameState.pending.length > 0);
}

async function catchPokemon() {
    closeTeams();
    gameState.phase = "throwing";
    btnCatch.disabled = true;
    btnCatch.classList.remove('ready');
    btnTeams.disabled = true;

    const index = randomInt(0, gameState.pending.length - 1);
    const name = gameState.pending.splice(index, 1)[0];
    
    gameState.usedIds.add(currentWildPokemon.id);
    gameState.lastCaughtName = name;

    slot.classList.remove("isRevealed");
    void slot.offsetWidth; 
    slot.classList.add("isThrowing");
    playSound("throwBall");
    dialogText.textContent = "¡Adelante, Poké Ball…!";

    await wait(throwDuration);

    // ¡Atrapado! El Pokémon vuelve a salir y desvela al ganador
    slot.classList.remove("isThrowing");
    slot.classList.add("isRevealed");
    playSound("caught");

    wildName.textContent = name;
    dialogText.innerHTML = `¡Atrapado!<br>${currentWildPokemon.name} es para ${name}.`;

    gameState.teams.push({
        name: name,
        id: currentWildPokemon.id,
        pokemon: currentWildPokemon.name,
        sprite: currentWildPokemon.sprite,
        level: currentWildLevel
    });

    caughtCount.textContent = `${gameState.teams.length}/${maxPlayers}`;

    await wait(1800); 
    openTeams();

    gameState.phase = "ready";
    btnTeams.disabled = false;
}

btnCatch.addEventListener('click', () => {
    if (gameState.phase === "ready" && gameState.pending.length > 0) catchPokemon();
});

btnClose.addEventListener('click', () => {
    if (confirm("¿Volver a la selección de jugadores? Se reiniciará la captura actual.")) {
        closeTeams();
        gameState.pending = [];
        gameState.teams = [];
        gameState.usedIds.clear();
        gameState.lastCaughtName = "";
        
        updatePlayersUI();
        gameScreen.classList.add('hidden');
        playersScreen.classList.remove('hidden');
    }
});


// PARTE 4
function createTeamCard(name) {
    const team = gameState.teams.find((t) => t.name === name);

    let cardClass = "teamCard isPending";
    let status = "ESPERANDO";
    let image = '<span class="placeholder">?</span>';

    if (team) {
        image = `<img src="${team.sprite}" alt="${team.pokemon}">`;

        if (name === gameState.lastCaughtName) {
            cardClass = "teamCard isNew";
            status = "¡NUEVO!";
        } else {
            cardClass = "teamCard isCaught";
            status = "ATRAPADO";
        }
    }

    const li = document.createElement("li");
    li.className = cardClass;
    li.innerHTML = `
        <div class="cardImgSlot">${image}</div>
        <strong class="playerName"></strong>
        <span class="statusBadge">${status}</span>
    `;
    li.querySelector(".playerName").textContent = name;
    return li;
}

function openTeams() {
    teamList.innerHTML = "";
    teamsCounter.textContent = `${gameState.teams.length}/${maxPlayers}`;

    for (const name of gameState.names) {
        teamList.appendChild(createTeamCard(name));
    }

    const isFinished = gameState.pending.length === 0 && gameState.teams.length === maxPlayers;
    btnFinish.hidden = !isFinished;

    if (!teamsDialog.open) teamsDialog.show();
}

function closeTeams() {
    if (teamsDialog.open) teamsDialog.close();
}

teamsDialog.addEventListener("close", resetEncounter);

btnTeams.addEventListener("click", () => {
    if (teamsDialog.open) {
        closeTeams();
    } else if (gameState.phase !== "throwing") {
        openTeams();
    }
});

btnTeamsClose.addEventListener("click", closeTeams);

btnFinish.addEventListener("click", () => {
    closeTeams();
    showFinalScreen();
});

document.addEventListener("click", (event) => {
    if (!teamsDialog.open || gameState.phase === "throwing") return;
    const clickInside = teamsDialog.contains(event.target) || btnTeams.contains(event.target);
    if (!clickInside) closeTeams();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTeams();
});


// PARTE 5
function showFinalScreen() {
    closeTeams();
    gameScreen.classList.add('hidden');
    playersScreen.classList.add('hidden');
    finalScreen.classList.remove('hidden');

    finalGrid.innerHTML = '';

    gameState.names.forEach((name) => {
        const team = gameState.teams.find((t) => t.name === name);
        const card = document.createElement('div');
        card.classList.add('final-player-card');

        const slotEl = document.createElement('div');
        slotEl.classList.add('final-pokemon-slot');

        if (team) {
            const img = document.createElement('img');
            img.src = team.sprite;
            img.alt = team.pokemon;
            slotEl.appendChild(img);
        }

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('final-player-name');
        nameSpan.textContent = name;

        const statusSpan = document.createElement('span');
        statusSpan.classList.add('final-player-status');
        statusSpan.textContent = team ? `${team.pokemon} Nvl.${team.level}` : 'ATRAPADO';

        card.appendChild(slotEl);
        card.appendChild(nameSpan);
        card.appendChild(statusSpan);
        finalGrid.appendChild(card);
    });
}

copyResultsBtn.addEventListener('click', async () => {
    const results = gameState.names.map((name, index) => {
        const team = gameState.teams.find((t) => t.name === name);
        if (team) {
            return `${index + 1}. ${name} - ${team.pokemon} (Nvl. ${team.level})`;
        }
        return `${index + 1}. ${name} - ATRAPADO`;
    });

    const text = 'CAPTURA MISTERIOSA - RESULTADOS\n\n' + results.join('\n');

    try {
        if (!navigator.clipboard?.writeText) throw new Error('Portapapeles no disponible');
        await navigator.clipboard.writeText(text);
    } catch (error) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const copied = document.execCommand('copy');
        textArea.remove();
        if (!copied) {
            window.prompt('Copia los resultados:', text);
            return;
        }
    }

    copyResultsBtn.textContent = '¡COPIADO!';
    setTimeout(() => {
        copyResultsBtn.textContent = 'COPIAR RESULTADOS';
    }, 1800);
});

playAgainBtn.addEventListener('click', () => {
    gameState.pending = [];
    gameState.teams = [];
    gameState.usedIds.clear();
    gameState.lastCaughtName = "";

    finalScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    playersScreen.classList.remove('hidden');
    updatePlayersUI();
});