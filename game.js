let characters = [];
let answer = null;

const input = document.getElementById("guessInput");
const datalist = document.getElementById("characterList");
const grid = document.getElementById("grid");

/* TEMPORARY TEST DATA */
const TEST_CHARACTERS = [
  {
    id: "john_egbert",
    name: "John Egbert",
    species: "human"
  },
  {
    id: "karkat_vantas",
    name: "Karkat Vantas",
    species: "troll"
  }
];

/* INIT */
init();

function init() {
  characters = TEST_CHARACTERS;

  populateDatalist();
  answer = characters[Math.floor(Math.random() * characters.length)];

  console.log("Daily answer:", answer.name); // DEBUG
}

/* AUTOCOMPLETE */
function populateDatalist() {
  datalist.innerHTML = "";
  characters.forEach(c => {
    const option = document.createElement("option");
    option.value = c.name;
    datalist.appendChild(option);
  });
}

/* INPUT HANDLING */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    submitGuess();
  }
});

function submitGuess() {
  const value = input.value.trim();
  if (!value) return;

  const character = characters.find(
    c => c.name.toLowerCase() === value.toLowerCase()
  );

  if (!character) {
    alert("Character not found.");
    return;
  }

  addRow(character);
  input.value = "";
}

/* GRID */
function addRow(character) {
  const row = document.createElement("div");
  row.className = "row";

  const nameCell = makeCell(character.name, "correct");
  const speciesCell = makeCell(character.species,
    character.species === answer.species ? "correct" : "wrong"
  );

  row.appendChild(nameCell);
  row.appendChild(speciesCell);

  grid.appendChild(row);
}

function makeCell(text, cls) {
  const div = document.createElement("div");
  div.className = `cell ${cls}`;
  div.textContent = text;
  return div;
}
