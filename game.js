// 🔹 TEMP DATA (replace later)
const characters = [
  {
    id: "john_egbert",
    name: "John Egbert",
    species: "human",
    blood: "red",
    class: "Heir",
    aspect: "Breath",
    universe: "b1",
    alive: "alive"
  },
  {
    id: "karkat_vantas",
    name: "Karkat Vantas",
    species: "troll",
    blood: "mutant_red",
    class: "Knight",
    aspect: "Blood",
    universe: "b1",
    alive: "dead"
  }
];

// Pick answer
const answer = characters[0];

const input = document.getElementById("guessInput");
const button = document.getElementById("guessButton");
const grid = document.getElementById("grid");
const autocomplete = document.getElementById("autocomplete");

// 🔍 Autocomplete
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();
  autocomplete.innerHTML = "";

  if (!value) {
    autocomplete.style.display = "none";
    return;
  }

  const matches = characters.filter(c =>
    c.name.toLowerCase().includes(value)
  );

  matches.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c.name;
    li.onclick = () => {
      input.value = c.name;
      autocomplete.style.display = "none";
    };
    autocomplete.appendChild(li);
  });

  autocomplete.style.display = matches.length ? "block" : "none";
});

// 🎯 Guess submission
button.addEventListener("click", submitGuess);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") submitGuess();
});

function submitGuess() {
  const name = input.value.trim();
  const guess = characters.find(c => c.name === name);
  if (!guess) return;

  renderRow(guess);
  input.value = "";
  autocomplete.style.display = "none";
}

// 🧱 Render a row
function renderRow(guess) {
  const row = document.createElement("div");
  row.className = "row";

  addCell(row, guess.name, guess.name === answer.name);
  addCell(row, guess.species, guess.species === answer.species);
  addCell(row, guess.blood, guess.blood === answer.blood);
  addCell(row, guess.class, guess.class === answer.class);
  addCell(row, guess.aspect, guess.aspect === answer.aspect);
  addCell(row, guess.universe, guess.universe === answer.universe);
  addCell(row, guess.alive, guess.alive === answer.alive);

  grid.appendChild(row);
}

function addCell(row, text, correct) {
  const cell = document.createElement("div");
  cell.textContent = text ?? "—";
  cell.className = correct ? "correct" : "wrong";
  row.appendChild(cell);
}
