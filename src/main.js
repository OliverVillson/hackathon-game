import { createGameEngine, GAME_STATUS } from "./game/gameEngine.js";
import { UPGRADE_DEFS, buy, createInitialRunState, price, reward } from "./progression.js";
import "./styles.css";

const app = document.querySelector("#app");
const engine = createGameEngine();
let run = createInitialRunState();
let state = engine.getState();
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[char]));

function render() {
  if (run.phase === "title") {
    app.innerHTML = `<div class="shell"><h1>SURVIVE<span>.EXE</span></h1><p>Survive work from 9:00 AM to 5:00 PM.</p><button data-a="start">START WORKDAY</button><button data-a="shop">SHOP PREVIEW</button></div>`;
    return;
  }
  if (run.phase === "report") {
    app.innerHTML = `<div class="shell"><h1>${state.result === "win" ? "You survived." : "You burned out."}</h1><p>Rank: ${esc(state.finalReport?.rank || "Intern")} · Score: ${state.score}</p><p>Earned $${run.report.money}, reputation ${run.report.reputation > 0 ? "+" : ""}${run.report.reputation}</p><button data-a="shop">CONTINUE TO SHOP</button><button data-a="new">NEW RUN</button></div>`;
    return;
  }
  if (run.phase === "shop") {
    const cards = Object.entries(UPGRADE_DEFS).map(([id, definition]) => { const level = run.upgrades[id]; const cost = price(id, level); const disabled = level >= 3 || run.money < cost; return `<article><h2>${definition.name}</h2><p>${definition.description}</p><p>Level ${level}/3 · $${cost}</p><button data-u="${id}" ${disabled ? "disabled" : ""}>${level >= 3 ? "MAXED" : "BUY"}</button></article>`; }).join("");
    app.innerHTML = `<div class="shell"><h1>OFFICE PROCUREMENT</h1><p>Day ${run.day} · Money $${run.money} · Reputation ${run.reputation}</p><div class="cards">${cards}</div><p>${esc(run.message)}</p><button data-a="next">START NEXT DAY</button></div>`;
    return;
  }
  const event = state.currentEvent;
  app.innerHTML = `<div class="shell"><header>DAY ${run.day}<b>${state.currentTime}</b></header><aside>PRODUCTIVITY ${state.productivity}%<br>STRESS ${state.stress}%<br>REPUTATION ${state.reputation}%<br>SCORE ${state.score}<br>CASH $${run.money}</aside><section>${event ? `<article><small>${event.type}</small><h2>${esc(event.title)}</h2><p>${esc(event.message)}</p><button data-o="A">${esc(event.optionA)}</button><button data-o="B">${esc(event.optionB)}</button></article>` : "Waiting for the next interruption…"}</section></div>`;
}

function startDay() { run = { ...run, phase: "playing" }; engine.startGame(); }

engine.subscribe((nextState) => {
  state = nextState;
  if (run.phase === "playing" && nextState.status === GAME_STATUS.FINISHED) run = { ...run, phase: "report", report: reward(nextState.finalReport, run.day) };
  render();
});

app.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.a === "start") startDay();
  else if (button.dataset.a === "next") { run = { ...run, day: run.day + 1 }; startDay(); }
  else if (button.dataset.a === "shop") run = { ...run, phase: "shop" };
  else if (button.dataset.a === "new") { run = createInitialRunState(); state = engine.getState(); }
  else if (button.dataset.u) run = buy(run, button.dataset.u);
  else if (button.dataset.o && state.currentEvent) engine.handleDecision(state.currentEvent.id, button.dataset.o);
  render();
});

render();
