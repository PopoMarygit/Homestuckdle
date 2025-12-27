// ----------------------------
// PLACEHOLDER CHARACTER DATA
// ----------------------------

const characters = [
  {
    id: 1,
    name: "John Egbert",
    species: "Human",
    blood: "Red",
    class: "Heir",
    aspect: "Breath",
    pesterhandle: "ectoBiologist",
    universe: "B1",
    godTierStatus: "Yes",
    aliveStatus: "Alive",
    introduced: "Homestuck Act 1"
  },
  {
    id: 2,
    name: "Karkat Vantas",
    species: "Troll",
    blood: "Red",
    class: "Knight",
    aspect: "Blood",
    pesterhandle: "carcinoGeneticist",
    universe: "B1",
    godTierStatus: "Yes",
    aliveStatus: "Alive",
    introduced: "Homestuck Act 2"
  }
];

// ----------------------------
// GAME STATE
// ----------------------------

let answer = characters[Math.floor(Math.random() * characters.length)];
let guesses = [];

const TRAITS = [
  "species",
  "blood",
  "class",
  "aspect",
  "pesterhandle",
  "universe",
  "godTierStatus",
  "aliveStatus",
  "introduced"
];

// ----------------------------
// INIT
// ----------------------------

setupDatalist();
setupInputHandlers();

// ----------------------------
// SETUP FUNCTIONS
// ----------------------------

function setupDatalist() {
  const list = document.getElementById("characterList");
  list.innerHTML = "";

  characters.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    list.appendChild(opt);
  });
}

function setupInputHandlers() {
  document.getElementById("guessButton").addEventListener("click", submitGuess);

  document.getElementById("guessInput").addEventListener("keydown", e => {
    if (e.key === "Enter") submitGuess();
  });
}

// ----------------------------
// GUESSING
// ----------------------------

function submitGuess() {
  const input = document.getElementById("guessInput");
  const name = input.value.trim();

  if (!name) return;

  const guessed = characters.find(
    c => c.name.toLowerCase() === name.toLowerCase()
  );

  if (!guessed) {
    alert("Character not found.");
    return;
  }

  if (guesses.some(g => g.id === guessed.id)) {
    alert("Already guessed.");
    return;
  }

  guesses.push(guessed);
  renderGuessRow(guessed);
  input.value = "";
}

// ----------------------------
// RENDERING
// ----------------------------

function renderGuessRow(guess) {
  const grid = document.getElementById("guessGrid");

  const row = document.createElement("div");
  row.className = "grid";

  // NAME CELL
  row.appendChild(
    makeCell(
      guess.name,
      guess.id === answer.id ? "correct" : "wrong"
    )
  );

  // TRAIT CELLS
  TRAITS.forEach(trait => {
    const cls =
      guess[trait] === answer[trait] ? "correct" : "wrong";

    row.appendChild(makeCell(guess[trait], cls));
  });

  grid.appendChild(row);
}

// ----------------------------
// HELPERS
// ----------------------------

function makeCell(text, cls) {
  const cell = document.createElement("div");
  cell.className = cls;
  cell.textContent = text ?? "—";
  return cell;
}
