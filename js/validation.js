"use strict";

const registrationForm = document.querySelector("#registration-form");

if (registrationForm) {
  const nameInput = document.querySelector("#full-name");
  const emailInput = document.querySelector("#email");
  const githubInput = document.querySelector("#github");
  const avatarInput = document.querySelector("#avatar");
  const formMessage = document.querySelector("#form-message");
  const avatarName = document.querySelector("#avatar-name");

  const MAX_FILE_SIZE = 500 * 1024; // 500 KB in bytes
  const STORAGE_KEY = "codingConfRegistration";

  // Display a field-specific message and update its accessible invalid state.
  function showError(input, errorId, message) {
    document.querySelector(`#${errorId}`).textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  // Clear all messages before validating a new submission.
  function clearErrors() {
    showError(nameInput, "name-error", "");
    showError(emailInput, "email-error", "");
    showError(githubInput, "github-error", "");
    showError(avatarInput, "avatar-error", "");
    formMessage.textContent = "";
  }

  // Read an image file as a data URL so it can be shown on the ticket page.
  function readImageAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", () => reject(new Error("The image could not be read.")));
      reader.readAsDataURL(file);
    });
  }

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const github = githubInput.value.trim();
    const avatarFile = avatarInput.files[0];
    let isValid = true;

    // Full name must contain at least one non-space character.
    if (!fullName) {
      showError(nameInput, "name-error", "Please enter your full name.");
      isValid = false;
    }

    // Basic email structure: text@domain.extension.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(email)) {
      showError(emailInput, "email-error", "Enter a valid email address, such as name@example.com.");
      isValid = false;
    }

    // GitHub tag must start with @ and contain a valid username.
    const githubPattern = /^@[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
    if (!githubPattern.test(github)) {
      showError(githubInput, "github-error", "Enter a GitHub username beginning with @ (letters, numbers or hyphens).");
      isValid = false;
    }

    // Avatar must exist, be JPEG or PNG, and be smaller than 500 KB.
    if (!avatarFile) {
      showError(avatarInput, "avatar-error", "Please choose a profile picture.");
      isValid = false;
    } else {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(avatarFile.type)) {
        showError(avatarInput, "avatar-error", "Only JPEG and PNG images are accepted.");
        isValid = false;
      } else if (avatarFile.size >= MAX_FILE_SIZE) {
        showError(avatarInput, "avatar-error", "Your image must be smaller than 500 KB.");
        isValid = false;
      }
    }

    if (!isValid) {
      formMessage.textContent = "Please correct the highlighted fields and submit again.";
      const firstInvalid = registrationForm.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    try {
      const avatarData = await readImageAsDataURL(avatarFile);
      const registration = {
        fullName,
        email,
        github,
        avatarData,
        registeredAt: new Date().toISOString()
      };

      // Client-side persistence only; this is not a secure server database.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registration));
      window.location.href = "ticket.html";
    } catch (error) {
      formMessage.textContent = "We couldn't process that image. Please choose another file.";
    }
  });

  // Show the selected filename to make the upload control clearer.
  avatarInput.addEventListener("change", () => {
    avatarName.textContent = avatarInput.files[0]
      ? avatarInput.files[0].name
      : "No file selected.";
  });
}
