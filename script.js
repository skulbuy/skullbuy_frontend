// Mock data. You can replace this with a fetch() call later, didn't want it to look empty
const listings = [
  { id: 1, title: "Engineering Mathematics III", price: 4500, seller: "Tola", featured: true,  posted: "2h ago" },
  { id: 2, title: "HP EliteBook 840 G3", price: 185000, seller: "Chidi", featured: true,  posted: "5h ago" },
  { id: 3, title: "Scientific Calculator fx-991", price: 9000, seller: "Amaka", featured: true,  posted: "Yesterday" },
  { id: 4, title: "Mini Rice Cooker", price: 12500, seller: "Bisi", featured: true,  posted: "Yesterday" },
  { id: 5, title: "Lab Coat (size M)", price: 3500, seller: "Emeka", featured: false, posted: "10m ago" },
  { id: 6, title: "Phone Tripod Stand", price: 6000, seller: "Zainab", featured: false, posted: "1h ago" },
  { id: 7, title: "Hostel Mattress", price: 22000, seller: "Femi",  featured: false, posted: "3h ago" },
];

const userPoints = 450;

const formatPrice = (n) => "₦" + n.toLocaleString("en-NG");

function cardHTML(item) {
  const media = item.image
    ? `<img class="card-photo" src="${item.image}" alt="${item.title}">`
    : `<button type="button" class="upload-btn" data-upload="${item.id}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>
        <span>Upload image</span>
      </button>`;

  return `
    <div class="card" data-id="${item.id}">
      <div class="card-img">${media}</div>
      <div class="card-body">
        <p class="card-title">${item.title}</p>
        <p class="card-price">${formatPrice(item.price)}</p>
        <p class="card-meta">${item.seller} • ${item.posted}</p>
      </div>
    </div>`;
}

function render() {
  document.getElementById("featured").innerHTML =
    listings.filter((l) => l.featured).map(cardHTML).join("");

  document.getElementById("recent").innerHTML =
    listings.filter((l) => !l.featured).map(cardHTML).join("");

  document.getElementById("pointsBalance").textContent = `${userPoints} SkulBox Points`;
}

// Search: filters the lists as you type
document.getElementById("searchInput").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const match = (l) => l.title.toLowerCase().includes(q);
  document.getElementById("featured").innerHTML =
    listings.filter((l) => l.featured && match(l)).map(cardHTML).join("");
  document.getElementById("recent").innerHTML =
    listings.filter((l) => !l.featured && match(l)).map(cardHTML).join("");
});

// Placeholder actions 
document.getElementById("getStarted").addEventListener("click", () => {
  alert("SkulBox Savings sign-up coming soon!");
});
document.getElementById("redeem").addEventListener("click", () => {
  alert("You have " + userPoints + " points to redeem.");
});

const picker = document.getElementById("imagePicker");
let uploadingId = null;

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-upload]");
  if (!btn) return;
  uploadingId = Number(btn.dataset.upload);
  picker.click();
});

picker.addEventListener("change", () => {
  const file = picker.files[0];
  if (!file) return;
  const item = listings.find((l) => l.id === uploadingId);
  item.image = URL.createObjectURL(file);
  picker.value = "";
  document.getElementById("searchInput").dispatchEvent(new Event("input"));
});

render();

// Categories screen 
const categories = ["All Items", "Electronics", "Fashion", "Hostel Essentials", "Gadgets", "Books", "Services"];

const items = [
  { id: 101, title: "HP EliteBook 840 G3", price: 185000, category: "Electronics", seller: "Chidi" },
  { id: 102, title: "Engineering Mathematics III", price: 4500, category: "Books", seller: "Tola" },
  { id: 103, title: "Mini Rice Cooker", price: 12500, category: "Hostel Essentials", seller: "Bisi" },
  { id: 104, title: "Phone Tripod Stand", price: 6000, category: "Gadgets", seller: "Zainab" },
  { id: 105, title: "Corporate Shirt (L)", price: 5000, category: "Fashion", seller: "Emeka" },
  { id: 106, title: "Assignment Typing", price: 2000, category: "Services", seller: "Amaka" },
];

