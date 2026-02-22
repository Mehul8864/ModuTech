// routes/gadgets.js
import express from "express";
import mongoose from "mongoose";
import Gadgets from "../models/Gadgets.js";
// import { uploadToCloudinary } from "../config/cloudinaryUploader.js"; // optional: implement if using cloudinary

const router = express.Router();

const DEFAULT_IMAGE =
  "https://th.bing.com/th/id/OIP.mhDR7tIAfySiInP3AB1QLAHaHM?w=185&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

/**
 * Create a new gadget
 * - Accepts JSON in req.body
 * - If req.body.imageUrl is provided, it will be used
 * - If a file is uploaded via express-fileupload at req.files.image, you can upload it to Cloudinary
 *   (placeholder code commented where to integrate your uploader)
 */
export const createGadget = async (req, res) => {
  try {
    const payload = req.body || {};

    // Determine image URL:
    // 1) prefer explicit imageUrl in body
    // 2) (optional) if a file was uploaded, upload to cloudinary and use that URL
    // 3) fallback to DEFAULT_IMAGE
    let imageUrl = payload.imageUrl || DEFAULT_IMAGE;

    // Example placeholder for file upload handling:
    if (req.files && req.files.image) {
      // Uncomment and implement uploadToCloudinary to enable actual uploads:
      // const uploadResult = await uploadToCloudinary(req.files.image.tempFilePath);
      // imageUrl = uploadResult.secure_url;
      // For now we'll keep payload.imageUrl or DEFAULT_IMAGE
    }

    const newGadget = new Gadgets({
      ...payload,
      imageUrl,
    });

    const saved = await newGadget.save();
    console.log("Gadget created:", saved._id);

    return res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("createGadget error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get all gadgets
 */
export const getGadgets = async (req, res) => {
  try {
    const gadgets = await Gadgets.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: gadgets });
  } catch (error) {
    console.error("getGadgets error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single gadget by id
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
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Attach routes to the router
router.post("/", createGadget);
router.get("/", getGadgets);
router.get("/:id", getGadget);

export default router;