// ==========================================
// 1. DAATAA BU'UURAA (Mock Database & Lists)
// ==========================================

// Damee Bulchiinsaa 12
const departments = [
  "Damee Ulamaa fi Da'awaa",
  "Damee Faayinaansii",
  "Damee Masjiidaa fi Awqaafaa",
  "Damee Madrasaa fi Qulqullina Barnootaa",
  "Damee Dargaggoo fi Miidiyaa",
  "Damee Odiitii fi Inis'eekshinii",
  "Damee Gurmaa'insaa",
  "Damee Dubartootaa",
  "Hoji Gaggeessaa Mana Marichaa",
  "Damee Barnootaa",
  "Damee Tajaajila Hawaasaa",
  "Damee Seeraa fi Qajeelfama",
];

// Daataa Fakkeenyaa Masjiidootaa fi Madrasootaa
const mockDatabase = {
  "Malkaa Gafarsaa": {
    Masjiidoota: [
      {
        id: "m1",
        name: "Masjiida Guddaa Malkaa Gafarsaa",
        imam: "Sheikh Ahmed",
        workers: 5,
        income: "10,000 ETB",
      },
      {
        id: "m2",
        name: "Masjiida Noor",
        imam: "Sheikh Ibrahim",
        workers: 3,
        income: "5,000 ETB",
      },
    ],
    Madrasoota: [
      {
        id: "d1",
        name: "Madrasa Nurul Islam",
        ustaz: "Ustaz Ali",
        students: 120,
        curriculum: "Hifz & Tafsir",
      },
      {
        id: "d2",
        name: "Madrasa Al-Furqan",
        ustaz: "Ustaz Mohammed",
        students: 85,
        curriculum: "Qiraat",
      },
    ],
  },
  Beeroo: {
    Masjiidoota: [
      {
        id: "m3",
        name: "Masjiida Beeroo Guddaa",
        imam: "Sheikh Yusuf",
        workers: 4,
        income: "8,000 ETB",
      },
    ],
    Madrasoota: [
      {
        id: "d3",
        name: "Madrasa Beeroo",
        ustaz: "Ustaz Omar",
        students: 60,
        curriculum: "Basic Islamic Studies",
      },
    ],
  },
  Noonnoo: {
    Masjiidoota: [
      {
        id: "m4",
        name: "Masjiida Noonnoo Jireenyaa",
        imam: "Sheikh Abdulahi",
        workers: 6,
        income: "12,000 ETB",
      },
    ],
    Madrasoota: [
      {
        id: "d4",
        name: "Madrasa Noonnoo",
        ustaz: "Ustaz Hamza",
        students: 150,
        curriculum: "Full Time",
      },
    ],
  },
};

// Qindaa'ina Fuulaa (State Variables)
let currentZone = "";
let currentType = "";
let currentFacilityData = null;

// ==========================================
// 2. SIRNA NAVIGATION & MENU
// ==========================================

// Fuula Jijjiiruu
function showPage(pageId) {
  // Fuulawwan hunda dhoksii, kan barbaadame agarsiisi
  document
    .querySelectorAll(".page")
    .forEach((page) => page.classList.remove("active"));
  const target = document.getElementById(pageId);
  if (target) target.classList.add("active");

  // Yeroo fuula jijjiiran menu mobile (hamburger) cufi
  const nav = document.getElementById("navLinks");
  if (nav.classList.contains("active")) {
    toggleMenu();
  }

  // Menu irratti linkii hojiirra jiru adda baasi
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("onclick") === `showPage('${pageId}')`) {
      link.classList.add("active");
    }
  });

  // Gara olii scroll gochi
  window.scrollTo(0, 0);
}

// Hamburger Menu Banuu fi Cufuu
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  const icon = document.querySelector(".hamburger i");

  nav.classList.toggle("active");

  // Yoo menu bane, mallattoo gara 'X' jijjiiri, yoo cufame gara 'Bars' deebisi
  if (nav.classList.contains("active")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  } else {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
}

// ==========================================
// 3. SIRNA AFAANII (Translation)
// ==========================================