let activeCategory = "All Items";
let query = "";

const chipsEl = document.getElementById("chips");
const gridEl = document.getElementById("grid");
const emptyEl = document.getElementById("empty");

function renderChips() {
  chipsEl.innerHTML = categories
    .map((c) => `<button type="button" class="chip ${c === activeCategory ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

function renderItems() {
  const list = items.filter(
    (i) =>
      (activeCategory === "All Items" || i.category === activeCategory) &&
      i.title.toLowerCase().includes(query)
  );

  gridEl.innerHTML = list
    .map(
      (i) => `
      <div class="card">
        <div class="card-img placeholder">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>
        </div>
        <div class="card-body">
          <p class="card-title">${i.title}</p>
          <p class="card-price">${formatPrice(i.price)}</p>
          <p class="card-meta">${i.seller} • ${i.category}</p>
        </div>
      </div>`
    )
    .join("");

  emptyEl.hidden = list.length > 0;
}

chipsEl.addEventListener("click", (e) => {
  const chip = e.target.closest("[data-cat]");
  if (!chip) return;
  activeCategory = chip.dataset.cat;
  renderChips();
  renderItems();
});

document.getElementById("catSearch").addEventListener("input", (e) => {
  query = e.target.value.trim().toLowerCase();
  renderItems();
});

renderChips();
renderItems();

// Post an Item screen
const postPicker = document.getElementById("photoPicker");
const slots = document.querySelectorAll(".photo-slot");
const slot0HTML = slots[0].innerHTML; // remembered so we can reset it after posting
const photos = [null, null, null];
let activeSlot = 0;
let condition = "Fairly Used";

slots.forEach((slot) =>
  slot.addEventListener("click", () => {
    activeSlot = Number(slot.dataset.slot);
    postPicker.click();
  })
);

postPicker.addEventListener("change", () => {
  const file = postPicker.files[0];
  if (!file) return;
  photos[activeSlot] = URL.createObjectURL(file);
  slots[activeSlot].classList.add("filled");
  slots[activeSlot].innerHTML = `<img src="${photos[activeSlot]}" alt="Photo ${activeSlot + 1}">`;
  postPicker.value = "";
});

document.querySelectorAll(".seg").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".seg").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    condition = btn.dataset.cond;
  })
);

const errorEl = document.getElementById("formError");

document.getElementById("postForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const listing = {
    title: document.getElementById("title").value.trim(),
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
    condition,
    description: document.getElementById("desc").value.trim(),
    negotiable: document.getElementById("negotiable").checked,
    location: "FUTMX Campus",
    photos: photos.filter(Boolean),
  };

  let problem = "";
  if (!listing.photos.length) problem = "Add at least one photo.";
  else if (!listing.title) problem = "Enter an item title.";
  else if (!listing.price || listing.price <= 0) problem = "Enter a valid price.";
  else if (!listing.category) problem = "Choose a category.";

  errorEl.hidden = !problem;
  errorEl.textContent = problem;
  if (problem) return;

  // Tobiiiiii send `listing` to the server here.
  console.log("New listing:", listing);

  // Show it in the app straight away
  const id = Date.now();
  listings.unshift({ id, title: listing.title, price: listing.price, seller: "You", featured: false, posted: "Just now", image: listing.photos[0] });
  items.unshift({ id, title: listing.title, price: listing.price, category: listing.category, seller: "You" });
  document.getElementById("searchInput").dispatchEvent(new Event("input"));
  renderItems();

  // Reset the form and go home
  e.target.reset();
  photos.fill(null);
  slots.forEach((s, i) => {
    s.classList.remove("filled");
    s.innerHTML = i === 0 ? slot0HTML : "";
  });
  location.hash = "#home";
});

// SkulBox screen 
const skulbox = { saved: 16250, target: 25000 };

const packages = [
  { id: "standard", name: "Standard Box", price: 25000, margin: 5000, tone: "hot",
    items: ["Rice (5kg)", "Beans (2kg)", "Oil (1L)", "Pasta (2pk)", "Seasoning"] },
  { id: "premium", name: "Premium Box", price: 50000, margin: 8000, tone: "gold",
    items: ["Rice (10kg)", "Beans (5kg)", "Oil (3L)", "Pasta (5pk)", "Semovita", "Tubers"] },
];

let selectedPkg = "standard";
const packagesEl = document.getElementById("packages");

const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
const boxIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
const arrowIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

function renderSkulbox() {
  // Progress
  const pct = Math.min(100, Math.round((skulbox.saved / skulbox.target) * 100));
  document.getElementById("sbBar").style.width = pct + "%";
  document.getElementById("sbSaved").textContent = formatPrice(skulbox.saved) + " saved";
  document.getElementById("sbTarget").textContent = formatPrice(skulbox.target) + " target";

  // Packages
  packagesEl.innerHTML = packages
    .map(
      (p) => `
      <article class="sb-card sb-pkg ${p.id === selectedPkg ? "selected" : ""}" data-pkg="${p.id}">
        <div class="sb-pkg-head">
          <div>
            <h3>${p.name}</h3>
            <p class="sb-price">${formatPrice(p.price)}</p>
          </div>
          <span class="sb-pkg-icon ${p.tone}">${boxIcon}</span>
        </div>
        <ul class="sb-list">${p.items.map((i) => `<li>${checkIcon}${i}</li>`).join("")}</ul>
        <div class="sb-pkg-foot">
          <span class="sb-margin">Profit margin: ${formatPrice(p.margin)}</span>
          ${arrowIcon}
        </div>
      </article>`
    )
    .join("");

  // Daily plan follows the package 
  const pkg = packages.find((p) => p.id === selectedPkg);
  document.getElementById("sbPerDay").textContent = formatPrice(Math.round(pkg.price / 30)) + " / day";
}

packagesEl.addEventListener("click", (e) => {
  const card = e.target.closest("[data-pkg]");
  if (!card) return;
  selectedPkg = card.dataset.pkg;
  renderSkulbox();
});

document.getElementById("sbStart").addEventListener("click", () => {
  const pkg = packages.find((p) => p.id === selectedPkg);
  // Tobi, just change the alert to the actual stuff, I didn't want it to be empty
  alert("Daily savings for the " + pkg.name + " is coming soon!");
});

renderSkulbox();

//  Profile screen 
// Points and wallet reuse the numbers from Home and SkulBox
document.getElementById("pfPoints").textContent = userPoints;
document.getElementById("pfWallet").textContent = "₦" + skulbox.saved.toLocaleString("en-NG") + ".00";

// Profile picture upload
const pfAvatar = document.getElementById("pfAvatar");
const pfPicker = document.getElementById("pfPicker");
const pfPic = pfAvatar.querySelector(".pf-pic");

pfAvatar.addEventListener("click", () => pfPicker.click());

pfPicker.addEventListener("change", () => {
  const file = pfPicker.files[0];
  if (!file) return;
  pfPic.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Your profile picture">`;
  pfPicker.value = "";
});

// Everything that isn't built yet shows a placeholder message, take note of this Tobiii
document.querySelectorAll("[data-soon]").forEach((btn) =>
  btn.addEventListener("click", () => alert(btn.dataset.soon + " is coming soon!"))
);

//  Screen switcher 
const views = document.querySelectorAll(".view");
const navLinks = document.querySelectorAll("[data-nav]");

function route() {
  const name = location.hash.replace("#", "") || "home";
  const target = document.getElementById("view-" + name) ? name : "home";
  views.forEach((v) => v.classList.toggle("active", v.id === "view-" + target));
  navLinks.forEach((l) => l.classList.toggle("active", l.dataset.nav === target));
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();

// Emojis work in commenting in code too 😂

