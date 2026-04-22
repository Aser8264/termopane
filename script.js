const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-site-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const productCards = document.querySelectorAll("[data-category]");
const filterStatus = document.querySelector("[data-filter-status]");
const quoteForm = document.querySelector("[data-quote-form]");
const quoteItems = document.querySelector("[data-quote-items]");
const quoteTemplate = document.querySelector("[data-quote-template]");
const addItemButton = document.querySelector("[data-add-item]");
const quoteOutput = document.querySelector("[data-quote-output]");
const sendButton = document.querySelector("[data-send-message]");
const whatsappNumber = body.dataset.clientWhatsapp || "40761730601";
const filterLabels = {
  ferestre: "ferestre",
  usi: "usi",
};

function closeMenu() {
  body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

function getQuoteItemData(item) {
  const type = item.querySelector("[name='type']")?.value.trim() || "";
  const width = item.querySelector("[name='width']")?.value.trim() || "";
  const height = item.querySelector("[name='height']")?.value.trim() || "";
  const color = item.querySelector("[name='color']")?.value.trim() || "";
  const details = item.querySelector("[name='details']")?.value.trim() || "";

  return { type, width, height, color, details };
}

function updateQuoteItems() {
  const items = quoteItems ? Array.from(quoteItems.querySelectorAll("[data-quote-item]")) : [];
  quoteForm?.classList.toggle("is-single-item", items.length <= 1);

  items.forEach((item, index) => {
    const legend = item.querySelector("legend");

    if (legend) {
      legend.textContent = `Produs ${index + 1}`;
    }
  });
}

menuToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter ?? "all";
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    productCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-filtered-out", !shouldShow);
      card.classList.toggle("is-filtered-in", shouldShow);

      if (shouldShow) {
        card.style.animationDelay = `${visibleCount * 55}ms`;
        visibleCount += 1;
      } else {
        card.style.animationDelay = "";
      }
    });

    if (filterStatus) {
      if (filter === "all") {
        filterStatus.textContent = `Sunt afisate toate cele ${visibleCount} produse din lista.`;
      } else {
        const label = filterLabels[filter] || "produse selectate";
        const noun = visibleCount === 1 ? "produs" : "produse";
        filterStatus.textContent = `Sunt afisate ${visibleCount} ${noun}: ${label}.`;
      }
    }
  });
});

addItemButton?.addEventListener("click", () => {
  if (!quoteItems || !(quoteTemplate instanceof HTMLTemplateElement)) {
    return;
  }

  const clone = quoteTemplate.content.firstElementChild?.cloneNode(true);

  if (!(clone instanceof HTMLElement)) {
    return;
  }

  quoteItems.append(clone);
  updateQuoteItems();
  clone.querySelector("select, input, textarea")?.focus();
});

quoteItems?.addEventListener("click", (event) => {
  const removeButton = event.target instanceof HTMLElement ? event.target.closest("[data-remove-item]") : null;

  if (!removeButton) {
    return;
  }

  const item = removeButton.closest("[data-quote-item]");
  const itemCount = quoteItems.querySelectorAll("[data-quote-item]").length;

  if (item && itemCount > 1) {
    item.remove();
    updateQuoteItems();
  }
});

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const items = quoteItems ? Array.from(quoteItems.querySelectorAll("[data-quote-item]")) : [];

  const lines = ["Buna ziua! Caut termopane second hand in Lugoj."];

  items.forEach((item, index) => {
    const { type, width, height, color, details } = getQuoteItemData(item);

    lines.push("");
    lines.push(`Produs ${index + 1}: ${type || "tip necompletat"}`);
    lines.push(`Dimensiuni: ${width || "latime necompletata"} x ${height || "inaltime necompletata"}`);
    lines.push(`Culoare preferata: ${color || "nu conteaza"}`);

    if (details) {
      lines.push(`Detalii: ${details}`);
    }
  });

  lines.push("Imi puteti spune ce variante aveti pe stoc?");

  const message = lines.join("\n");
  quoteOutput.textContent = message;
  quoteOutput.classList.add("has-content");
  sendButton?.setAttribute("href", `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
  sendButton?.setAttribute("aria-disabled", "false");
});

sendButton?.addEventListener("click", (event) => {
  if (sendButton.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
  }
});

updateQuoteItems();
