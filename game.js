const characters = [
  {
    id: "john_egbert",
    name: "John Egbert",
    species: "human",
    blood: "red",
    class: "Heir",
    aspect: "Breath",
    pesterhandle: "ectoBiologist",
    universe: "b1",
    godTierStatus: "god",
    aliveStatus: "alive",
    introduced: { series: "homestuck", entry: "Act 1" }
  },
  {
    id: "karkat_vantas",
    name: "Karkat Vantas",
    species: "troll",
    blood: "mutant_red",
    class: "Knight",
    aspect: "Blood",
    pesterhandle: "carcinoGeneticist",
    universe: "b1",
    godTierStatus: "god",
    aliveStatus: "dead",
    introduced: { series: "homestuck", entry: "Act 5 Act 2" }
  }
];

const input = document.getElementById("guessInput");
const datalist = document.getElementById("characterList");
const button = document.getElementById("guessButton");
const grid = document.getElementById("grid");

// Pick daily answer (TEMP: fixed for testing)
const answer = characters[1]; // Karkat

input.addEventListener("input", () => {
  datalist.innerHTML = "";

  if (input.value.length === 0) return;

  characters.forEach(c => {
    if (c.name.toLowerCase().includes(input.value.toLowerCase())) {
      const option = document.createElement("option");
      option.value = c.name;
      datalist.appendChild(option);
    }
  });
});

button.addEventListener("click", submitGuess);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") submitGuess();
});

const input = document.getElementById("guessInput");
const datalist = document.getElementById("characterList");
const button = document.getElementById("guessButton");
const grid = document.getElementById("grid");

// Pick daily answer (TEMP: fixed for testing)
const answer = characters[1]; // Karkat

input.addEventListener("input", () => {
  datalist.innerHTML = "";

  if (input.value.length === 0) return;

  characters.forEach(c => {
    if (c.name.toLowerCase().includes(input.value.toLowerCase())) {
      const option = document.createElement("option");
      option.value = c.name;
      datalist.appendChild(option);
    }
  });
});

button.addEventListener("click", submitGuess);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") submitGuess();
});

function submitGuess() {
  const name = input.value.trim().toLowerCase();
  if (!name) return;

  const guess = characters.find(
    c => c.name.toLowerCase() === name
  );

  if (!guess) {
    alert("Character not found");
    return;
  }

  renderGuess(guess);
  input.value = "";
}

const TRAITS = [
  "name",
  "species",
  "blood",
  "class",
  "aspect",
  "pesterhandle",
  "universe",
  "godTierStatus",
  "aliveStatus"
];

function renderGuess(guess) {
  const row = document.createElement("div");
  row.className = "row";

  TRAITS.forEach(trait => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = guess[trait] ?? "—";

    if (guess[trait] === answer[trait]) {
      cell.classList.add("correct");
    } else {
      cell.classList.add("wrong");
    }

    row.appendChild(cell);
  });

  grid.appendChild(row);
}
