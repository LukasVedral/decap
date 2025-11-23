const API_URL="https://script.google.com/macros/s/AKfycbyhL9rOh2N0cSkxBxs1Ipvo7b-QpihzaeuNgOf8GAqGqPpZV9jgqFlcWryZa-UoflqQkw/exec";
// 🔹 Elementy modalu přihlášení
const modal = document.getElementById("signup-modal");
const closeModalBtn = document.getElementById("close-modal");
const submitSignupBtn = document.getElementById("submit-signup");

// Otevření modalu
document.querySelector("#sign-up-btn").addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Zavření modalu
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// 🔹 Odeslání formuláře (přihlášení)
submitSignupBtn.addEventListener("click", async () => {
  const teamName = document.getElementById("teamName").value;
  const category = document.getElementById("category").value;
  const racer1 = document.getElementById("racer1").value;
  const email1 = document.getElementById("email1").value;
  const racer2 = document.getElementById("racer2").value;
  const email2 = document.getElementById("email2").value;
  const password = document.getElementById("password").value;

  if (!teamName || !category || !racer1 || !racer2 || !email1 || !email2 || !password) {
    alert("Vyplň všechny povinné údaje");
    return;
  }

  submitSignupBtn.disabled = true;
  submitSignupBtn.textContent = "Odesílám...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "add", teamName, category, racer1, email1, racer2, email2, password }),
    });
    const result = await res.json();

    if (result.success) {
      modal.classList.add("hidden");
      fetchTeams();
    } else {
      alert(result.message || "Nepodařilo se přihlásit tým.");
    }
  } catch (err) {
    console.error(err);
    alert("Chyba při komunikaci se serverem.");
  } finally {
    submitSignupBtn.disabled = false;
    submitSignupBtn.textContent = "Přihlásit se";
  }
});

// 🔹 Načtení týmů z tabulky
async function fetchTeams() {
  try {
    const res = await fetch(API_URL);
    const teams = await res.json();
    localStorage.setItem("teams", JSON.stringify(teams));
    renderTable(teams);
  } catch (err) {
    console.error("Chyba při načítání z Google Sheets:", err);
  }
}

// 🔹 Kontrola kapacity (max 80 týmů)
async function checkCapacity() {
  try {
    const res = await fetch(API_URL);
    const teams = await res.json();

    if (teams.length >= 80) {
      const signUpBtn = document.querySelector("#sign-up-btn");
      signUpBtn.disabled = true;
      signUpBtn.textContent = "Kapacita naplněna";
      signUpBtn.classList.add("disabled");
      modal.classList.add("hidden");
    }
  } catch (err) {
    console.error("Chyba při kontrole kapacity:", err);
  }
}

// 🔹 Vykreslení tabulky týmů
function renderTable(teams) {
  const tableBody = document.querySelector("#team-table tbody");
  tableBody.innerHTML = "";
  teams.forEach(team => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${team.teamName}</td>
      <td>${team.category}</td>
      <td>${team.racer1}</td>
      <td>${team.racer2}</td>
      <td><button class="sign-out-btn" data-team="${team.teamName}" data-racer1="${team.racer1}" data-racer2="${team.racer2}">Odhlásit se</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

// 🔹 Odhlášení týmu (modal)
const logoutModal = document.getElementById("logout-modal");
const closeLogoutBtn = document.getElementById("close-logout-modal");
const confirmLogoutBtn = document.getElementById("confirm-logout");
let logoutData = null;

document.querySelector("#team-table").addEventListener("click", (e) => {
  if (e.target.classList.contains("sign-out-btn")) {
    const teamName = e.target.dataset.team;
    const racer1 = e.target.dataset.racer1;
    const racer2 = e.target.dataset.racer2;
    logoutData = { teamName, racer1, racer2 };
    logoutModal.classList.remove("hidden");
  }
});

closeLogoutBtn.addEventListener("click", () => {
  logoutModal.classList.add("hidden");
  logoutData = null;
});

confirmLogoutBtn.addEventListener("click", async () => {
  if (!logoutData) return;
  const password = document.getElementById("logout-password").value;
  if (!password) {
    alert("Zadejte heslo!");
    return;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "remove", ...logoutData, password }),
  });
  const result = await res.json();

  if (result.success) {
    fetchTeams();
    logoutModal.classList.add("hidden");
    document.getElementById("logout-password").value = "";
    logoutData = null;
  } else {
    alert(result.message || "Odhlášení se nepodařilo.");
  }
});

// 🔹 Výběr kategorie (ikony)
const selectedCategory = document.getElementById("selectedCategory");
const categoryList = document.getElementById("categoryList");
const categoryInput = document.getElementById("category");

selectedCategory.addEventListener("click", () => {
  categoryList.classList.toggle("show");
});

categoryList.querySelectorAll("img").forEach(img => {
  img.addEventListener("click", () => {
    selectedCategory.innerHTML = "";
    const clone = img.cloneNode(true);
    selectedCategory.appendChild(clone);
    categoryInput.value = img.dataset.value;
    categoryList.classList.remove("show");
  });
});

// 🔹 Po načtení stránky
document.addEventListener("DOMContentLoaded", () => {
  fetchTeams();
  checkCapacity();
});