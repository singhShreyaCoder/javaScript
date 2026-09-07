/* ============================================================
    77Lumina Calculator — interaction logic
   ============================================================ */

const display = document.getElementById("display");
const expressionEl = document.getElementById("expression");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let lastResult = null; // last computed value (for chained operations)
let history = [];
const MAX_HISTORY = 20;
const MAX_EXPR_LEN = 26; // max chars shown in expression preview

/* ---------------- Theme ---------------- */
function getStoredTheme() {
  try {
    return localStorage.getItem("lumina-theme");
  } catch (e) {
    return null; // localStorage unavailable (e.g. strict file:// in some browsers)
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem("lumina-theme", theme);
  } catch (e) {
    /* ignore — theme still applies for the session */
  }
}

function initTheme() {
  const saved = getStoredTheme();
  if (saved) document.body.dataset.theme = saved;
}

function toggleTheme() {
  const current = document.body.dataset.theme === "dark" ? "light" : "dark";
  document.body.dataset.theme = current;
  storeTheme(current);
  animateHeader();
}

function animateHeader() {
  const dot = document.querySelector(".brand-dot");
  dot.style.transform = "scale(1.8)";
  dot.style.transition = "transform 0.3s ease";
  setTimeout(() => {
    dot.style.transform = "scale(1)";
  }, 300);
}

/* ---------------- Display helpers ---------------- */
function updateExpression() {
  const text = display.value.trim() || "&nbsp;";
  expressionEl.innerHTML =
    text.length > MAX_EXPR_LEN
      ? "…" + text.slice(-MAX_EXPR_LEN)
      : text.replace(/</g, "&lt;");
}

function setDisplay(value) {
  display.value = value;
  updateExpression();
}

/* ---------------- Input handling ---------------- */
function handleInput(value) {
  // Smart operator replacement: last operator wins
  if ("+-*/".includes(value)) {
    display.value = display.value.replace(/[+\-*/]+$/, "") + value;
  } else if (value === ".") {
    const parts = display.value.split(/[+\-*/]/);
    const current = parts[parts.length - 1];
    if (current.includes(".")) return; // only one decimal point
  } else if (value === "%") {
    // Percentage of last number
    applyPercent();
    return;
  } else {
    // Number: if lastResult exists and display was just a result, start fresh
    if (lastResult !== null && isJustResult) {
      setDisplay(value);
      isJustResult = false;
      lastResult = null;
      return;
    }
    display.value += value;
  }
  isJustResult = false;
  updateExpression();
}

let isJustResult = false;

function applyPercent() {
  const match = display.value.match(/([\d.]+)\s*$/);
  if (match) {
    const num = parseFloat(match[1]);
    const start = display.value.slice(0, -match[1].length);
    display.value = start + (num / 100).toString();
    updateExpression();
  }
}

/* ---------------- Actions ---------------- */
function clearAll() {
  setDisplay("");
  lastResult = null;
  isJustResult = false;
  pulseDisplay();
}

function backspace() {
  if (isJustResult) {
    clearAll();
    return;
  }
  display.value = display.value.slice(0, -1);
  updateExpression();
  pulseDisplay();
}

function toggleSign() {
  // Capture optional leading minus so "-9" toggles back to "9", not "--9"
  const match = display.value.match(/(-?[\d.]+)\s*$/);
  if (match) {
    const num = parseFloat(match[1]);
    const start = display.value.slice(0, -match[1].length);
    display.value = start + (num === 0 ? "0" : String(-num));
    updateExpression();
    pulseDisplay();
  }
}

