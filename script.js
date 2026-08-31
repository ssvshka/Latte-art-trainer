/**
 * Owns the design data and the "what should we show next" logic.
 * Knows nothing about the DOM.
 */
class DesignGallery {
  constructor(designs = []) {
    this.designs = designs;
    this.filteredDesigns = designs;
    this.lastIndex = -1;
  }

  static async loadFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load designs (status ${response.status})`);
    }
    const data = await response.json();
    return new DesignGallery(data);
  }

  filterByCategory(category) {
    this.filteredDesigns =
      category === "All"
        ? this.designs
        : this.designs.filter((design) => design.category === category);
    this.lastIndex = -1;
  }

  hasDesigns() {
    return this.filteredDesigns.length > 0;
  }

  pickNext() {
    if (!this.hasDesigns()) return null;
    this.lastIndex = this.#pickDifferentIndex();
    return this.filteredDesigns[this.lastIndex];
  }

  #pickDifferentIndex() {
    if (this.filteredDesigns.length === 1) return 0;
    let index;
    do {
      index = Math.floor(Math.random() * this.filteredDesigns.length);
    } while (index === this.lastIndex);
    return index;
  }
}

/**
 * Owns rendering a design into the DOM.
 * Knows nothing about filtering or where the data came from.
 */
class DesignCardView {
  constructor({ imageEl, nameEl, metaEl }) {
    this.imageEl = imageEl;
    this.nameEl = nameEl;
    this.metaEl = metaEl;
  }

  showDesign(design) {
    this.#renderImage(design);
    this.nameEl.textContent = design.name;
    this.metaEl.textContent = `${design.category} · ${this.#stars(design.difficulty)}`;
  }

  showEmptyState(message) {
    this.imageEl.innerHTML = `<span class="card__placeholder-icon">☕</span>`;
    this.nameEl.textContent = message;
    this.metaEl.textContent = "";
  }

  #renderImage(design) {
    this.imageEl.innerHTML = "";

    if (!design.image) {
      this.imageEl.innerHTML = `<span class="card__placeholder-icon">☕</span>`;
      return;
    }

    const img = document.createElement("img");
    img.src = design.image;
    img.alt = design.name;
    img.className = "card__photo";
    img.onerror = () => {
      this.imageEl.innerHTML = `<span class="card__placeholder-icon">☕</span>`;
    };
    this.imageEl.appendChild(img);
  }

  #stars(difficulty) {
    return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
  }
}

/**
 * Owns the filter buttons: highlighting the active one and
 * telling the app when the selection changes.
 */
class FilterBar {
  constructor(buttons, onChange) {
    this.buttons = buttons;
    this.onChange = onChange;
    this.#wireButtons();
  }

  #wireButtons() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", () => this.#selectCategory(button));
    });
  }

  #selectCategory(selectedButton) {
    this.buttons.forEach((button) => {
      button.classList.toggle("filter-btn--active", button === selectedButton);
    });
    this.onChange(selectedButton.dataset.category);
  }
}

/**
 * Thin coordinator: wires the three classes together.
 * Deliberately has almost no logic of its own.
 */
async function initApp() {
  const view = new DesignCardView({
    imageEl: document.getElementById("designImage"),
    nameEl: document.getElementById("designName"),
    metaEl: document.getElementById("designMeta"),
  });

  const nextBtn = document.getElementById("nextBtn");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let gallery;

  function showNextDesign() {
    const design = gallery.pickNext();
    if (design) {
      view.showDesign(design);
    } else {
      view.showEmptyState("No designs in this category yet");
    }
  }

  function handleFilterChange(category) {
    gallery.filterByCategory(category);
    showNextDesign();
  }

  new FilterBar(filterButtons, handleFilterChange);
  nextBtn.addEventListener("click", showNextDesign);

  try {
    gallery = await DesignGallery.loadFromUrl("designs.json");
    handleFilterChange("All");
  } catch (error) {
    view.showEmptyState(error.message);
    console.error(error);
  }
}

initApp();