function changeLanguage(lang) {
  // Jechoota hunda afaan barbaadameen jijjiiri
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });

  // Afaan Arabiffaaf RTL (Right-to-Left) qindeessi
  const htmlRoot = document.getElementById("htmlRoot");
  if (lang === "ar") {
    htmlRoot.setAttribute("dir", "rtl");
    htmlRoot.setAttribute("lang", "ar");
  } else {
    htmlRoot.setAttribute("dir", "ltr");
    htmlRoot.setAttribute("lang", lang);
  }

  // Yoo fuula dhaabbataa (facility) irra jiraatan, afaan jijjiiruun haaromsi
  if (
    document.getElementById("facility-details").classList.contains("active") &&
    currentFacilityData
  ) {
    openFacilityDetail(currentFacilityData, currentType);
  } else if (
    document.getElementById("facility-list").classList.contains("active") &&
    currentZone
  ) {
    showFacilities(currentZone, currentType);
  }
}

// ==========================================
// 4. SIRNA DAMEELee BULCHIINSAA
// ==========================================

function loadDepartments() {
  const grid = document.getElementById("deptGrid");
  if (!grid) return;
  grid.innerHTML = "";

  departments.forEach((dept) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <h3 style="color: var(--primary-color); margin-bottom:10px;">${dept}</h3>
            <p style="color: var(--text-muted); font-size:0.9rem;">Ibsa gabaabaa damee kanaa asitti mul'ata.</p>
        `;
    grid.appendChild(card);
  });
}

// ==========================================
// 5. SIRNA MASJIIDOOTAA FI MADRASOOTAA
// ==========================================

// 1. Tarreeffama Aanaa Tokkoo Agarsiisuu
function showFacilities(zoneName, facilityType) {
  currentZone = zoneName;
  currentType = facilityType;
  currentFacilityData = null; // Yeroo tarreeffama seenu odeeffannoo duraa haqi

  showPage("facility-list");

  const currentLang = document.getElementById("languageSelect").value;
  const t = translations[currentLang];
  const listTitle = document.getElementById("listTitle");
  const grid = document.getElementById("facilityGrid");

  // Mata duree qindeessi
  let typeText =
    facilityType === "Masjiidoota" ? t.btn_mosques : t.btn_madrasas;
  listTitle.innerText = `${typeText} - ${zoneName}`;

  grid.innerHTML = "";
  const facilities = mockDatabase[zoneName][facilityType];

  if (!facilities || facilities.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted)">${t.no_data}</p>`;
    return;
  }

  // Kaardiiwwan uumuu
  facilities.forEach((facility) => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => openFacilityDetail(facility, facilityType);

    let icon = facilityType === "Masjiidoota" ? "fa-mosque" : "fa-book-open";

    card.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px; margin-bottom: 1rem;">
                <div class="logo-icon" style="background: #E6F4EA; color: var(--primary-color); flex-shrink: 0;">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <h3 style="margin:0; font-size: 1.1rem;">${facility.name}</h3>
            </div>
            <p><span data-i18n="select_facility">${t.select_facility}</span> <i class="fa-solid fa-arrow-right"></i></p>
        `;
    grid.appendChild(card);
  });
}

// 2. Odeeffannoo Dhaabbataa Tokkoo Agarsiisuu (Taboota waliin)
function openFacilityDetail(facility, facilityType) {
  currentFacilityData = facility;
  showPage("facility-details");

  const currentLang = document.getElementById("languageSelect").value;
  const t = translations[currentLang];

  document.getElementById("facilityTitle").innerText = facility.name;

  const tabsContainer = document.getElementById("facilityTabs");
  const contentContainer = document.getElementById("facilityContent");
  tabsContainer.innerHTML = "";
  contentContainer.innerHTML = "";

  // Taboota Bu'uuraa
  let tabs = [
    { id: "home", label: t.tab_home },
    { id: "about", label: t.tab_about },
    { id: "leadership", label: t.tab_leadership },
  ];

  // Taboota Addaa (Masjiidaaf fi Madrasaaf)
  if (facilityType === "Masjiidoota") {
    tabs.push({ id: "income", label: t.tab_income });
    tabs.push({ id: "workers", label: t.tab_workers });
    tabs.push({ id: "imams", label: t.tab_imams });
  } else {
    tabs.push({ id: "ustaz", label: t.tab_ustaz });
    tabs.push({ id: "students", label: t.tab_students });
    tabs.push({ id: "curriculum", label: t.tab_curriculum });
  }

  // Taboota fi Qabiyyee uumuu
  tabs.forEach((tab, index) => {
    // 1. Button uumuu
    const btn = document.createElement("button");
    btn.className = `tab-btn ${index === 0 ? "active" : ""}`;
    btn.innerText = tab.label;
    btn.onclick = () => switchTab(tab.id, btn);
    tabsContainer.appendChild(btn);

    // 2. Qabiyyee (Content) uumuu
    const pane = document.createElement("div");
    pane.className = `tab-pane ${index === 0 ? "active" : ""}`;
    pane.id = `tab-${tab.id}`;

    let contentHTML = `<h3>${tab.label}</h3>`;

    // Qabiyyee Tabootaa (Data Cards fayyadamuun)
    if (tab.id === "home") {
      contentHTML += `<p>Baga nagaan dhuftan fuula seensa ${facility.name}.</p>`;
    } else if (tab.id === "about") {
      contentHTML += `<p>Ibsa bal'aa waa'ee ${facility.name} asitti mul'ata.</p>`;
    } else if (tab.id === "income" && facilityType === "Masjiidoota") {
      contentHTML += `
                <div class="data-grid">
                    <div class="data-card">
                        <i class="fa-solid fa-money-bill-wave"></i>
                        <h4>${t.income_status}</h4>
                        <p>${facility.income}</p>
                    </div>
                </div>`;
    } else if (tab.id === "workers" && facilityType === "Masjiidoota") {
      contentHTML += `
                <div class="data-grid">
                    <div class="data-card">
                        <i class="fa-solid fa-users"></i>
                        <h4>${t.workers_count}</h4>
                        <p>${facility.workers}</p>
                    </div>
                </div>`;
    } else if (tab.id === "imams" && facilityType === "Masjiidoota") {
      contentHTML += `
                <div class="data-grid">
                    <div class="data-card">
                        <i class="fa-solid fa-user-tie"></i>
                        <h4>${t.imam_name}</h4>
                        <p>${facility.imam}</p>
                    </div>
                </div>`;
    } else if (tab.id === "ustaz" && facilityType === "Madrasoota") {
      contentHTML += `
                <div class="data-grid">
                    <div class="data-card">
                        <i class="fa-solid fa-chalkboard-user"></i>
                        <h4>${t.ustaz_name}</h4>
                        <p>${facility.ustaz}</p>
                    </div>
                </div>`;
    } else if (tab.id === "students" && facilityType === "Madrasoota") {
      contentHTML += `
                <div class="data-grid">
                    <div class="data-card">
                        <i class="fa-solid fa-user-graduate"></i>
                        <h4>${t.students_count}</h4>
                        <p>${facility.students}</p>
                    </div>
                </div>`;
    } else if (tab.id === "curriculum" && facilityType === "Madrasoota") {
      contentHTML += `
                <div class="data-grid">
                    <div class="data-card">
                        <i class="fa-solid fa-book"></i>
                        <h4>${t.curriculum_type}</h4>
                        <p>${facility.curriculum}</p>
                    </div>
                </div>`;
    } else {
      contentHTML += `<p>Odeeffannoon qophaa'e asitti mul'ata.</p>`;
    }

    pane.innerHTML = contentHTML;
    contentContainer.appendChild(pane);
  });
}

// 3. Gara Tarreeffamaatti Deebi'uu
function backToFacilityList() {
  showFacilities(currentZone, currentType);
}

// 4. Taboota Jijjiiruu
function switchTab(tabId, btnElement) {
  document
    .querySelectorAll(".tab-pane")
    .forEach((pane) => pane.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));

  document.getElementById(`tab-${tabId}`).classList.add("active");
  btnElement.classList.add("active");
}

// ==========================================
// 6. INITIALIZATION (Jalqaba Hojii)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Damee bulchiinsaa fe'i
  loadDepartments();

  // 2. Afaan durtii (LocalStorage) ykn Oromoo durtii godhi
  const savedLang = localStorage.getItem("preferredLanguage") || "om";
  document.getElementById("languageSelect").value = savedLang;
  changeLanguage(savedLang);
});
