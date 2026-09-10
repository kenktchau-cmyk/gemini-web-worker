// Gemini's revised function, read and reviewed by Codex before execution.
function sumPositive(values) {
  return values.reduce((sum, val) => {
    if (typeof val === 'number' && Number.isFinite(val) && val > 0) {
      return sum + val;
    }
    return sum;
  }, 0);
}

// Local test adapter added by Codex. Supported contract: Array input.
module.exports = { sumPositive };
