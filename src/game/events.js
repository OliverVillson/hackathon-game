export const WORKPLACE_EVENTS = [
  { id: "meeting", type: "meeting", title: "Daily Sync", message: "A meeting about the meeting appeared.", optionA: "ACCEPT", optionB: "DECLINE", effectsA: { productivity: -4, stress: 7, reputation: 5, score: 8 }, effectsB: { productivity: 3, stress: -2, reputation: -3, score: 5 } },
  { id: "manager", type: "manager", title: "Manager message", message: "Can you make this urgent thing your top priority?", optionA: "REPLY", optionB: "IGNORE", effectsA: { productivity: 5, stress: 6, reputation: 7, score: 10 }, effectsB: { productivity: -2, stress: -3, reputation: -8, score: 2 } },
  { id: "email", type: "email", title: "47 unread emails", message: "Three are urgent. One is from yourself.", optionA: "ANSWER", optionB: "ARCHIVE ALL", effectsA: { productivity: 5, stress: 5, reputation: 3, score: 9 }, effectsB: { productivity: 2, stress: -4, reputation: -2, score: 6 } },
  { id: "popup", type: "popup", title: "You won a printer!", message: "Enter your password to claim your prize.", optionA: "CLICK", optionB: "CLOSE", effectsA: { productivity: -7, stress: 10, reputation: -6, score: 1 }, effectsB: { productivity: 4, stress: -3, reputation: 3, score: 9 } },
  { id: "printer", type: "chaos", title: "The printer is on fire", message: "It is making a terrible sound and a lot of paper.", optionA: "CALL IT", optionB: "FIX IT", effectsA: { productivity: -2, stress: 4, reputation: 6, score: 9 }, effectsB: { productivity: -5, stress: 11, reputation: -3, score: 5 } }
];

export function getEventForIndex(index, random = Math.random) {
  return WORKPLACE_EVENTS[(index + Math.floor(random() * WORKPLACE_EVENTS.length)) % WORKPLACE_EVENTS.length];
}
