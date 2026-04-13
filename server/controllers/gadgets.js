import mongoose from "mongoose";
import Gadgets from "../models/Gadgets.js";

const DEFAULT_IMAGE =
  "https://th.bing.com/th/id/OIP.mhDR7tIAfySiInP3AB1QLAHaHM?w=185&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

function parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// POST /gadgets
export const createGadget = wrap(async (req, res) => {
  const { title, price, message, creator, imageUrl } = req.body || {};

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: "Missing 'title' field" });
  }

  const parsedPrice = Number(price);
  if (price != null && (!Number.isFinite(parsedPrice) || parsedPrice < 0)) {
    return res.status(400).json({ success: false, message: "Invalid 'price' field" });
  }

  const newGadget = new Gadgets({
    title: title.trim(),
    price: parsedPrice || 0,
    message: message || "",
    creator: creator || "",
    imageUrl: imageUrl || DEFAULT_IMAGE,
  });

  const saved = await newGadget.save();
  return res.status(201).json({ success: true, data: saved });
});

// GET /gadgets
export const getGadgets = wrap(async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  let pageSize = parsePositiveInt(req.query.pageSize, 20);
  if (pageSize > 100) pageSize = 100;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    const escaped = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escaped, "i");
    filter.$or = [{ title: re }, { message: re }];
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
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  });
});

// GET /gadgets/:id
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

// PATCH /gadgets/:id
export const updateGadget = wrap(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid gadget id" });
  }

  const allowed = ["title", "price", "message", "creator", "imageUrl"];
  const payload = {};
  allowed.forEach((k) => {
    if (req.body[k] != null) payload[k] = req.body[k];
  });

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ success: false, message: "No updatable fields provided" });
  }

  const updated = await Gadgets.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );
  if (!updated) {
    return res.status(404).json({ success: false, message: "Gadget not found" });
  }
  return res.status(200).json({ success: true, data: updated });
});

// DELETE /gadgets/:id
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
