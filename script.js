const startYear = 2025; // Startpunkt
const endYear = 2035;   // Slutpunkt
const listContainer = document.getElementById("holiday-list");
const searchInput = document.getElementById("search");

let allHolidays = [];

async function fetchHolidays(year) {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/SE`);
  if (!res.ok) throw new Error(`Kunde inte hämta ${year}`);
  return res.json();
}

async function loadHolidays() {
  listContainer.innerHTML = "<p>Laddar helgdagar...</p>";
  try {
    allHolidays = [];
    for (let year = startYear; year <= endYear; year++) {
      const holidays = await fetchHolidays(year);
      allHolidays.push({ year, holidays });
    }
    renderHolidays();
  } catch (err) {
    listContainer.innerHTML = `<p style="color:red;">Fel vid hämtning: ${err.message}</p>`;
  }
}

function renderHolidays(filter = "") {
  listContainer.innerHTML = "";
  allHolidays.forEach(({ year, holidays }) => {
    const filtered = holidays.filter(h =>
      h.localName.toLowerCase().includes(filter.toLowerCase())
    );
    if (filtered.length === 0) return;

    const section = document.createElement("div");
    section.classList.add("year-section");

    const title = document.createElement("h2");
    title.classList.add("year-title");
    title.innerHTML = `<i class="fas fa-calendar-alt"></i> ${year}`;
    section.appendChild(title);

    filtered.forEach(h => {
      const div = document.createElement("div");
      div.classList.add("holiday");
      div.innerHTML = `
        <h2><i class="fas fa-star"></i> ${h.localName}</h2>
        <p><i class="fas fa-calendar"></i> ${h.date}</p>
      `;
      section.appendChild(div);
    });

    listContainer.appendChild(section);
  });
}

searchInput.addEventListener("input", e => {
  renderHolidays(e.target.value);
});

loadHolidays();
