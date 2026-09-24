import { getEventForIndex, WORKPLACE_EVENTS } from "./events.js";

export const GAME_STATUS = Object.freeze({ IDLE: "idle", PLAYING: "playing", FINISHED: "finished" });
export const GAME_DURATION_MS = 75000;
const clamp = (n) => Math.max(0, Math.min(100, n));
const timeFor = (elapsed, duration) => {
  const m = Math.round(540 + 480 * Math.min(1, Math.max(0, elapsed / duration)));
  return { timeMinutes: m, currentTime: `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}` };
};
const initial = () => ({ status: GAME_STATUS.IDLE, ...timeFor(0, GAME_DURATION_MS), productivity: 50, stress: 15, reputation: 50, score: 0, currentEvent: null, completedEvents: [], finalReport: null, result: null, gameOverReason: null });
const report = (s) => ({ eventsHandled: s.completedEvents.length, finalProductivity: s.productivity, finalStress: s.stress, finalReputation: s.reputation, score: s.score, result: s.result, rank: s.result === "loss" ? "Intern" : s.score >= 100 ? "Corporate Warrior" : "Office Survivor" });

export function createGameEngine({ durationMs = GAME_DURATION_MS, random = Math.random } = {}) {
  let state = initial(); let started = 0; let tickId; let eventId; let index = 0;
  const listeners = new Set();
  const getState = () => ({ ...state, completedEvents: [...state.completedEvents], currentEvent: state.currentEvent && { ...state.currentEvent } });
  const emit = () => listeners.forEach((fn) => fn(getState()));
  const clear = () => { clearInterval(tickId); clearTimeout(eventId); tickId = eventId = null; };
  const finish = (reason = "day_complete", result = "win") => { clear(); state = { ...state, ...timeFor(durationMs, durationMs), status: GAME_STATUS.FINISHED, currentEvent: null, result, gameOverReason: reason }; state.finalReport = report(state); emit(); };
  const schedule = () => { if (state.status !== GAME_STATUS.PLAYING || state.currentEvent) return; const delay = (Date.now() - started) > durationMs * 0.7 ? 2500 : 5000; eventId = setTimeout(() => { if (state.status !== GAME_STATUS.PLAYING || state.currentEvent) return; state = { ...state, currentEvent: getEventForIndex(index++, random) }; emit(); }, delay); };
  const tick = () => { if (state.status !== GAME_STATUS.PLAYING) return; const elapsed = Date.now() - started; if (elapsed >= durationMs) return finish(); state = { ...state, ...timeFor(elapsed, durationMs) }; emit(); };
  const startGame = () => { clear(); state = { ...initial(), status: GAME_STATUS.PLAYING }; started = Date.now(); index = 0; emit(); tickId = setInterval(tick, 250); schedule(); return getState(); };
  const handleDecision = (id, option) => { if (state.status !== GAME_STATUS.PLAYING || !state.currentEvent || state.currentEvent.id !== id || !["A", "B"].includes(option)) return false; const event = state.currentEvent; const effects = option === "A" ? event.effectsA : event.effectsB; const entry = { id: event.id, type: event.type, option, effects: { ...effects }, timestamp: state.currentTime }; state = { ...state, productivity: clamp(state.productivity + (effects.productivity || 0)), stress: clamp(state.stress + (effects.stress || 0)), reputation: clamp(state.reputation + (effects.reputation || 0)), score: Math.max(0, state.score + (effects.score || 0)), currentEvent: null, completedEvents: [...state.completedEvents, entry] }; emit(); if (state.stress >= 100) finish("stress_overload", "loss"); else if (state.reputation <= 0) finish("reputation_crash", "loss"); else schedule(); return true; };
  return { getState, subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); }, startGame, restartGame: startGame, handleDecision, destroy: clear, events: WORKPLACE_EVENTS };
}
