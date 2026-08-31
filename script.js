let designs = [];
let filteredDesigns = [];
let lastIndex = -1;

const imageEl = document.getElementById("designImage");
const nameEl = document.getElementById("designName");
const metaEl = document.getElementById("designMeta");
const nextBtn = document.getElementById("nextBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

function stars(difficulty) {
  return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
}

function renderDesign(design) {
  imageEl.innerHTML = "";

  if (design.image) {
    const img = document.createElement("img");
    img.src = design.image;
    img.alt = design.name;
    img.className = "card__photo";
    img.onerror = () => {
      imageEl.innerHTML = `<span class="card__placeholder-icon">☕</span>`;
    };
    imageEl.appendChild(img);
  } else {
    imageEl.innerHTML = `<span class="card__placeholder-icon">☕</span>`;
  }

  nameEl.textContent = design.name;
  metaEl.textContent = `${design.category} · ${stars(design.difficulty)}`;
}

function showRandomDesign() {
  if (filteredDesigns.length === 0) {
    nameEl.textContent = "No designs in this category yet";
    metaEl.textContent = "";
    imageEl.innerHTML = `<span class="card__placeholder-icon">☕</span>`;
    return;
  }

  let index;
  do {
    index = Math.floor(Math.random() * filteredDesigns.length);
  } while (index === lastIndex && filteredDesigns.length > 1);
  lastIndex = index;

  renderDesign(filteredDesigns[index]);
}

function applyFilter(category) {
  filteredDesigns =
    category === "All" ? designs : designs.filter((d) => d.category === category);
  lastIndex = -1;
  showRandomDesign();

  filterButtons.forEach((btn) => {
    btn.classList.toggle("filter-btn--active", btn.dataset.category === category);
  });
}

nextBtn.addEventListener("click", showRandomDesign);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyFilter(btn.dataset.category));
});

fetch("designs.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`designs.json returned status ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    designs = data;
    applyFilter("All");
  })
  .catch((error) => {
    nameEl.textContent = "Couldn't load designs";
    metaEl.textContent = error.message;
    console.error(error);
  });
