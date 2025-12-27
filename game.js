// TEMP TEST DATA — replace later with real JSON loading
const characters = [
  {
    id: "john_egbert",
    name: "John Egbert",
    species: "human",
    blood: "red",
    class: "Heir",
    aspect: "Breath",
    universe: "b1",
    godTierStatus: "god",
    aliveStatus: "alive"
  },
  {
    id: "karkat_vantas",
    name: "Karkat Vantas",
    species: "troll",
    blood: "mutant_red",
    class: "Knight",
    aspect: "Blood",
    universe: "b1",
    godTierStatus: "god",
    aliveStatus: "dead"
  }
];

// Pick first character for testing
const answer = characters[0];
const grid = document.getElementById("grid");
const input = document.getElementById("guessInput");
const button = document.getElementById("guessButton");
const datalist = document.getElementById("characterList");

// Populate datalist
characters.forEach(c => {
  const opt = document.createElement("option");
  opt.value = c.name;
  datalist.appendChild(opt);
});

// Hide datalist until typing
input.addEventListener("input", () => {
  input.setAttribute("list", input.value.length ? "characterList" : "");
});

// Guess handler
function submitGuess() {
  const value = input.value.trim();
  if (!value) return;

  const guess = characters.find(
    c => c.name.toLowerCase() === value.toLowerCase()
  );

  if (!guess) {
    alert("Character not found.");
    return;
  }

  addRow(guess);
  input.value = "";
}

// Button + Enter key
button.addEventListener("click", submitGuess);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") submitGuess();
});

// Create grid row
function addRow(guess) {
  const row = document.createElement("div");
  row.className = "grid-row";

  addCell(row, guess.name, guess.name === answer.name);
  addCell(row, guess.species, guess.species === answer.species);
  addCell(row, guess.blood, guess.blood === answer.blood);
  addCell(row, guess.class, guess.class === answer.class);
  addCell(row, guess.aspect, guess.aspect === answer.aspect);
  addCell(row, guess.universe, guess.universe === answer.universe);
  addCell(row, guess.godTierStatus, guess.godTierStatus === answer.godTierStatus);
  addCell(row, guess.aliveStatus, guess.aliveStatus === answer.aliveStatus);

  grid.appendChild(row);
}

function addCell(row, text, correct) {
  const cell = document.createElement("div");
  cell.className = "grid-cell " + (correct ? "correct" : "wrong");
  cell.textContent = text ?? "—";
  row.appendChild(cell);
}
