/* ============================================================
   Lockly — interactions
   ============================================================ */
"use strict";

/* ---------- Navigation ---------- */
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const navMenuBtn = document.getElementById("navMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
navMenuBtn.addEventListener("click", () => {
  const open = mobileMenu.hidden;
  mobileMenu.hidden = !open;
  navMenuBtn.setAttribute("aria-expanded", String(open));
  navMenuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileMenu.hidden = true;
    navMenuBtn.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* ============================================================
   Lockly app preview — a working front-end demo of the vault
   ============================================================ */

const ICONS = {
  copy: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>',
  eye: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.6 10.6 0 0 1 12 19c-6.5 0-10-7-10-7a17.6 17.6 0 0 1 4.06-4.94M9.9 4.24A9.5 9.5 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="m2 2 20 20"/></svg>',
  back: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5m0 0 6-6m-6 6 6 6"/></svg>',
  star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8z"/></svg>',
  starFilled: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z"/></svg>',
  edit: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>',
  trash: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7"/></svg>',
  restore: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/></svg>',
};

const state = {
  items: [
    {
      id: "github", type: "login", name: "GitHub", username: "gerchann",
      password: "Tr7#mQ2!vX9pL", website: "https://github.com/gerchann",
      notes: "Personal development account.\n2FA via hardware key.",
      favorite: true, deleted: false,
      icon: { bg: "#30363d", fg: "#e6edf3", text: "G" },
      edited: "2 weeks ago", created: "Jan 2026",
    },
    {
      id: "discord", type: "login", name: "Discord", username: "gerchann",
      password: "kL8$wP4&zN6q", website: "https://discord.com",
      notes: "Main account. Nitro renews in March.",
      favorite: false, deleted: false,
      icon: { bg: "#4752c4", fg: "#ffffff", text: "D" },
      edited: "3 days ago", created: "Nov 2025",
    },
    {
      id: "google", type: "login", name: "Google", username: "gerchann@gmail.com",
      password: "Gh5^fJ3*qW8s", website: "https://accounts.google.com",
      notes: "Recovery email: backup@proton.me",
      favorite: true, deleted: false,
      icon: { bg: "#3d82f0", fg: "#ffffff", text: "G" },
      edited: "1 week ago", created: "Sep 2024",
    },
    {
      id: "minecraft", type: "login", name: "Minecraft", username: "Gerchann",
      password: "Rt9@yU2#sD7f", website: "https://www.minecraft.net",
      notes: "Java Edition. Migration complete.",
      favorite: false, deleted: false,
      icon: { bg: "#5b9b2e", fg: "#ffffff", text: "M" },
      edited: "2 months ago", created: "Jun 2024",
    },
    {
      id: "proton", type: "login", name: "Proton", username: "gerchann@proton.me",
      password: "pO6&xV1!nM4c", website: "https://account.proton.me",
      notes: "Used for sensitive sign-ups only.",
      favorite: false, deleted: false,
      icon: { bg: "#6d4aff", fg: "#ffffff", text: "P" },
      edited: "5 days ago", created: "Feb 2026",
    },
    {
      id: "wifi", type: "note", name: "Home Wi-Fi", username: "",
      password: "", website: "",
      notes: "SSID: HomeNet-5G\nPassword: correct-horse-battery-staple\nRouter admin: 192.168.1.1",
      favorite: false, deleted: false,
      icon: { bg: "#1f6f5c", fg: "#d7f5ec", text: "W" },
      edited: "1 month ago", created: "Aug 2025",
    },
    {
      id: "personal", type: "identity", name: "Personal", username: "Gerchann",
      password: "", website: "",
      notes: "gerchann@gmail.com\n+1 (555) 014-2288",
      favorite: false, deleted: false,
      icon: { bg: "#5a5f6a", fg: "#e8eaee", text: "P" },
      edited: "3 weeks ago", created: "Oct 2025",
    },
  ],
  filter: "all",
  search: "",
  selectedId: null,
  locked: false,
  editing: false,
  revealed: false,
};

const FILTER_TITLES = {
  all: "All Items", favorites: "Favorites", logins: "Logins",
  notes: "Secure Notes", identities: "Identities", trash: "Trash",
};

const listEl = document.getElementById("itemList");
const detailPane = document.getElementById("detailPane");
const listTitle = document.getElementById("listTitle");
const listCount = document.getElementById("listCount");
const searchInput = document.getElementById("searchInput");
const lockOverlay = document.getElementById("lockOverlay");

const categoryLabel = (item) =>
  item.type === "login" ? "Login" : item.type === "note" ? "Secure Note" : "Identity";

function visibleItems() {
  const q = state.search.trim().toLowerCase();
  return state.items.filter((item) => {
    if (state.filter === "trash") {
      if (!item.deleted) return false;
    } else if (item.deleted) {
      return false;
    }
    if (state.filter === "favorites" && !item.favorite) return false;
    if (state.filter === "logins" && item.type !== "login") return false;
    if (state.filter === "notes" && item.type !== "note") return false;
    if (state.filter === "identities" && item.type !== "identity") return false;
    if (q) {
      const hay = `${item.name} ${item.username} ${item.website} ${item.notes}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function updateCounts() {
  const active = state.items.filter((i) => !i.deleted);
  const counts = {
    all: active.length,
    favorites: active.filter((i) => i.favorite).length,
    logins: active.filter((i) => i.type === "login").length,
    notes: active.filter((i) => i.type === "note").length,
    identities: active.filter((i) => i.type === "identity").length,
    trash: state.items.filter((i) => i.deleted).length,
  };
  document.querySelectorAll(".app-nav-item .count").forEach((el) => {
    el.textContent = counts[el.dataset.count] ?? 0;
  });
}

function renderList() {
  const items = visibleItems();
  listTitle.textContent = FILTER_TITLES[state.filter];
  listCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;

  if (!items.length) {
    listEl.innerHTML =
      '<li class="app-empty">' +
      (state.filter === "trash" ? "Trash is empty." : "No items match your search.") +
      "</li>";
    return;
  }

  listEl.innerHTML = items
    .map(
      (item) => `
      <li>
        <button class="app-item ${item.id === state.selectedId ? "active" : ""}" data-id="${item.id}" aria-label="${item.name}">
          <span class="fav" style="background:${item.icon.bg};color:${item.icon.fg}">${item.icon.text}</span>
          <span class="app-item-info">
            <span class="app-item-name">${item.name}</span>
            <span class="app-item-sub">${item.username || item.website || categoryLabel(item)}</span>
          </span>
          <span class="app-item-cat">${categoryLabel(item)}</span>
        </button>
      </li>`
    )
    .join("");
}

function fieldRow(label, value, opts = {}) {
  const { mono = false, notes = false, actions = [] } = opts;
  return `
    <div class="detail-field">
      <span class="detail-field-label">${label}</span>
      <div class="detail-field-value ${mono ? "mono" : ""} ${notes ? "notes" : ""}">
        <span>${value}</span>
        ${actions.join("")}
      </div>
    </div>`;
}

function copyBtn(id) {
  return `<button class="icon-btn" data-copy="${id}" aria-label="Copy to clipboard">${ICONS.copy}<span>Copy</span></button>`;
}

function renderDetail() {
  const item = state.items.find((i) => i.id === state.selectedId);
  if (!item) {
    detailPane.classList.remove("open");
    detailPane.innerHTML =
      '<div class="detail-inner"><p class="app-empty">Select an item to view its details.</p></div>';
    return;
  }

  if (state.editing) {
    detailPane.innerHTML = `
      <div class="detail-inner">
        <div class="detail-top">
          <div class="detail-head-main">
            <span class="fav" style="background:${item.icon.bg};color:${item.icon.fg}">${item.icon.text}</span>
            <div>
              <div class="detail-title">Edit item</div>
              <div class="detail-sub">${categoryLabel(item)}</div>
            </div>
          </div>
        </div>
        <form class="edit-form" id="editForm">
          <label><span class="detail-field-label">Name</span><input name="name" value="${item.name}" required></label>
          ${item.type === "login" ? `<label><span class="detail-field-label">Username</span><input name="username" value="${item.username}"></label>` : ""}
          ${item.type === "login" ? `<label><span class="detail-field-label">Password</span><input name="password" value="${item.password}"></label>` : ""}
          ${item.type === "login" ? `<label><span class="detail-field-label">Website</span><input name="website" value="${item.website}"></label>` : ""}
          <label><span class="detail-field-label">Notes</span><textarea name="notes">${item.notes}</textarea></label>
          <div class="edit-actions">
            <button type="submit" class="btn btn-primary btn-sm">Save changes</button>
            <button type="button" class="btn btn-ghost btn-sm" id="cancelEdit">Cancel</button>
          </div>
        </form>
      </div>`;

    document.getElementById("cancelEdit").addEventListener("click", () => {
      state.editing = false;
      renderDetail();
    });
    document.getElementById("editForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      item.name = fd.get("name").trim() || item.name;
      item.username = fd.get("username")?.trim() ?? item.username;
      item.password = fd.get("password") ?? item.password;
      item.website = fd.get("website")?.trim() ?? item.website;
      item.notes = fd.get("notes") ?? item.notes;
      item.edited = "just now";
      state.editing = false;
      renderList();
      renderDetail();
    });
    return;
  }

  const isTrash = state.filter === "trash";
  let fields = "";

  if (isTrash) {
    fields += fieldRow("Name", item.name);
    fields += `<div class="detail-danger"><button class="icon-btn" id="restoreBtn">${ICONS.restore}<span>Restore item</span></button></div>`;
  } else {
    if (item.type === "login") {
      fields += fieldRow("Username", item.username, { actions: [copyBtn(`u:${item.id}`)] });
      fields += fieldRow("Password", state.revealed ? item.password : "•".repeat(Math.min(item.password.length, 18)), {
        mono: true,
        actions: [
          `<button class="icon-btn" id="revealBtn" aria-label="${state.revealed ? "Hide password" : "Show password"}">${state.revealed ? ICONS.eyeOff : ICONS.eye}<span>${state.revealed ? "Hide" : "Show"}</span></button>`,
          copyBtn(`p:${item.id}`),
        ],
      });
      fields += fieldRow("Website", item.website, { actions: [copyBtn(`w:${item.id}`)] });
    }
    if (item.notes) {
      fields += fieldRow("Notes", item.notes, { notes: true, actions: [copyBtn(`n:${item.id}`)] });
    }
  }

  detailPane.innerHTML = `
    <div class="detail-inner">
      <div class="detail-top">
        <div class="detail-head-main">
          <span class="fav" style="background:${item.icon.bg};color:${item.icon.fg}">${item.icon.text}</span>
          <div>
            <div class="detail-title">${item.name}</div>
            <div class="detail-sub">${item.username ? `${item.username} · ` : ""}${categoryLabel(item)}</div>
          </div>
        </div>
        ${
          isTrash
            ? `<button class="icon-btn" id="deleteForeverBtn" aria-label="Delete forever">${ICONS.trash}<span>Delete forever</span></button>`
            : `<button class="detail-fav-btn ${item.favorite ? "faved" : ""}" id="favBtn" aria-label="${item.favorite ? "Remove from favorites" : "Add to favorites"}" aria-pressed="${item.favorite}">${item.favorite ? ICONS.starFilled : ICONS.star}</button>
               <button class="detail-edit-btn" id="editBtn">${ICONS.edit}<span>Edit</span></button>`
        }
      </div>
      ${fields}
      <div class="detail-meta">
        <span>Last edited ${item.edited}</span>
        <span>Created ${item.created}</span>
      </div>
    </div>`;

  if (isTrash) {
    document.getElementById("restoreBtn").addEventListener("click", () => {
      item.deleted = false;
      state.selectedId = null;
      updateCounts();
      renderList();
      renderDetail();
    });
  } else {
    document.getElementById("favBtn").addEventListener("click", () => {
      item.favorite = !item.favorite;
      updateCounts();
      renderList();
      renderDetail();
    });
    document.getElementById("editBtn").addEventListener("click", () => {
      state.editing = true;
      renderDetail();
    });
    const revealBtn = document.getElementById("revealBtn");
    if (revealBtn) {
      revealBtn.addEventListener("click", () => {
        state.revealed = !state.revealed;
        renderDetail();
      });
    }
  }

  detailPane.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => copyValue(btn.dataset.copy, btn));
  });
}

function copyValue(ref, btn) {
  const item = state.items.find((i) => i.id === ref.split(":")[1]);
  if (!item) return;
  const field = ref.split(":")[0];
  const text =
    field === "u" ? item.username :
    field === "p" ? item.password :
    field === "w" ? item.website : item.notes;

  const done = () => {
    btn.classList.add("copied");
    btn.innerHTML = `${ICONS.check}<span>Copied</span>`;
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerHTML = `${ICONS.copy}<span>Copy</span>`;
    }, 1500);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(done);
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_) { /* noop */ }
    ta.remove();
    done();
  }
}

/* ---------- App preview events ---------- */
listEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".app-item");
  if (!btn) return;
  state.selectedId = btn.dataset.id;
  state.editing = false;
  state.revealed = false;
  renderList();
  renderDetail();
  if (window.matchMedia("(max-width: 700px)").matches) {
    detailPane.classList.add("open");
  }
});

document.querySelectorAll(".app-nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".app-nav-item").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.filter = btn.dataset.filter;
    state.selectedId = null;
    state.editing = false;
    state.revealed = false;
    detailPane.classList.remove("open");
    renderList();
    renderDetail();
  });
});

searchInput.addEventListener("input", () => {
  state.search = searchInput.value;
  renderList();
});

document.getElementById("lockBtn").addEventListener("click", () => {
  state.locked = true;
  lockOverlay.hidden = false;
});
document.getElementById("unlockBtn").addEventListener("click", () => {
  state.locked = false;
  lockOverlay.hidden = true;
});

const autoLockToggle = document.getElementById("autoLockToggle");
autoLockToggle.addEventListener("click", () => {
  const pressed = autoLockToggle.getAttribute("aria-pressed") === "true";
  autoLockToggle.setAttribute("aria-pressed", String(!pressed));
});

/* Close mobile detail view when clicking the list pane on small screens */
document.querySelector(".app-list-pane").addEventListener("click", (e) => {
  if (window.matchMedia("(max-width: 700px)").matches && e.target.closest(".app-search")) {
    detailPane.classList.remove("open");
  }
});

/* ---------- Init ---------- */
updateCounts();
renderList();
renderDetail();
