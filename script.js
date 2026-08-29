// Placeholder design list.
// Replace `image: null` with a real path (e.g. "images/rosetta.jpg")
// once you've shot real photos -- the display code below already supports it.
const designs = [
  { id: 1, name: "Rosetta", category: "Basic", difficulty: 1, image: "C:\\Users\\ssvsh\\Downloads\\Telegram Desktop\\Rosetta.jpg" },
  //{ id: 2, name: "Heart", category: "Basic", difficulty: 1, image: null },
  { id: 3, name: "Tulip", category: "Basic", difficulty: 2, image: "C:\\Users\\ssvsh\\Downloads\\Telegram Desktop\\4-Tulip.jpg" },
  { id: 4, name: "Swan", category: "Special", difficulty: 3, image: "C:\\Users\\ssvsh\\Downloads\\Telegram Desktop\\Rippled-Base-Swan.jpg" },
  { id: 5, name: "Inverted Rosetta Swan", category: "Professional", difficulty: 4, image: "C:\\Users\\ssvsh\\Downloads\\Telegram Desktop\\Reverted-Rosetta-Swan.jpg" },
  { id: 6, name: "Swan in a Lake", category: "Professional", difficulty: 5, image: "C:\\Users\\ssvsh\\Downloads\\Telegram Desktop\\Swan-Lake.jpg" },
  //{ id: 7, name: "Cat", category: "Animals", difficulty: 3, image: null },
];

const imageEl = document.getElementById("designImage");
const nameEl = document.getElementById("designName");
const metaEl = document.getElementById("designMeta");
const nextBtn = document.getElementById("nextBtn");

let lastIndex = -1;

function stars(difficulty) {
  return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
}

function showRandomDesign() {
  let index;
  do {
    index = Math.floor(Math.random() * designs.length);
  } while (index === lastIndex && designs.length > 1);
  lastIndex = index;

  const design = designs[index];

  if (design.image) {
    imageEl.innerHTML =
      `<img src="${design.image}" alt="${design.name}" style="width:100%;height:100%;object-fit:cover;">`;
  } else {
    imageEl.innerHTML = `<span class="card__placeholder-icon">☕</span>`;
  }

  nameEl.textContent = design.name;
  metaEl.textContent = `${design.category} · ${stars(design.difficulty)}`;
}

nextBtn.addEventListener("click", showRandomDesign);

// Show a design immediately on load
showRandomDesign();
