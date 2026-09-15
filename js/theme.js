const THEME_KEY = "theme";

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const themeButton = document.querySelector("#themeToggle");

  if (!themeButton) return;

  const icon = themeButton.querySelector(".theme-icon");

  if (theme === "dark") {
    icon.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
        `;

    themeButton.setAttribute("aria-label", "تغییر به حالت روشن");
    themeButton.setAttribute("title", "حالت روشن");
  } else {
    icon.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3
                         7 7 0 0 0 21 12.79Z"></path>
            </svg>
        `;

    themeButton.setAttribute("aria-label", "تغییر به حالت تاریک");
    themeButton.setAttribute("title", "حالت تاریک");
  }
}

function toggleTheme() {
  const currentTheme = getSavedTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
}

function createThemeButton() {
  const header = document.querySelector("header");

  if (!header || document.querySelector("#themeToggle")) return;

  const button = document.createElement("button");

  button.id = "themeToggle";
  button.className = "theme-toggle";
  button.type = "button";

  button.innerHTML = `
        <span class="theme-icon"></span>
    `;

  button.addEventListener("click", toggleTheme);

  const nav = header.querySelector("nav");

  if (nav) {
    nav.appendChild(button);
  } else {
    header.appendChild(button);
  }
}

function initializeTheme() {
  const savedTheme = getSavedTheme();

  applyTheme(savedTheme);
  createThemeButton();
  applyTheme(savedTheme);
}

document.addEventListener("DOMContentLoaded", initializeTheme);
