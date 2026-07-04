const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const prismic = require("@prismicio/client");

// Initialize Firebase Admin
const admin = require("firebase-admin");
admin.initializeApp();

// 1. Endpoint: submitPrayer (POST) - Custom prayer sync to Prismic
exports.submitPrayer = onRequest({ cors: true }, async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { title, category, content } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ error: "Missing required fields: title, category, content" });
  }

  const repoName = process.env.PRISMIC_REPO || "";
  const writeToken = process.env.PRISMIC_WRITE_TOKEN || "";

  if (!repoName || !writeToken) {
    console.error("❌ Firebase Server Error: Missing PRISMIC_REPO or PRISMIC_WRITE_TOKEN environment variables.");
    return res.status(500).json({ error: "Cấu hình Firebase thiếu biến môi trường Prismic." });
  }

  try {
    const uid = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const accessToken = process.env.PRISMIC_ACCESS_TOKEN || "";
    const writeClient = prismic.createWriteClient(repoName, {
      writeToken: writeToken,
      accessToken: accessToken || undefined
    });

    const migration = prismic.createMigration();

    const prismicContent = content
      .split(/<br\s*\/?>/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0)
      .map((paragraph) => ({
        type: "paragraph",
        text: paragraph,
        spans: []
      }));

    const docLang = process.env.PRISMIC_LANG || "vi";

    migration.createDocument({
      type: "prayer",
      uid: uid,
      lang: docLang,
      data: {
        title: title,
        category: category,
        content: prismicContent,
        is_novena: false
      }
    }, title);

    await writeClient.migrate(migration);

    console.log(`✅ Synced draft for: "${title}" to Prismic release.`);
    return res.status(200).json({ success: true, message: "Đồng bộ bản nháp lên Prismic thành công!" });
  } catch (error) {
    console.error("❌ Error pushing draft to Prismic:", error);
    return res.status(500).json({ error: error.message || "Lỗi trong quá trình kết nối với Prismic." });
  }
});

// 2. Endpoint: subscribeToAlerts (POST) - Subscribe user's FCM token to "prayer-alerts" topic
exports.subscribeToAlerts = onRequest({ cors: true }, async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Missing required registration token" });
  }

  try {
    // Subscribe the token to the topic "prayer-alerts"
    const response = await admin.messaging().subscribeToTopic(token, "prayer-alerts");
    console.log("Successfully subscribed to topic:", response);
    return res.status(200).json({ success: true, message: "Đã đăng ký nhận thông báo đẩy thành công!" });
  } catch (error) {
    console.error("Error subscribing token to topic:", error);
    return res.status(500).json({ error: error.message || "Không thể đăng ký thiết bị nhận thông báo." });
  }
});

// Helper to convert Prismic rich text content array to plain text string
function prismicRichTextToPlain(richTextArray) {
  if (!Array.isArray(richTextArray)) return "";
  return richTextArray.map(block => block.text || "").join("\n");
}

// 3. Cron Scheduler: Fetch from Prismic & Send Push Notifications hourly at transitions
exports.sendScheduledPrayer = onSchedule({
  schedule: "0 * * * *", // Runs exactly on the hour, every hour
  timeZone: "Asia/Ho_Chi_Minh" // Vietnam time zone
}, async (event) => {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay(); // 0 = Sun, 6 = Sat, 1-5 = Mon-Fri
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // We only send notifications at specific periods: 4:00 (Morning), 10:00 (Focus), 15:00 (Thanksgiving), 18:00 (Evening)
  if (hour !== 4 && hour !== 10 && hour !== 15 && hour !== 18) {
    console.log(`Hour is ${hour} in VN time. No prayer transitions at this hour. Skipping.`);
    return;
  }

  const repoName = process.env.PRISMIC_REPO || "easyforpray";
  console.log(`🕒 Starting Cron check at ${hour}:00 VN time. Fetching prayers from Prismic repo "${repoName}"...`);

  try {
    const client = prismic.createClient(repoName);
    const response = await client.getAllByType("prayer");

    let matchedCategory = "";
    let keywordFilter = "";

    if (isWeekend) {
      if (hour === 4) {
        matchedCategory = "feast-holiday";
      } else if (hour === 18) {
        matchedCategory = "evening-weekend";
      }
    } else {
      if (hour === 4) {
        // Morning transition (Suggest general work/school morning prayers)
        matchedCategory = "morning-work";
      } else if (hour === 10) {
        matchedCategory = "morning-work";
        keywordFilter = "tập trung";
      } else if (hour === 15) {
        matchedCategory = "feast-holiday";
        keywordFilter = "tạ ơn";
      } else if (hour === 18) {
        matchedCategory = "evening-weekday";
      }
    }

    if (!matchedCategory) {
      console.log("No category matched for this period.");
      return;
    }

    // Filter prayers
    let filtered = response.filter(doc => doc.data.category === matchedCategory && !doc.data.is_novena);
    if (keywordFilter) {
      const keywordLower = keywordFilter.toLowerCase();
      const keywordMatched = filtered.filter(doc => {
        const title = (doc.data.title || "").toLowerCase();
        const content = prismicRichTextToPlain(doc.data.content).toLowerCase();
        return title.includes(keywordLower) || content.includes(keywordLower);
      });
      if (keywordMatched.length > 0) {
        filtered = keywordMatched;
      }
    }

    if (filtered.length === 0) {
      console.log(`No prayers found on Prismic matching category "${matchedCategory}" and keyword "${keywordFilter}".`);
      return;
    }

    // Pick first matching prayer
    const doc = filtered[0];
    const title = doc.data.title || "Đã Đến Giờ Kinh Nguyện";
    const plainContent = prismicRichTextToPlain(doc.data.content);
    const body = plainContent.slice(0, 120) + (plainContent.length > 120 ? "..." : "");

    // Send push message to FCM topic "prayer-alerts"
    const message = {
      notification: {
        title: title,
        body: body
      },
      topic: "prayer-alerts",
      android: {
        notification: {
          icon: "stock_ticker_update",
          color: "#C5A880"
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1
          }
        }
      }
    };

    const responseFCM = await admin.messaging().send(message);
    console.log(`🚀 Automated Push Notification sent successfully:`, responseFCM);
  } catch (error) {
    console.error("❌ Cron error fetching/pushing prayers from Prismic:", error);
  }
});
