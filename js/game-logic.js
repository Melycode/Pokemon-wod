function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function drawName(pending) {
    const index = randomInt(0, pending.length - 1);
    const name = pending[index];
    pending.splice(index, 1);
    return name;
}

function isGameFinished(pending, teams, names) {
    return pending.length === 0 && teams.length === names.length;
}

if (typeof module !== "undefined") {
    module.exports = { randomInt, checkName, drawName, isGameFinished };
}
