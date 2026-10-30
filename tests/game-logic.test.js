const { randomInt, checkName, drawName, isGameFinished } = require("../js/game-logic.js");

describe("randomInt", () => {
    test("devuelve un número dentro del rango", () => {
        for (let i = 0; i < 100; i++) {
            const number = randomInt(1, 6);
            expect(number).toBeGreaterThanOrEqual(1);
            expect(number).toBeLessThanOrEqual(6);
        }
    });
});

describe("checkName", () => {
    test("acepta un nombre nuevo", () => {
        expect(checkName(["Ana"], "Luis", 16)).toBe("");
    });

    test("no acepta un nombre vacío", () => {
        expect(checkName([], "   ", 16)).toBe("¡ESCRIBE UN NOMBRE PRIMERO!");
    });

    test("no acepta un nombre repetido aunque cambien las mayúsculas", () => {
        expect(checkName(["Ana"], "ana", 16)).toBe('¡"ana" YA ESTÁ EN LA LISTA!');
    });

    test("no acepta más nombres que el máximo", () => {
        expect(checkName(["Ana", "Luis"], "Marta", 2)).toBe("¡ERROR! MÁXIMO 2 JUGADORES");
    });
});

describe("drawName", () => {
    test("saca un nombre de la lista y lo quita", () => {
        const pending = ["Ana", "Luis", "Marta"];
        const name = drawName(pending);

        expect(["Ana", "Luis", "Marta"]).toContain(name);
        expect(pending).not.toContain(name);
        expect(pending.length).toBe(2);
    });

    test("cada nombre sale una sola vez", () => {
        const names = ["Ana", "Luis", "Marta", "Pedro"];
        const pending = [...names];
        const drawn = [];

        while (pending.length > 0) {
            drawn.push(drawName(pending));
        }

        expect(drawn.length).toBe(names.length);
        expect(new Set(drawn).size).toBe(names.length);
    });
});

describe("isGameFinished", () => {
    test("la partida no termina si queda gente", () => {
        expect(isGameFinished(["Luis"], [{ name: "Ana" }], ["Ana", "Luis"])).toBe(false);
    });

    test("la partida termina cuando todos tienen Pokémon", () => {
        expect(isGameFinished([], [{ name: "Ana" }, { name: "Luis" }], ["Ana", "Luis"])).toBe(true);
    });
});
