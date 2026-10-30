// --- LÓGICA DEL JUEGO (funciones sin DOM, para poder testearlas) ---

// Devuelve un número entero al azar entre min y max (los dos incluidos)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Comprueba si un nombre se puede añadir. Devuelve el mensaje de error o "" si está bien
function checkName(names, text, max) {
    const name = text.trim();

    if (!name) {
        return "¡ESCRIBE UN NOMBRE PRIMERO!";
    }
    if (names.length >= max) {
        return "¡ERROR! MÁXIMO " + max + " JUGADORES";
    }
    for (const savedName of names) {
        if (savedName.toLowerCase() === name.toLowerCase()) {
            return '¡"' + name + '" YA ESTÁ EN LA LISTA!';
        }
    }
    return "";
}

// Saca un nombre al azar de la lista. El nombre se quita para que no vuelva a salir
function drawName(pending) {
    const index = randomInt(0, pending.length - 1);
    const name = pending[index];
    pending.splice(index, 1);
    return name;
}

// La partida termina cuando no queda nadie por atrapar
function isGameFinished(pending, teams, names) {
    return pending.length === 0 && teams.length === names.length;
}

// Para poder usar las funciones en los tests con Jest
if (typeof module !== "undefined") {
    module.exports = { randomInt, checkName, drawName, isGameFinished };
}
