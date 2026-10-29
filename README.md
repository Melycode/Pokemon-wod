# Captura Misteriosa

**Wheel of Doom with Pokémon.** A fair and random way to hand out 16 Pokémon to 16 players, in pixel art.

## Contents

- [Briefing](#briefing)
- [The project](#the-project)
- [How to play](#how-to-play)
- [Mockups](#mockups)
- [Technologies and tools](#technologies-and-tools)
- [Methodology](#methodology)
- [Project structure](#project-structure)
- [How to run it](#how-to-run-it)
- [Team](#team)

## Briefing

The association **Sacrificios SA**, organizer of events such as *The Purge*, *The Maze Runner*, *The Hunger Games* and *Squid Game*, has asked us for a web application for its new developer sacrifice event. The application must be **a fair and random system** that draws names from a list.

Main requirements of the brief:

- Receive a list of names and be able to **add or remove** names.
- Pick a name at random and **show a notice** with the chosen one.
- A chosen name **does not come up again** until the application is restarted.
- Show a notice when the **last name** comes up.
- Have a **start screen**, a **restart button**, **animations**, **transitions** and **sound effects**.
- Be **mobile first** and **responsive** for at least two breakpoints.
- The design must be creative and fun: **it can't be the typical wheel**. The theme is free.

## The project

Our theme is **Pokémon**. Instead of a wheel, each turn a **wild Pokémon** appears and, when the Poké Ball is thrown, the game randomly decides **which player it belongs to**. A player who has been picked doesn't come up again, and neither does a Pokémon. At the end, all 16 players have their Pokémon.

The draw is fair because on every throw all the remaining players have the same chance of being picked.

## How to play

1. **Start screen.** The cookie notice appears. Then press and hold **START** until the bar fills up.
2. **Who's playing?** Type 16 names or press **RELLENAR CON EJEMPLOS** (fill with examples). Names can't be repeated and each one can be removed with the **×**. With 16 names, **¡COMENZAR PARTIDA!** (start game) is enabled.
3. **Catch.** A wild Pokémon appears. Press **ATRAPAR** (catch): the Poké Ball is thrown and the player who gets it is revealed.
4. **Teams.** After each catch the teams sheet opens, showing the players who already have a Pokémon and the ones still waiting. It also opens with the **EQUIPOS** (teams) button.
5. **Results.** Once all 16 Pokémon are handed out, **VER RESULTADOS FINALES** (see final results) appears. From there you can **COPIAR RESULTADOS** (copy results) or **JUGAR OTRA VEZ** (play again).

The **×** on the game screen goes back to the player list and restarts the catch.

## Mockups

We designed the interface in **Figma** following **Atomic Design**: first the small pieces and then the full screens. Before designing the screens we made the application's flowchart.

Figma file: [Captura misteriosa](https://www.figma.com/design/oa9YKxtbhnVnhd6Jt2w5qy/Captura-misteriosa)

### Flowchart

![Flowchart](docs/maquetas/diagrama-flujo.png)

### Pages

The five game screens on mobile: start, names, game, teams and final.

![Pages](docs/maquetas/5-paginas.png)

### Atoms

Colors, fonts, buttons, icons and other basic pieces.

![Atoms](docs/maquetas/1-atomos.png)

### Molecules

Combinations of atoms, such as the field for adding names or the player tags.

![Molecules](docs/maquetas/2-moleculas.png)

### Organisms

Complete blocks, such as the names card, the Pokémon encounter or the teams sheet.

![Organisms](docs/maquetas/3-organismos.png)

### Templates

The structure of each screen, before adding the real content.

![Templates](docs/maquetas/4-plantillas.png)

## Technologies and tools

**Technologies**

- HTML
- CSS (mobile first design and media queries)
- JavaScript (DOM, events and functions)

**Tools**

- Figma, for the design and the prototype
- Visual Studio Code
- Trello, for the Kanban board
- Git and GitHub

**External resources**

- *Press Start 2P* and *VT323* fonts from Google Fonts
- Sprites and background images hosted on Cloudinary and [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
- Sound effects made with the Web Audio API and MP3 music

There is no backend: everything runs in the browser.

## Methodology

We worked with agile methodologies:

- **Scrum**, with two two-week sprints, a daily every day and a retrospective at the end of each sprint.
- **Kanban** in Trello, with user stories and tasks.
- **Git** with one branch per task. Each of us opens a pull request to `dev`, the branch where the team's work comes together.

### Scrum roles

| Role | Person |
|---|---|
| Product Owner | Melissa |
| Scrum Master | Alfonso |
| Development team | Melissa, Alfonso, Julián and Nacho |

### Kanban board

The Trello board has the user stories, the *To do*, *Doing* and *Done* columns, and labels by technology and by difficulty: **Pokéball** (1-2 h), **Superball** (3-4 h) and **Ultraball** (5-8 h).

![Trello board](docs/maquetas/trello.jpg)

### User stories

- As a user, I want a Pokémon-themed start screen with an interactive button (pseudo-classes and transition) to start the event.
- As an organizer, I want to see, add and remove names in the DOM to manage the participants of the draw.
- As an organizer, I want to throw the Pokéball and pick a dev at random, removing them from the list so nobody is sacrificed twice.
- As a spectator, I want to see the Pokéball animation through events and a notice with the caught name to make it exciting.
- As a user, I want to hear sounds when I press buttons, throw the Pokéball and catch, to make it more immersive.
- As an organizer, I want a restart button, and when the last one is caught I want a notice and to go back to the start to begin the cycle again.

## Project structure

```
Pokemon-wod/
├── index.html        # All the game screens
├── styles.css        # Styles and responsive design
├── script.js         # Game logic
├── sonido-start.mp3  # Sound while holding START
├── tema-fondo.mp3    # Start screen music
├── bg-ost.mp3        # Music during the game
└── docs/
    └── maquetas/     # Figma and Trello images for this README
```

The code is split into five parts, one per screen, marked with comments (`<!-- PARTE N -->` in the HTML and `// PARTE N` in the JS):

| Part | Screen | What it does |
|---|---|---|
| 1 | Start | Press-and-hold START button, cookie notice and music |
| 2 | Players | Form for 16 names with validation and a progress bar |
| 3 | Game | Wild Pokémon, Poké Ball throw and player draw |
| 4 | Teams | Sheet with the 4x4 grid of players and their Pokémon |
| 5 | Final | Results, copy to clipboard and play again |

## How to run it

```bash
git clone https://github.com/Melycode/Pokemon-wod.git
cd Pokemon-wod
git checkout dev
```

Open `index.html` in the browser or use the *Live Server* extension for Visual Studio Code. An internet connection is needed to load the images and fonts.

## Team

| Name | GitHub | Part |
|---|---|---|
| Melissa | [Melycode](https://github.com/Melycode) | Players and game screens |
| Alfonso | [deterry69](https://github.com/deterry69) | Start screen, cookies and music |
| Julián | [JulianChavezdev](https://github.com/JulianChavezdev) | Teams sheet and final details |
| Nacho | | Final screen |

---

Educational, non-profit project. Pokémon and its sprites belong to Nintendo, Game Freak and The Pokémon Company.
