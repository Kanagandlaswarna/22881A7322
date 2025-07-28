function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

module.exports = { validateURL, generateShortCode };
