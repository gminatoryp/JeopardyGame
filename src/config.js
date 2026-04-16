// ─── GAME CONFIGURATION ───────────────────────────────────────────────────────
// Edit these values to change game behaviour without touching any component code.

export const CONFIG = {
  // How many seconds the countdown timer runs per clue
  TIMER_SECONDS: 30,

  // Pre-assign a Daily Double cell using "colIndex-rowIndex" (both zero-based).
  // e.g. "3-2" = 4th column, 3rd row ($300 in that category).
  // Set to null to have no Daily Double.
  DAILY_DOUBLE_CELL: '3-2',
};

// ─── TEAM SETUP ───────────────────────────────────────────────────────────────
export const TEAM_NAMES  = ['Team 1', 'Team 2', 'Team 3'];
export const TEAM_COLORS = ['#C084FC', '#34D399', '#FB923C'];
export const TEAM_GLOWS  = [
  'rgba(192,132,252,0.3)',
  'rgba(52,211,153,0.3)',
  'rgba(251,146,60,0.3)',
];
