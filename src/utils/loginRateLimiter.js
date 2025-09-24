const loginAttempts = {};

function registerFailedAttempt(key) {
  if (!loginAttempts[key]) {
    loginAttempts[key] = { count: 1, lastAttempt: Date.now() };
  } else {
    loginAttempts[key].count++;
    loginAttempts[key].lastAttempt = Date.now();
  }
}

function isBlocked(key, maxAttempts = 5, blockTimeMs = 15 * 60 * 1000) {
  const attempt = loginAttempts[key];
  if (!attempt) return false;

  if (attempt.count >= maxAttempts) {
    const timePassed = Date.now() - attempt.lastAttempt;
    return timePassed < blockTimeMs;
  }

  return false;
}

function resetAttempts(key) {
  delete loginAttempts[key];
}

export default { registerFailedAttempt, isBlocked, resetAttempts };
