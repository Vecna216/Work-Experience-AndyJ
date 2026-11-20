const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const honeypot = document.getElementById("website");
let formLoadedAt = Date.now();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  statusEl.textContent = "";
  statusEl.className = "form-status";

  // console.log("Honeypot value:", honeypot.value);    honeypot testing
  // const duration = Date.now() - formLoadedAt; 
  // console.log(`Form submitted after ${duration} milliseconds`);

  if (honeypot.value.trim() !== "") {
    form.reset();
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add("form-status--success");
    button.disabled = false;
    return;
  }

  if (Date.now() - formLoadedAt < 3000) {
    form.reset();
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add("form-status--success");
    button.disabled = false;
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  data.form_loaded_at = formLoadedAt;

  try {
    const response = await fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.error || "Something went wrong.");
    }

    form.reset();
    formLoadedAt = Date.now();
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add("form-status--success");
  } catch (error) {
    statusEl.textContent =
      error.message ||
      "Something went wrong. Please email hello@calicomedia.co instead.";
    statusEl.classList.add("form-status--error");
  } finally {
    button.disabled = false;
  }
});
