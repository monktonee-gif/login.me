const mockPlayers = [
  { name: "BlazeShadow", kd: 4.2, winRate: 38, matches: 1234, rank: "Heroic" },
  { name: "NOVA-Hawk", kd: 2.9, winRate: 25, matches: 876, rank: "Diamond IV" },
  { name: "GhostRX", kd: 5.1, winRate: 42, matches: 1540, rank: "Master" },
  { name: "RUSHxMamba", kd: 3.4, winRate: 31, matches: 1012, rank: "Elite" }
];

const sensitivityProfiles = {
  low: {
    rush: { general: 92, redDot: 80, scope2x: 71, scope4x: 58, awm: 41, freeLook: 70 },
    sniper: { general: 78, redDot: 61, scope2x: 54, scope4x: 44, awm: 31, freeLook: 65 },
    balanced: { general: 86, redDot: 72, scope2x: 64, scope4x: 50, awm: 38, freeLook: 68 }
  },
  mid: {
    rush: { general: 95, redDot: 85, scope2x: 75, scope4x: 62, awm: 46, freeLook: 74 },
    sniper: { general: 80, redDot: 63, scope2x: 56, scope4x: 47, awm: 35, freeLook: 68 },
    balanced: { general: 89, redDot: 75, scope2x: 66, scope4x: 54, awm: 40, freeLook: 70 }
  },
  high: {
    rush: { general: 100, redDot: 90, scope2x: 80, scope4x: 66, awm: 50, freeLook: 80 },
    sniper: { general: 84, redDot: 67, scope2x: 60, scope4x: 52, awm: 38, freeLook: 72 },
    balanced: { general: 92, redDot: 78, scope2x: 70, scope4x: 58, awm: 43, freeLook: 75 }
  }
};

const page = document.body.dataset.page;

function getUID() {
  const params = new URLSearchParams(window.location.search);
  return params.get("uid") || "demo";
}

function pickMockPlayer(uid) {
  const digits = uid.replace(/\D/g, "");
  const seed = digits ? Number(digits.slice(-3)) : Math.floor(Math.random() * 1000);
  return mockPlayers[seed % mockPlayers.length];
}

function initHomePage() {
  const form = document.getElementById("uidForm");
  const uidInput = document.getElementById("uidInput");
  const uidError = document.getElementById("uidError");
  const sensitivityForm = document.getElementById("sensitivityForm");
  const sensitivityResult = document.getElementById("sensitivityResult");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const uid = uidInput.value.trim();
      if (!/^\d{6,12}$/.test(uid)) {
        uidError.textContent = "Please enter a valid numeric UID (6 to 12 digits).";
        return;
      }

      uidError.textContent = "";
      window.location.href = `stats.html?uid=${encodeURIComponent(uid)}`;
    });
  }

  if (sensitivityForm) {
    sensitivityForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const deviceType = document.getElementById("deviceType").value;
      const playStyle = document.getElementById("playStyle").value;

      if (!deviceType || !playStyle) {
        sensitivityResult.innerHTML = "<p class='form-error'>Please select both device and play style.</p>";
        return;
      }

      const profile = sensitivityProfiles[deviceType][playStyle];
      sensitivityResult.innerHTML = `
        <strong>Recommended ${deviceType.toUpperCase()} / ${playStyle.toUpperCase()} settings:</strong>
        <ul>
          <li>General: ${profile.general}</li>
          <li>Red Dot: ${profile.redDot}</li>
          <li>2x Scope: ${profile.scope2x}</li>
          <li>4x Scope: ${profile.scope4x}</li>
          <li>AWM Scope: ${profile.awm}</li>
          <li>Free Look: ${profile.freeLook}</li>
        </ul>
      `;
    });
  }
}

function initStatsPage() {
  const uid = getUID();
  const player = pickMockPlayer(uid);

  const mappings = {
    playerName: player.name,
    kdRatio: player.kd.toFixed(1),
    winRate: `${player.winRate}%`,
    matchesPlayed: player.matches.toLocaleString(),
    rank: player.rank
  };

  Object.entries(mappings).forEach(([id, value]) => {
    const target = document.getElementById(id);
    if (target) target.textContent = value;
  });

  const statsTitle = document.getElementById("statsTitle");
  const statsSubtext = document.getElementById("statsSubtext");
  if (statsTitle) statsTitle.textContent = `${player.name} - Stats Card`;
  if (statsSubtext) statsSubtext.textContent = `Displaying simulated results for UID: ${uid}`;

  const kdWidth = Math.min((player.kd / 6) * 100, 100);
  const winWidth = Math.min(player.winRate, 100);
  const matchesWidth = Math.min((player.matches / 1600) * 100, 100);

  const barKd = document.getElementById("barKd");
  const barWin = document.getElementById("barWin");
  const barMatches = document.getElementById("barMatches");

  requestAnimationFrame(() => {
    if (barKd) barKd.style.width = `${kdWidth}%`;
    if (barWin) barWin.style.width = `${winWidth}%`;
    if (barMatches) barMatches.style.width = `${matchesWidth}%`;
  });
}

function initLoginPage() {
  const form = document.getElementById("loginForm");
  const message = document.getElementById("loginMessage");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.textContent = "Please enter a valid email address.";
      return;
    }

    if (password.length < 6) {
      message.textContent = "Password must be at least 6 characters.";
      return;
    }

    message.style.color = "var(--success)";
    message.textContent = "Login successful! (Demo only)";
    form.reset();
  });
}

if (page === "home") initHomePage();
if (page === "stats") initStatsPage();
if (page === "login") initLoginPage();
