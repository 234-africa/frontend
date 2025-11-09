const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const BACKEND_URL = process.env.BACKEND_URL || "https://event-ticket-backend-yx81.onrender.com";

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.use(express.static(path.join(__dirname, "dist")));

app.get("/event/:title", async (req, res) => {
  try {
    const titleParam = req.params.title;
    
    const response = await axios.get(`${BACKEND_URL}/api/product/${encodeURIComponent(titleParam)}`);
    
    if (response.data.success && response.data.product) {
      const product = response.data.product;
      
      const indexPath = path.join(__dirname, "dist/index.html");
      let html = fs.readFileSync(indexPath, "utf-8");

      const eventTitle = escapeHtml(product.title || "234 AFRICA Event");
      const eventDescription = product.description
        ? escapeHtml(product.description.substring(0, 200))
        : "Join us for this amazing event on 234 AFRICA.";
      const eventImage = product.photos && product.photos.length > 0
        ? escapeHtml(product.photos[0])
        : "https://234tickets.live/default-event-image.png";
      const eventUrl = `https://234tickets.live/event/${titleParam}`;

      const eventDate = product.event && product.event.start
        ? new Date(product.event.start).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "";

      const eventLocation = product.event && product.event.location && product.event.location.name
        ? escapeHtml(product.event.location.name)
        : "Online Event";

      const fullDescription = escapeHtml(
        `${product.description ? product.description.substring(0, 200) : "Join us for this amazing event on 234 AFRICA."}${eventDate ? ` | Date: ${eventDate}` : ""}${eventLocation ? ` | Location: ${eventLocation}` : ""}`
      );

      const metaTags = `
  <meta name="description" content="${fullDescription}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="event" />
  <meta property="og:url" content="${eventUrl}" />
  <meta property="og:title" content="${eventTitle}" />
  <meta property="og:description" content="${fullDescription}" />
  <meta property="og:image" content="${eventImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="234 AFRICA" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${eventUrl}" />
  <meta name="twitter:title" content="${eventTitle}" />
  <meta name="twitter:description" content="${fullDescription}" />
  <meta name="twitter:image" content="${eventImage}" />
  
  <!-- WhatsApp (uses Open Graph) -->
  <meta property="og:image:alt" content="${eventTitle}" />`;

      html = html.replace(/<title>.*?<\/title>/i, `<title>${eventTitle}</title>`);

      html = html.replace(
        /<meta\s+(?:name|property)=["'](?:description|og:title|og:description|og:image|og:type|og:url|twitter:title|twitter:description|twitter:image|twitter:card)["'][^>]*>/gi,
        ""
      );

      html = html.replace(/<head>/i, `<head>${metaTags}`);

      return res.send(html);
    }
  } catch (error) {
    console.error("Error fetching event data:", error.message);
  }

  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
