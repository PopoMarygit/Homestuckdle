// TEMP TEST DATA
const characters = [
  { name: "John Egbert", species: "human" },
  { name: "Karkat Vantas", species: "troll" },
  { name: "Rose Lalonde", species: "human" }
];

// Pick a fixed answer for now
const answer = characters[1]; // Karkat

const input = document.getElementById("guessInput");
const button = document.getElementById("guessButton");
const grid = document.getElementById("grid");
const datalist = document.getElementById("characterList");

// Populate datalist
characters.forEach(c => {
  const option = document.createElement("option");
  option.value = c.name;
  datalist.appendChild(option);
});

// Only show datalist when typing
input.addEventListener("input", () => {
  input.setAttribute("list", input.value.length ? "characterList" : "");
});

// Guess handling
function makeGuess() {
  const value = input.value.trim();
  if (!value) return;

  const guess = characters.find(
    c => c.name.toLowerCase() === value.toLowerCase()
  );

  if (!guess) {
    alert("Character not found");
    return;
  }

  const row = document.createElement("div");
  row.className = "row";

  const nameCell = document.createElement("div");
  nameCell.textContent = guess.name;
  nameCell.className = "correct";

  const speciesCell = document.createElement("div");
  speciesCell.textContent = guess.species;
  speciesCell.className =
    guess.species === answer.species ? "correct" : "wrong";

  row.appendChild(nameCell);
  row.appendChild(speciesCell);
  grid.appendChild(row);

  input.value = "";
  input.removeAttribute("list");
}

button.addEventListener("click", makeGuess);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") makeGuess();
});
