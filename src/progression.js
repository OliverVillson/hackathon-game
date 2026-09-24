export const UPGRADE_DEFS = {
  adblocker: { name: "AdBlocker Pro", description: "Blocks suspicious popups.", costs: [75, 150, 300], maxLevel: 3 },
  antivirus: { name: "Corporate Antivirus", description: "Reduces malware and phishing.", costs: [100, 200, 400], maxLevel: 3 },
  reliablePrinter: { name: "Reliable Printer", description: "A printer that only catches fire occasionally.", costs: [125, 250, 500], maxLevel: 3 }
};
export const createInitialRunState = () => ({ phase: "title", day: 1, money: 100, reputation: 50, upgrades: { adblocker: 0, antivirus: 0, reliablePrinter: 0 }, report: null, message: "" });
export const price = (id, level) => UPGRADE_DEFS[id]?.costs[level] || 0;
export const buy = (run, id) => { const level = run.upgrades[id] || 0; if (!UPGRADE_DEFS[id] || level >= 3 || run.money < price(id, level)) return run; return { ...run, money: run.money - price(id, level), upgrades: { ...run.upgrades, [id]: level + 1 }, message: `${UPGRADE_DEFS[id].name} upgraded.` }; };
export const reward = (r, day) => ({ money: Math.max(20, 35 + Math.round((r.finalProductivity || 0) * .35) + Math.round((r.score || 0) * .25) - Math.round((r.finalStress || 0) * .15) + day * 5), reputation: r.result === "win" ? 5 + Math.min(day, 12) : -10 });