function calculateResult() {
  const raw = display.value.trim();
  if (!raw) return;

  let expression = raw;
  // Convert display-friendly tokens to JS-safe ones
  expression = expression.replace(/\*\*/g, "**");

  // Strict validation: digits, operators, dots, parentheses, spaces
  if (!/^[\d\s+\-*/().]+$/.test(expression)) {
    showToast("Invalid expression");
    setDisplay("Error");
    setTimeout(clearAll, 1200);
    return;
  }

  try {
    // eslint-disable-next-line no-new-func
    const result = new Function("return (" + expression + ")")();

    if (typeof result !== "number" || !isFinite(result)) {
      showToast("Cannot divide by zero");
      setDisplay("Error");
      setTimeout(clearAll, 1200);
      return;
    }

    const rounded = roundResult(result);

    // Add to history (ignore trivial repeats)
    addHistory(raw, rounded);

    setDisplay(formatNumber(rounded));
    lastResult = rounded;
    isJustResult = true;
    pulseDisplay();
  } catch (err) {
    showToast("Invalid expression");
    setDisplay("Error");
    setTimeout(clearAll, 1200);
  }
}

function roundResult(num) {
  // Round to avoid floating point noise like 0.30000000000000004
  const s = num.toPrecision(12);
  return parseFloat(s);
}

function formatNumber(num) {
  return String(num);
}

/* ---------------- History ---------------- */
function addHistory(expr, result) {
  history.unshift({ expr, result: String(result) });
  if (history.length > MAX_HISTORY) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = '<p class="history-empty">No calculations yet</p>';
    return;
  }

  history.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
            <div class="hist-expr">${escapeHtml(item.expr)} =</div>
            <div class="hist-result">${escapeHtml(item.result)}</div>
        `;
    // Click to reuse the result; dblclick to replay the expression
    div.addEventListener("click", () => {
      setDisplay(item.result);
      isJustResult = true;
      lastResult = parseFloat(item.result);
      showToast("Result copied to display");
    });
    div.addEventListener("dblclick", () => {
      setDisplay(item.expr);
      isJustResult = false;
      lastResult = null;
      showToast("Expression loaded");
    });
    div.style.animationDelay = `${Math.min(index * 0.04, 0.4)}s`;
    historyList.appendChild(div);
  });
}

function clearHistory() {
  history = [];
  renderHistory();
  showToast("History cleared");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ---------------- Feedback ---------------- */
function pulseDisplay() {
  const displayBox = document.querySelector(".display");
  displayBox.style.transform = "scale(0.995)";
  displayBox.style.transition = "transform 0.12s ease";
  setTimeout(() => {
    displayBox.style.transform = "scale(1)";
  }, 120);
}

let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ---------------- Ripple effect ---------------- */
function createRipple(event, button) {
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

/* ---------------- Event wiring ---------------- */
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    createRipple(e, btn);
    handleButtonAction(btn);
  });
});

function handleButtonAction(btn) {
  const value = btn.dataset.value;
  const action = btn.dataset.action;

  if (value !== undefined) {
    handleInput(value);
  } else if (action === "clear") {
    clearAll();
  } else if (action === "backspace") {
    backspace();
  } else if (action === "sign") {
    toggleSign();
  } else if (action === "equals") {
    calculateResult();
  }
}

/* ---------------- Keyboard support ---------------- */
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/[\d]/.test(key)) {
    handleInput(key);
    flashButton(`[data-value="${key}"]`);
  } else if ("+-*/.".includes(key)) {
    handleInput(key);
    flashButton(`[data-value="${key}"]`);
  } else if (key === "%") {
    handleInput("%");
    flashButton('[data-value="%"]');
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculateResult();
    flashButton('[data-action="equals"]');
  } else if (key === "Backspace") {
    backspace();
    flashButton('[data-action="backspace"]');
  } else if (
    key === "Escape" ||
    key === "Delete" ||
    key.toLowerCase() === "c"
  ) {
    clearAll();
    flashButton('[data-action="clear"]');
  } else if (key.toLowerCase() === "t") {
    toggleTheme();
  }
});

function flashButton(selector) {
  const btn = document.querySelector(selector);
  if (!btn) return;
  btn.classList.add("btn-active-flash");
  setTimeout(() => btn.classList.remove("btn-active-flash"), 150);
}

/* ---------------- Init ---------------- */
initTheme();
themeToggle.addEventListener("click", toggleTheme);
clearHistoryBtn.addEventListener("click", clearHistory);
setDisplay("");
