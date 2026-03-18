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
 * Small helper to wrap async route handlers so thrown errors go to next()
 */
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Helper: pick only allowed fields from body to avoid mass-assignment.
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
 * Helper: safe parse integer with defaults
 */
function parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Helper: sanitize/normalize payload values
 */
function normalizePayload(payload) {
  const out = { ...payload };
  if (typeof out.name === "string") out.name = out.name.trim();
  if (typeof out.description === "string") out.description = out.description.trim();
  if (typeof out.category === "string") out.category = out.category.trim();
  if (out.price != null) {
    const p = Number(out.price);
    out.price = Number.isFinite(p) ? p : undefined;
  }
  return out;
}

/**
 * POST /api/gadgets
 * Create a new gadget.
 */
export const createGadget = wrap(async (req, res) => {
  const raw = pickAllowedFields(req.body || {});
  const payload = normalizePayload(raw);

  // Basic validation
  if (!payload.name) {
    return res.status(400).json({ success: false, message: "Missing or invalid 'name' field" });
  }

  if (payload.price != null && (typeof payload.price !== "number" || Number(payload.price) < 0)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid 'price' field; must be a non-negative number" });
  }

  // Resolve image URL:
  // 1) use explicit payload.imageUrl
  // 2) if file uploaded at req.files.image -> (optional) upload to cloudinary
  // 3) fallback to DEFAULT_IMAGE
  let imageUrl = payload.imageUrl ? String(payload.imageUrl) : DEFAULT_IMAGE;

  if (req.files && req.files.image) {
    // Example placeholder for file upload handling. Implement uploadToCloudinary to enable.
    // try {
    //   const tempPath = req.files.image.tempFilePath || req.files.image.path || null;
    //   if (tempPath && uploadToCloudinary) {
    //     const uploadResult = await uploadToCloudinary(tempPath);
    //     if (uploadResult && uploadResult.secure_url) {
    //       imageUrl = uploadResult.secure_url;
    //     }
    //   }
    // } catch (uploadErr) {
    //   console.warn("cloudinary upload failed, using fallback imageUrl", uploadErr);
    // }
  }

  const gadgetData = {
    ...payload,
    imageUrl,
  };

  const newGadget = new Gadgets(gadgetData);
  const saved = await newGadget.save();

  console.info("Gadget created:", saved._id);
  return res.status(201).json({ success: true, data: saved });
});

/**
 * GET /api/gadgets
 * Return gadgets with optional pagination, category filter and search (name/description).
 * Query params:
 *   - page (default 1)
 *   - pageSize (default 20, max 100)
 *   - category
 *   - search (text search on name/description)
 */
export const getGadgets = wrap(async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  let pageSize = parsePositiveInt(req.query.pageSize, 20);
  const MAX_PAGE_SIZE = 100;
  if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

  const category = req.query.category;
  const search = req.query.search;

  const filter = {};
  if (category) filter.category = category;
  if (search) {
    // simple case-insensitive partial match on name or description
    const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: re }, { description: re }];
  }

  const total = await Gadgets.countDocuments(filter);
  const gadgets = await Gadgets.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return res.status(200).json({
    success: true,
    data: gadgets,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});

/**
 * GET /api/gadgets/:id
 * Return a single gadget by id.
 */
export const getGadget = wrap(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid gadget id" });
  }

  const gadget = await Gadgets.findById(id).lean();
  if (!gadget) {
    return res.status(404).json({ success: false, message: "Gadget not found" });
  }
  return res.status(200).json({ success: true, data: gadget });
});

/**
 * PATCH /api/gadgets/:id
 * Partial update of gadget using whitelisted fields only.
 */
export const updateGadget = wrap(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid gadget id" });
  }

  const raw = pickAllowedFields(req.body || {});
  const payload = normalizePayload(raw);

  if (Object.keys(payload).length === 0 && !(req.files && req.files.image)) {
    return res.status(400).json({ success: false, message: "No updatable fields provided" });
  }

  // if file provided, handle optional upload (placeholder)
  if (req.files && req.files.image) {
    // try { ...uploadToCloudinary... } catch {}
    // if successful set payload.imageUrl = secure_url
  }

  // If price present but invalid
  if (payload.price != null && (typeof payload.price !== "number" || payload.price < 0)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid 'price' field; must be a non-negative number" });
  }

  const updated = await Gadgets.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
  if (!updated) {
    return res.status(404).json({ success: false, message: "Gadget not found" });
  }
  return res.status(200).json({ success: true, data: updated });
});

/**
 * DELETE /api/gadgets/:id
 * Delete a gadget by id.
 */
export const deleteGadget = wrap(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid gadget id" });
  }

  const deleted = await Gadgets.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Gadget not found" });
  }
  return res.status(200).json({ success: true, message: "Gadget deleted", data: deleted });
});

// attach routes
router.post("/", createGadget);
router.get("/", getGadgets);
router.get("/:id", getGadget);
router.patch("/:id", updateGadget);
router.delete("/:id", deleteGadget);

export default router;
#include<bist/stdc++.h> 
using namespace std;

int MediaDeviceInfo(){
  ios::


  
}