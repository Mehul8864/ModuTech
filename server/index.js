// server/index.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import admin from "firebase-admin";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/gadgets.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const app = express();

/* -----------------------------
   Stripe setup (from .env)
------------------------------ */
const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;

if (!stripeKey) {
  console.warn(
    "⚠️  STRIPE_SECRET_KEY not found in .env. Payment routes will not work."
  );
} else {
  stripe = new Stripe(stripeKey);
  console.log("✅ Stripe initialized.");
}

/* -----------------------------
   Firebase setup
------------------------------ */
let firebaseInitialized = false;
const serviceAccountPath =
  process.env.GOOGLE_SERVICE_ACCOUNT_PATH || "./serviceAccount.json";

try {
  if (fs.existsSync(path.resolve(serviceAccountPath))) {
    const serviceAccount = JSON.parse(
      fs.readFileSync(path.resolve(serviceAccountPath), "utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET || "gs://gadgetry.appspot.com",
    });

    firebaseInitialized = true;
    console.log("✅ Firebase initialized using service account.");
  } else {
    admin.initializeApp({
      storageBucket:
        process.env.FIREBASE_STORAGE_BUCKET || "gs://gadgetry.appspot.com",
    });
    firebaseInitialized = true;
    console.log("⚠️ Firebase initialized without explicit service account (ADC).");
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}

/* -----------------------------
   Express middlewares
------------------------------ */
app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(bodyParser.json());

/* -----------------------------
   Multer setup
------------------------------ */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* -----------------------------
   Payment endpoint
------------------------------ */
app.post("/payment", async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: "Stripe not configured on this server." });
  }

  const { product, token } = req.body;
  if (!product || !token) {
    return res.status(400).json({ error: "Missing product or token." });
  }

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const idempotencyKey = uuidv4();

    const charge = await stripe.charges.create(
      {
        amount: Math.round(product.price * 100),
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchase of ${product.name || "item"}`,
        shipping: token.card
          ? {
              name: token.card.name,
              address: { country: token.card.address_country },
            }
          : undefined,
      },
      { idempotencyKey }
    );

    res.status(200).json(charge);
  } catch (err) {
    console.error("❌ Payment error:", err);
    res.status(500).json({ error: "Payment processing failed." });
  }
});

/* -----------------------------
   Image upload to Firebase
------------------------------ */
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!firebaseInitialized)
    return res.status(500).json({ error: "Firebase not initialized." });

  if (!req.file)
    return res.status(400).json({ error: "No file uploaded." });

  try {
    const bucket = admin.storage().bucket();
    const filename = `${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(filename);

    const stream = file.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    stream.end(req.file.buffer);

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2030",
    });

    res.status(200).json({ imageUrl: url });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Upload failed." });
  }
});

/* -----------------------------
   API Routes
------------------------------ */
app.use("/gadgets", router);

/* -----------------------------
   MongoDB connection + server
------------------------------ */
const PORT = process.env.PORT || 5001;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/yourFallbackDB";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully.");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
