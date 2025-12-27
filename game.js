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
    universe: "A1",
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
    universe: "B2",
    godTierStatus: "Yes",
    aliveStatus: "Alive",
    introduced: "Homestuck Intermission"
  }
];

const universeOrder = [
  "B1",
  "B2",
  "A1",
  "A2"
];

function compareUniverse(guess, answer) {
  if (guess === answer) {
    return { class: "correct", text: guess };
  }

  const gIndex = universeOrder.indexOf(guess);
  const aIndex = universeOrder.indexOf(answer);

  if (gIndex === -1 || aIndex === -1) {
    return { class: "wrong", text: guess };
  }

  if (gIndex < aIndex) {
    return { class: "partial", text: `${guess} ↑` };
  }

  if (gIndex > aIndex) {
    return { class: "partial", text: `${guess} ↓` };
  }

  return { class: "wrong", text: guess };
}


const bloodOrder = [
  "Burgundy",
  "Bronze",
  "Gold",
  "Lime",
  "Olive",
  "Jade",
  "Teal",
  "Cerulean",
  "Indigo",
  "Purple",
  "Violet",
  "Fuchsia"
];

const noPartialBloods = [
  "Red",           // humans, carapacians, karkat, caliborn
  "Bright Lime"    // Calliope
];

function compareBlood(guess, answer) {
  if (guess === answer) {
    return { class: "correct", text: guess };
  }

  if (
    noPartialBloods.includes(guess) ||
    noPartialBloods.includes(answer)
  ) {
    return { class: "wrong", text: guess };
  }

  const gIndex = bloodOrder.indexOf(guess);
  const aIndex = bloodOrder.indexOf(answer);

  if (gIndex === -1 || aIndex === -1) {
    return { class: "wrong", text: guess };
  }

  if (gIndex < aIndex) {
    return { class: "partial", text: `${guess} ↑` };
  }

  if (gIndex > aIndex) {
    return { class: "partial", text: `${guess} ↓` };
  }

  return { class: "wrong", text: guess };
}

const homestuckActs = [
  "Homestuck Act 1",
  "Homestuck Act 2",
  "Homestuck Act 3",
  "Homestuck Intermission",
  "Homestuck Act 4",
  "Homestuck Act 5",
  "Homestuck Act 6",
];

const hiveswapActs = [
  "Hiveswap Act 1",
  "Hiveswap Friendsim",
  "Hiveswap Act 2",
  "Hiveswap Act 3"
];

function compareIntroduced(guess, answer) {
  if (guess === answer) {
    return { class: "correct", text: guess };
  }

  const guessIsHS = homestuckActs.includes(guess);
  const answerIsHS = homestuckActs.includes(answer);

  const guessIsHW = hiveswapActs.includes(guess);
  const answerIsHW = hiveswapActs.includes(answer);

  // Do NOT allow partials across Homestuck ↔ Hiveswap
  if (guessIsHS !== answerIsHS || guessIsHW !== answerIsHW) {
    return { class: "wrong", text: guess };
  }

  const list = guessIsHS ? homestuckActs : hiveswapActs;

  const gIndex = list.indexOf(guess);
  const aIndex = list.indexOf(answer);

  if (gIndex < aIndex) {
    return { class: "partial", text: `${guess} ↑` };
  }

  if (gIndex > aIndex) {
    return { class: "partial", text: `${guess} ↓` };
  }

  return { class: "wrong", text: guess };
}




// ----------------------------
// GAME STATE
// ----------------------------

let answer = characters[Math.floor(Math.random() * characters.length)];
let guesses = [];

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
  "cell " + (guess.id === answer.id ? "correct" : "wrong");
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
let result;

switch (trait) {
  case "blood":
    result = compareBlood(guess.blood, answer.blood);
    break;

  case "universe":
    result = compareUniverse(guess.universe, answer.universe);
    break;

  case "introduced":
    result = compareIntroduced(guess.introduced, answer.introduced);
    break;

  default:
    result =
      guess[trait] === answer[trait]
        ? { class: "correct", text: guess[trait] }
        : { class: "wrong", text: guess[trait] };
}

cell.textContent = result.text;
cell.className = "cell " + result.class;


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
