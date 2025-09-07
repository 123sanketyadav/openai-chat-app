import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./ROUTES/chat.js";
import getGeminiAPIResponse from "./UTILS/openai.js";

const app = express();
const PORT =process.env.PORT || 8080;

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// ✅ Routes
app.use("/api", chatRoutes);

// ✅ DB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected with database");
  } catch (err) {
    console.log("❌ Failed to connect to DB", err);
  }
};
connectDB();

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// ✅ Test route
app.post("/test", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const reply = await getGeminiAPIResponse(userMessage);
    res.send(reply);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Server error");
  }
});
