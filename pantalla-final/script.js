const finalGrid = document.getElementById('final-grid');

const playAgainBtn = document.getElementById('play-again-btn');

const copyResultsBtn = document.getElementById('copy-results-btn');


const examplePlayers = [
    'Ana',
    'Bruno',
    'Carla',
    'Dani',
    'Elena',
    'Fran',
    'Gena',
    'Hugo',
    'Irene',
    'Jon',
    'Kiko',
    'Lola',
    'Marta',
    'Nico',
    'Olga',
    'Pablo'
];

let finalPlayers = [...examplePlayers];

function renderFinalScreen(players = finalPlayers) {

    finalPlayers = players.slice(0, 16);

    finalGrid.innerHTML = '';

    for (let i = 0; i < 16; i++) {

        const name = finalPlayers[i] || '';

        const card = document.createElement('div');
        card.classList.add('final-player-card');

        const pokemonSlot = document.createElement('div');
        pokemonSlot.classList.add('final-pokemon-slot');

        const playerName = document.createElement('span');
        playerName.classList.add('final-player-name');
        playerName.textContent = name;

        const playerStatus = document.createElement('span');
        playerStatus.classList.add('final-player-status');

        playerStatus.textContent = name ? 'ATRAPADO' : '';

        card.appendChild(pokemonSlot);
        card.appendChild(playerName);
        card.appendChild(playerStatus);

        finalGrid.appendChild(card);
    }
}

copyResultsBtn.addEventListener('click', async () => {

    const results = finalPlayers.map((name, index) => {
        return `${index + 1}. ${name} - ATRAPADO`;
    });

    const text = 'CAPTURA MISTERIOSA - RESULTADOS\n\n'
        + results.join('\n');

    try {

        if (!navigator.clipboard?.writeText) {
            throw new Error('Portapapeles no disponible');
        }

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
    alert(
        'El botón JUGAR OTRA VEZ se conectará ' +
        'con la pantalla inicial del juego.'
    );

});
renderFinalScreen();
