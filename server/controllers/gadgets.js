import express from "express";
import Gadgets from "../models/Gadgets.js";
// import { exportedUrl } from "../index.js";
const router = express.Router();

export const createGadget = async (req, res) => {
    const gadget = req.body;
    const newGadget = new Gadgets({
        ...gadget,
        imageUrl:"https://th.bing.com/th/id/OIP.mhDR7tIAfySiInP3AB1QLAHaHM?w=185&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    });
    try {
        await newGadget.save();
        console.log("data saved in database");
        res.status(201).json(newGadget);
    } catch (error) {
        console.log("data not saved in database");
        res.status(409).json({ message: error.message });
    }
};

export const getGadgets = async (req, res) => {
    try {
        const gadgets = await Gadgets.find();
        res.json({
            data: gadgets,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getGadget = async (req, res) => {
    const { id } = req.params;
    try {
        const gadget = await Gadgets.findById(id);
        res.status(200).json(gadget);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export default router;