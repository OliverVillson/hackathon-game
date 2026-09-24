import { createGameEngine } from "./gameEngine.js";
const engine = createGameEngine({ durationMs: 300 });
engine.startGame();
setTimeout(() => { const state = engine.getState(); if (state.status !== "finished") throw new Error("engine did not finish"); console.log("smoke test passed"); engine.destroy(); }, 400);
