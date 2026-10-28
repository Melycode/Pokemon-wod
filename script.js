const maxNames = 16;
const throwDuration = 1600;  
const STORAGE_KEY = "mystery_catch_game_data";


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

const examples = [
  "Alba", "Brandon", "Carlos", "Danny C", "Danny P", "Julián", "Luis", "Jaime",
  "Manuel", "Melissa", "Terry", "Diego", "Nacho", "Nerea", "Rafa", "Paloma",
];


const state = {
  names: [],         
  pending: [],      
  teams: [],         
  lastCaughtName: "", 
  usedIds: new Set(), 
  phase: "ready",     
};


const $ = (id) => document.getElementById(id);

const namesScreen = $("screenNames");
const gameScreen = $("screenGame");

const form = $("nameForm");
const input = $("nameInput");
const errorText = $("nameError");
const nameCount = $("nameCount");
const progress = $("progress");
const chips = $("chips");
const fillButton = $("btnFill");
const startButton = $("btnStart");

const caughtCount = $("caughtCount");
const wildName = $("wildName");
const wildLevel = $("wildLevel");
const slot = $("slot");
const sprite = $("sprite");
const dialogText = $("dialogText");
const catchButton = $("btnCatch");
const catchLabel = $("catchLabel");

const teamsButton = $("btnTeams");
const teamsDialog = $("teamsDialog");
const teamList = $("teamList");
const teamsCounter = $("teamsCounter");
const restartButton = $("btnRestart");


const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));



function saveState() {
  const dataToSave = {
    names: state.names,
    pending: state.pending,
    teams: state.teams,
    usedIds: Array.from(state.usedIds)
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

function loadState() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) return false;

  try {
    const parsed = JSON.parse(savedData);
    state.names = parsed.names || [];
    state.pending = parsed.pending || [];
    state.teams = parsed.teams || [];
    state.usedIds = new Set(parsed.usedIds || []);
    return true;
  } catch (err) {
    console.error("Error al cargar localStorage:", err);
    return false;
  }
}

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}



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
    [0.55, 1.15].forEach((time) => {
      playTone(660, time, 0.06);
      playTone(520, time + 0.08, 0.06);
    });
  },
  caught() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((note, i) => {
      const isLast = i === notes.length - 1;
      playTone(note, i * 0.1, isLast ? 0.4 : 0.1, note, "square", 0.12);
    });
  },
};

function playSound(name) {
  if (!soundOn) return;
  try { sounds[name](); } catch {}
}

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("isActive"));
  screen.classList.add("isActive");
}



function addName(text) {
  const name = text.trim();

  if (!name) return "Escribe un nombre antes de añadirlo.";
  if (state.names.length >= maxNames) return "Ya hay 16 nombres.";
  const isDuplicate = state.names.some((n) => n.toLowerCase() === name.toLowerCase());
  if (isDuplicate) return `"${name}" ya está en la lista.`;

  state.names.push(name);
  saveState();
  return "";
}

function removeName(index) {
  state.names.splice(index, 1);
  saveState();
  playSound("remove");
  renderNames();
}

function renderNames(animateFrom = Infinity) {
  const total = state.names.length;
  const remaining = maxNames - total;

  if (nameCount) nameCount.textContent = `${total}/${maxNames}`;

  if (progress) {
    progress.innerHTML = "";
    for (let i = 0; i < maxNames; i++) {
      const segment = document.createElement("span");
      if (i < total) segment.classList.add("isFilled");
      progress.appendChild(segment);
    }
  }

  if (chips) {
    chips.innerHTML = "";
    state.names.forEach((name, i) => {
      const li = document.createElement("li");
      li.className = i >= animateFrom ? "chip isNew" : "chip";

      const label = document.createElement("span");
      label.textContent = name;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "×";
      removeButton.setAttribute("aria-label", `Eliminar ${name}`);
      removeButton.addEventListener("click", () => removeName(i));

      li.append(label, removeButton);
      chips.appendChild(li);
    });
  }

  if (startButton) {
    startButton.disabled = remaining > 0;
    startButton.textContent = remaining > 0 ? `Comenzar · ${remaining} faltan` : "Comenzar";
  }
  if (fillButton) fillButton.disabled = remaining === 0;
  if (input) input.disabled = remaining === 0;
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const before = state.names.length;
    errorText.textContent = addName(input.value);
    if (errorText.textContent) {
      playSound("error");
    } else {
      input.value = "";
      playSound("add");
    }
    input.focus();
    renderNames(before);
  });
}

if (fillButton) {
  fillButton.addEventListener("click", () => {
    const before = state.names.length;
    for (const example of examples) {
      if (state.names.length >= maxNames) break;
      addName(example);
    }
    if (errorText) errorText.textContent = "";
    playSound("add");
    renderNames(before);
  });
}

if (startButton) startButton.addEventListener("click", startGame);
$("btnBack")?.addEventListener("click", () => history.back());



function startGame() {
  state.pending = [...state.names];
  state.teams = [];
  state.usedIds.clear();
  state.lastCaughtName = "";
  saveState();

  if (caughtCount) caughtCount.textContent = `0/${maxNames}`;
  resetEncounter();
  showScreen(gameScreen);
}

