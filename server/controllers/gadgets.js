// routes/gadgets.js
import express from "express";
import mongoose from "mongoose";
import Gadgets from "../models/Gadgets.js";
// Optional: implement uploadToCloudinary to enable file uploads
// import { uploadToCloudinary } from "../config/cloudinaryUploader.js";

const router = express.Router();

const DEFAULT_IMAGE =
  "https://th.bing.com/th/id/OIP.mhDR7tIAfySiInP3AB1QLAHaHM?w=185&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

/**
 * Helper: pick only allowed fields from body to avoid mass-assignment.
 * Extend allowedFields as your model grows.
 */
function pickAllowedFields(body = {}) {
  const allowedFields = [
    "name",
    "description",
    "price",
    "category",
    "imageUrl",
    // add other allowed gadget fields here
  ];

  return allowedFields.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      acc[key] = body[key];
    }
    return acc;
  }, {});
}

/**
 * POST /api/gadgets
 * Create a new gadget.
 * Accepts JSON body. If `req.files.image` is present, you can upload it to Cloudinary
 * (see commented placeholder).
 */
export const createGadget = async (req, res) => {
  try {
    const payload = pickAllowedFields(req.body || {});

    // Basic validation (adjust according to your schema)
    if (!payload.name || typeof payload.name !== "string" || payload.name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid 'name' field" });
    }

    // Resolve image URL:
    // 1) use explicit payload.imageUrl
    // 2) if file uploaded at req.files.image -> (optional) upload to cloudinary
    // 3) fallback to DEFAULT_IMAGE
    let imageUrl = (payload.imageUrl && String(payload.imageUrl)) || DEFAULT_IMAGE;

    if (req.files && req.files.image) {
      // Example placeholder for file upload handling. Implement uploadToCloudinary to enable.
      // try {
      //   const uploadResult = await uploadToCloudinary(req.files.image.tempFilePath);
      //   if (uploadResult && uploadResult.secure_url) {
      //     imageUrl = uploadResult.secure_url;
      //   }
      // } catch (uploadErr) {
      //   console.warn("cloudinary upload failed, using fallback imageUrl", uploadErr);
      // }
      // NOTE: If you don't have tempFilePath (depends on your file middleware), adapt accordingly.
    }

    // Build final doc using whitelisted fields
    const gadgetData = {
      ...payload,
      imageUrl,
    };

    const newGadget = new Gadgets(gadgetData);
    const saved = await newGadget.save();

    console.log("Gadget created:", saved._id);
    return res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("createGadget error:", error);
    // If mongoose validation error, return 400 with details
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message, errors: error.errors });
    }
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

/**
 * GET /api/gadgets
 * Return all gadgets (newest first).
 */
export const getGadgets = async (req, res) => {
  try {
    const gadgets = await Gadgets.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: gadgets });
  } catch (error) {
    console.error("getGadgets error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

/**
 * GET /api/gadgets/:id
 * Return a single gadget by id.
 */
export const getGadget = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid gadget id" });
  }

  try {
    const gadget = await Gadgets.findById(id);
    if (!gadget) {
      return res.status(404).json({ success: false, message: "Gadget not found" });
    }
    return res.status(200).json({ success: true, data: gadget });
  } catch (error) {
    console.error("getGadget error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// attach routes
router.post("/", createGadget);
router.get("/", getGadgets);
router.get("/:id", getGadget);

export default router;