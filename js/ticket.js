"use strict";

const STORAGE_KEY = "codingConfRegistration";
const savedRegistration = localStorage.getItem(STORAGE_KEY);

if (!savedRegistration) {
  // A direct visit without registration data returns to the landing page.
  window.location.replace("index.html");
} else {
  try {
    const attendee = JSON.parse(savedRegistration);

    // Confirm that the required saved properties are available.
    if (!attendee.fullName || !attendee.github || !attendee.avatarData) {
      throw new Error("Registration information is incomplete.");
    }

    document.querySelector("#heading-name").textContent = attendee.fullName;
    document.querySelector("#ticket-name").textContent = attendee.fullName;
    document.querySelector("#ticket-github").textContent = attendee.github;
    document.querySelector("#ticket-github").href =
      `https://github.com/${encodeURIComponent(attendee.github.slice(1))}`;
    document.querySelector("#ticket-avatar").src = attendee.avatarData;

    // Use a stable sample ticket number for the lab demonstration.
    document.querySelector("#ticket-number").textContent = "#01609";

    document.querySelector("#print-ticket").addEventListener("click", () => {
      window.print();
    });
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.replace("index.html");
  }
}
