// Gemini's function, read and reviewed by Codex before execution.
function sumPositive(values) {
  return values.reduce((sum, val) => (val > 0 ? sum + val : sum), 0);
}

// Local test adapter added by Codex.
module.exports = { sumPositive };
