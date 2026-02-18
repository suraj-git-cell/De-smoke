// ===== USER SETTINGS =====
const quitDate = new Date("2026-02-15T00:00:00");
const cigarettesPerDay = 10;
const pricePerPack = 200;
const cigarettesPerPack = 20;

// ===== TIMER =====
function updateTimer() {
  const now = new Date();
  const diff = now - quitDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("timer").innerText =
    `${days}d ${hours}h ${minutes}m ${seconds}s`;

  updateRank(days);
  calculateMoney(days);
}

setInterval(updateTimer, 1000);
updateTimer();

// ===== MONEY =====
function calculateMoney(days) {
  const dailyCost = (cigarettesPerDay / cigarettesPerPack) * pricePerPack;
  const totalSaved = dailyCost * days;
  const yearlyProjection = dailyCost * 365;

  document.getElementById("money").innerText =
    `₹${totalSaved.toFixed(2)} saved`;

  document.getElementById("yearProjection").innerText =
    `1 Year Projection: ₹${yearlyProjection.toFixed(2)}`;
}

// ===== RANK SYSTEM =====
function updateRank(days) {
  let rank = "";

  if (days >= 90) rank = "🏆 Legend";
  else if (days >= 30) rank = "🛡 Guardian";
  else if (days >= 7) rank = "⚔ Warrior";
  else if (days >= 1) rank = "🔥 Rookie";
  else rank = "Starting";

  document.getElementById("rank").innerText = rank;
}

// ===== MOOD CHECK =====
document.getElementById("mood").addEventListener("change", function () {
  const mood = this.value;
  let advice = "";

  if (mood === "stress") advice = "Take 5 deep breaths. Stress passes.";
  if (mood === "bored") advice = "Do 20 pushups or walk for 5 minutes.";
  if (mood === "anger") advice = "Pause. React later. Not with nicotine.";
  if (mood === "social") advice = "You are stronger than social triggers.";
  if (mood === "calm") advice = "Stay mindful. Protect your progress.";

  document.getElementById("moodAdvice").innerText = advice;
});

// ===== SURVIVAL MODE =====
function startSurvival() {
  const msg = document.getElementById("survivalMsg");
  msg.innerText = "Craving detected. 60-second focus challenge started.";

  logCraving();

  let seconds = 60;
  const interval = setInterval(() => {
    seconds--;
    msg.innerText = `Focus... ${seconds}s remaining`;

    if (seconds <= 0) {
      clearInterval(interval);
      msg.innerText = "Craving wave passed. You won.";
    }
  }, 1000);
}

// ===== CRAVING LOG + PATTERN =====
function logCraving() {
  const now = new Date();
  let cravings = JSON.parse(localStorage.getItem("cravings")) || [];
  cravings.push(now.toISOString());
  localStorage.setItem("cravings", JSON.stringify(cravings));

  detectPattern();
}

function detectPattern() {
  let cravings = JSON.parse(localStorage.getItem("cravings")) || [];
  let hours = {};

  cravings.forEach(c => {
    const hour = new Date(c).getHours();
    hours[hour] = (hours[hour] || 0) + 1;
  });

  let riskyHour = Object.keys(hours).find(h => hours[h] >= 3);

  if (riskyHour) {
    document.getElementById("patternAlert").innerText =
      `⚠ High craving frequency around ${riskyHour}:00`;
  }
}

// ===== SERVICE WORKER =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => console.log("De-Smoke SW Registered"))
      .catch(err => console.log(err));
  });
}
