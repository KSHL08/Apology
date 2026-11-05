"use strict";

// ==========================================
// CUSTOMIZE YOUR LETTER HERE
// ==========================================

// You can also personalise through the link, for example:
// apology-formal.html?to=Ms.%20Sharma&from=Kushal
const config = {
  recipient: "Ms. Sharma",
  sender: "Kushal",
  subject: "My apology regarding the missed meeting",

  // Leave "" to use today's date automatically.
  date: "",

  // Each section has a heading and either text or a list of items.
  sections: [
    {
      heading: "What happened",
      text:
        "On Monday, I missed our scheduled meeting without informing you " +
        "in advance. This was my mistake and entirely my responsibility."
    },
    {
      heading: "The impact",
      text:
        "I understand that this wasted your time and disrupted your plans. " +
        "I am sorry for the inconvenience and for any frustration it caused."
    },
    {
      heading: "What I am doing about it",
      items: [
        "I will confirm all meetings a day in advance.",
        "I will notify you immediately if any plan changes.",
        "I would like to reschedule at a time that suits you."
      ]
    }
  ],

  closing:
    "Once again, I sincerely apologise. Thank you for taking the time to " +
    "read this. I value your time and our working relationship.",

  signoff: "Respectfully,"
};

// ==========================================
// ELEMENTS
// ==========================================

const $ = (id) => document.getElementById(id);

const subjectEl = $("subject");
const dateEl = $("letterDate");
const salutationEl = $("salutation");
const sectionsEl = $("sections");
const closingEl = $("closing");
const signatureEl = $("signature");
const printBtn = $("printBtn");
const copyBtn = $("copyBtn");
const statusEl = $("status");

// ==========================================
// HELPERS
// ==========================================

function getParam(name, fallback) {
  const value = new URLSearchParams(window.location.search).get(name);
  return value && value.trim() ? value.trim().slice(0, 60) : fallback;
}

function formatDate() {
  if (config.date) return config.date;

  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function setStatus(message) {
  statusEl.textContent = message;
  setTimeout(() => {
    statusEl.textContent = "";
  }, 2500);
}

// ==========================================
// RENDER
// ==========================================

function render(recipient, sender) {
  document.title = config.subject;
  subjectEl.textContent = config.subject;
  dateEl.textContent = formatDate();
  salutationEl.textContent = `Dear ${recipient},`;

  sectionsEl.innerHTML = "";

  config.sections.forEach((item) => {
    const block = document.createElement("div");
    block.className = "section";

    const heading = document.createElement("h2");
    heading.textContent = item.heading;
    block.appendChild(heading);

    if (item.text) {
      const p = document.createElement("p");
      p.textContent = item.text;
      block.appendChild(p);
    }

    if (Array.isArray(item.items)) {
      const ul = document.createElement("ul");
      item.items.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = entry;
        ul.appendChild(li);
      });
      block.appendChild(ul);
    }

    sectionsEl.appendChild(block);
  });

  closingEl.textContent = config.closing;
  signatureEl.textContent = `${config.signoff}\n${sender}`;
}

// ==========================================
// PLAIN TEXT (for the Copy button)
// ==========================================

function buildPlainText(recipient, sender) {
  const lines = [
    config.subject,
    formatDate(),
    "",
    `Dear ${recipient},`,
    ""
  ];

  config.sections.forEach((item) => {
    lines.push(item.heading.toUpperCase());
    if (item.text) lines.push(item.text);
    if (Array.isArray(item.items)) {
      item.items.forEach((entry) => lines.push(`- ${entry}`));
    }
    lines.push("");
  });

  lines.push(config.closing, "", config.signoff, sender);
  return lines.join("\n");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    setStatus("Copied to clipboard.");
  } catch (err) {
    // Fallback for older browsers or non-secure contexts.
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();

    try {
      document.execCommand("copy");
      setStatus("Copied to clipboard.");
    } catch (e) {
      setStatus("Could not copy. Please select the text manually.");
    }

    area.remove();
  }
}

// ==========================================
// INIT
// ==========================================

function init() {
  const recipient = getParam("to", config.recipient);
  const sender = getParam("from", config.sender);

  render(recipient, sender);

  printBtn.addEventListener("click", () => window.print());
  copyBtn.addEventListener("click", () =>
    copyText(buildPlainText(recipient, sender))
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
