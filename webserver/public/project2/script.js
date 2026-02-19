const valueEl = document.getElementById("value");
const labelEl = document.getElementById("label");
const buttons = document.querySelectorAll(".measurement-options button");

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Get day of year (1–366)
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / MS_PER_DAY);
}

// Get week of year (1–53, ISO)
function getWeekOfYear(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Monday = 1
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / MS_PER_DAY) + 1) / 7);
}

// Days in current month
function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

// Measurement definitions: { value, label }
const measurements = {
  "day-of-month": (d) => ({
    value: d.getDate(),
    label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  }),
  "week-of-year": (d) => ({
    value: `Week ${getWeekOfYear(d)}`,
    label: d.getFullYear().toString(),
  }),
  "days-in-month": (d) => {
    const day = d.getDate();
    const total = getDaysInMonth(d);
    return {
      value: `${day} / ${total}`,
      label: d.toLocaleDateString("en-US", { month: "long" }),
    };
  },
  "days-since-new-year": (d) => ({
    value: getDayOfYear(d),
    label: `days since Jan 1, ${d.getFullYear()}`,
  }),
};

let activeMeasurement = "day-of-month";

function updateDisplay() {
  const now = new Date();
  const fn = measurements[activeMeasurement];
  if (!fn) return;
  const { value, label } = fn(now);
  valueEl.textContent = value;
  labelEl.textContent = label;
}

function setActiveMeasurement(key) {
  activeMeasurement = key;
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.measurement === key);
  });
  updateDisplay();
}

// Event listeners
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setActiveMeasurement(btn.dataset.measurement);
  });
});

// Initial render and daily check (once per minute)
updateDisplay();
setInterval(updateDisplay, 60 * 1000);
