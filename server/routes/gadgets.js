import express from "express";
import {
  getGadgets,
  getGadget,
  createGadget,
  updateGadget,
  deleteGadget,
} from "../controllers/gadgets.js";

const router = express.Router();

router.get("/", getGadgets);
router.get("/:id", getGadget);
router.post("/", createGadget);
router.patch("/:id", updateGadget);
router.delete("/:id", deleteGadget);

export default router;
