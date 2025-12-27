/**********************
 * TEMP PLACEHOLDER DATA
 * (Replace later with real JSON)
 **********************/

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

/**********************
 * DAILY CHARACTER LOGIC
 **********************/

function getMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getMonthlyOrder() {
  const key = getMonthKey();
  const stored = localStorage.getItem("monthlyOrder");

  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.month === key) return parsed.order;
  }

  const order = shuffle(characters.map(c => c.id));
  localStorage.setItem(
    "monthlyOrder",
    JSON.stringify({ month: key, order })
  );
  return order;
}

function getDailyCharacter() {
  const order = getMonthlyOrder();
  const dayIndex = new Date().getDate() - 1;
  const id = order[dayIndex % order.length];
  return characters.find(c => c.id === id);
}

const answer = getDailyCharacter();

/**********************
 * UI SETUP
 **********************/

const datalist = document.getElementById("characterList");
characters.forEach(c => {
  const option = document.createElement("option");
  option.value = c.name;
  datalist.appendChild(option);
});

document
  .getElementById("submitGuess")
  .addEventListener("click", submitGuess);

/**********************
 * COMPARISON HELPERS
 **********************/

function compareSimple(a, b) {
  return a === b ? "correct" : "wrong";
}

function compareUnknownCapable(a, b) {
  if (a === b) return "correct";
  if (a === "unknown" || b === "unknown") return "unknown";
  return "wrong";
}

/**********************
 * MAIN GUESS HANDLER
 **********************/

function submitGuess() {
  const input = document.getElementById("guessInput");
  const guessName = input.value.trim();
  input.value = "";

  const guess = characters.find(c => c.name === guessName);
  if (!guess) return;

  const row = document.createElement("div");
  row.className = "row";

  const cells = [
    guess.name,
    guess.species,
    guess.blood,
    guess.class ?? "—",
    guess.aspect ?? "—",
    guess.pesterhandle ?? "—",
    guess.universe,
    guess.godTierStatus,
    guess.aliveStatus,
    guess.introduced.entry
  ];

  const comparisons = [
    "correct",
    compareSimple(guess.species, answer.species),
    compareSimple(guess.blood, answer.blood),
    compareSimple(guess.class, answer.class),
    compareSimple(guess.aspect, answer.aspect),
    compareSimple(guess.pesterhandle, answer.pesterhandle),
    compareSimple(guess.universe, answer.universe),
    compareUnknownCapable(
      guess.godTierStatus,
      answer.godTierStatus
    ),
    compareUnknownCapable(
      guess.aliveStatus,
      answer.aliveStatus
    ),
    compareSimple(
      guess.introduced.series,
      answer.introduced.series
    )
  ];

  cells.forEach((text, i) => {
    const cell = document.createElement("div");
    cell.textContent = text;
    cell.classList.add(comparisons[i]);
    row.appendChild(cell);
  });

  document.getElementById("grid").appendChild(row);

  if (guess.id === answer.id) {
    document.getElementById("message").textContent =
      "You got it!";
  }
}
