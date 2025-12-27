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
  const input = document.getElementById("guessInput");
  const list = document.getElementById("characterList");

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    list.innerHTML = "";

    if (!value) return;

    characters
      .filter(c => c.name.toLowerCase().startsWith(value))
      .forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.name;
        list.appendChild(opt);
      });
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
  const guessGrid = document.getElementById("guessGrid");

  // CREATE ROW
  const row = document.createElement("div");
  row.classList.add("grid");

  // NAME
  const nameCell = document.createElement("div");
  nameCell.textContent = guess.name;
  nameCell.className =
    guess.id === answer.id ? "correct" : "wrong";
  row.appendChild(nameCell);

  // TRAITS
  const traits = [
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

  traits.forEach(trait => {
    const cell = document.createElement("div");
    cell.textContent = guess[trait] ?? "—";
    cell.className =
      guess[trait] === answer[trait] ? "correct" : "wrong";
    row.appendChild(cell);
  });

  // APPEND ROW TO GRID
  guessGrid.appendChild(row);
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