function resetEncounter() {
  state.phase = "ready";
  slot.classList.remove("isThrowing", "isRevealed");
  sprite.removeAttribute("src");
  wildName.textContent = "???";
  wildLevel.textContent = "salvaje · Nvl. ??";
  dialogText.innerHTML = "¡Un Pokémon salvaje apareció!<br>¿A quién pertenecerá?";
  if (catchLabel) catchLabel.textContent = "ATRAPAR";
  catchButton.disabled = false;
}

async function catchPokemon() {
  state.phase = "throwing";
  catchButton.disabled = true;
  if (teamsButton) teamsButton.disabled = true;


  const index = randomInt(0, state.pending.length - 1);
  const name = state.pending.splice(index, 1)[0];


  let availablePokemon = LOCAL_POKEMON_LIST.filter(p => !state.usedIds.has(p.id));
  const selectedPokemon = availablePokemon[randomInt(0, availablePokemon.length - 1)];
  state.usedIds.add(selectedPokemon.id);

  const level = randomInt(5, 50);
  state.lastCaughtName = name;


  slot.classList.remove("isRevealed");
  void slot.offsetWidth; 
  slot.classList.add("isThrowing");
  playSound("throwBall");
  dialogText.textContent = "¡Adelante, Poké Ball…!";


  sprite.src = selectedPokemon.sprite;

  await wait(throwDuration);


  slot.classList.remove("isThrowing");
  slot.classList.add("isRevealed");
  playSound("caught");

  sprite.alt = selectedPokemon.name;
  wildName.textContent = name;
  wildLevel.textContent = `salvaje · Nvl. ${level}`;

  state.teams.push({
    name: name,
    id: selectedPokemon.id,
    pokemon: selectedPokemon.name,
    sprite: selectedPokemon.sprite,
    level: level
  });
  saveState();

  if (caughtCount) caughtCount.textContent = `${state.teams.length}/${maxNames}`;

 
  await wait(1800); 
  openTeams();

  state.phase = "ready";
  if (teamsButton) teamsButton.disabled = false;
}

catchButton?.addEventListener("click", () => {
  if (state.phase === "ready" && state.pending.length > 0) catchPokemon();
});

$("btnClose")?.addEventListener("click", () => {
  if (confirm("¿Salir del juego? Se perderá el avance actual.")) {
    clearState();
    showScreen(namesScreen);
  }
});


function openTeams() {
  if (!teamList) return;
  teamList.innerHTML = "";
  if (teamsCounter) teamsCounter.textContent = `${state.teams.length}/${maxNames}`;

  state.names.forEach((name) => {
    const team = state.teams.find((t) => t.name === name);
    const li = document.createElement("li");

    const isNewlyCaught = team && name === state.lastCaughtName;
    li.className = isNewlyCaught ? "teamCard isNew" : team ? "teamCard isCaught" : "teamCard isPending";

    const imgContainer = document.createElement("div");
    imgContainer.className = "cardImgSlot";

    const placeholder = document.createElement("span");
    placeholder.className = "placeholder";
    placeholder.textContent = "?";

    if (team) {
      const img = document.createElement("img");
      img.onerror = () => img.replaceWith(placeholder);
      img.src = team.sprite;
      img.alt = team.pokemon;
      imgContainer.appendChild(img);
    } else {
      imgContainer.appendChild(placeholder);
    }

    const playerName = document.createElement("strong");
    playerName.className = "playerName";
    playerName.textContent = name;

    const statusBadge = document.createElement("span");
    statusBadge.className = "statusBadge";

    if (isNewlyCaught) {
      statusBadge.textContent = "¡NUEVO!";
    } else if (team) {
      statusBadge.textContent = "ATRAPADO";
    } else {
      statusBadge.textContent = "ESPERANDO";
    }

    li.append(imgContainer, playerName, statusBadge);
    teamList.appendChild(li);
  });

  const isCompleted = state.pending.length === 0;
  if (restartButton) restartButton.hidden = !isCompleted;

  // show() y no showModal(): la hoja vive dentro de .app y deja visible la barra superior
  if (teamsDialog && !teamsDialog.open) teamsDialog.show();
}

function closeTeams() {
  if (teamsDialog?.open) teamsDialog.close();
}

teamsDialog?.addEventListener("close", resetEncounter);

teamsButton?.addEventListener("click", () => {
  if (teamsDialog?.open) closeTeams();
  else if (state.phase !== "throwing") openTeams();
});
$("btnTeamsClose")?.addEventListener("click", closeTeams);

// Tocar fuera de la hoja o pulsar Escape la cierra
document.addEventListener("click", (event) => {
  if (!teamsDialog?.open || state.phase === "throwing") return;
  if (teamsDialog.contains(event.target) || teamsButton?.contains(event.target)) return;
  closeTeams();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeTeams();
});

restartButton?.addEventListener("click", () => {
  closeTeams();
  clearState();
  showScreen(namesScreen);
});


closeTeams();

loadState();
renderNames();
showScreen(namesScreen);