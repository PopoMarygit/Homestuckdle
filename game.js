// ----------------------------
// PLACEHOLDER CHARACTER DATA
// ----------------------------

function getStoredDailyAnswer() {
  return JSON.parse(localStorage.getItem("dailyAnswer") || "null");
}

function setStoredDailyAnswer(id) {
  localStorage.setItem(
    "dailyAnswer",
    JSON.stringify({
      date: getESTDateString(),
      id
    })
  );
}


let characters = [];
let answer = null;
let guesses = [];

function showWinScreen() {
  document.getElementById("input-area").style.display = "none";

  const win = document.getElementById("win");
  win.style.display = "block";

  startCountdown();
}


async function loadCharacters() {
  const res = await fetch("characters.json");
  characters = await res.json();
}

function getESTDateString(date = new Date()) {
  const est = new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  return est.toISOString().slice(0, 10); // YYYY-MM-DD
}

const NO_REPEAT_DAYS = 30;

function getRecentAnswers() {
  return JSON.parse(localStorage.getItem("recentAnswers") || "[]");
}

function saveAnswer(id) {
  const today = getESTDateString();
  let recent = getRecentAnswers();

  recent.push({ id, date: today });

  recent = recent.filter(
    r => (new Date(today) - new Date(r.date)) / 86400000 < NO_REPEAT_DAYS
  );

  localStorage.setItem("recentAnswers", JSON.stringify(recent));
}

function pickDailyAnswer() {
  const today = getESTDateString();
  const recentIds = getRecentAnswers().map(r => r.id);

  let pool = characters.filter(c => !recentIds.includes(c.id));

  // 🔒 SAFETY: if pool is empty, reset history
  if (pool.length === 0) {
    localStorage.removeItem("recentAnswers");
    pool = [...characters];
  }

  const seed = today.split("-").reduce((a, b) => a + Number(b), 0);
  const index = seed % pool.length;

  return pool[index];
}

function getYesterdaysCharacter() {
  const recent = getRecentAnswers();
  return recent.length
    ? characters.find(c => c.id === recent.at(-1).id)
    : null;
}


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


function startCountdown() {
  const timer = document.getElementById("countdown");

  setInterval(() => {
    const now = new Date();
    const estNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    const next = new Date(estNow);
    next.setHours(24, 0, 0, 0);

    const diff = next - estNow;

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    timer.textContent = `${h}h ${m}m ${s}s`;
  }, 1000);
}


// ----------------------------
// GAME STATE
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
  document
    .getElementById("guessButton")
    .addEventListener("click", submitGuess);

  document
    .getElementById("guessInput")
    .addEventListener("keydown", e => {
      if (e.key === "Enter") submitGuess();
    });
}


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
async function initGame() {
  await loadCharacters();

  const today = getESTDateString();
  const stored = getStoredDailyAnswer();

  if (stored && stored.date === today) {
    // Reuse today's answer
    answer = characters.find(c => c.id === stored.id);
  } else {
    // Pick a new one for today
    answer = pickDailyAnswer();
    setStoredDailyAnswer(answer.id);
    saveAnswer(answer.id);
  }
  
if (!answer) {
  console.error("No daily answer could be selected.");
  return;
}

  
  setupDatalist();
  setupInputHandlers();
}




// ----------------------------
// SETUP FUNCTIONS
// ----------------------------


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

  if (guessed.id === answer.id) {
  showWinScreen();
}

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

initGame();
