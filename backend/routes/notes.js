import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get notes
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id });
    res.json(notes);
  } catch (err) {
    console.error("Get all notes error: ", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a note
router.post("/", protect, async (req, res) => {
  const { title, description, amount, type } = req.body;
  try {
    if (!title || !description || !amount || !type) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    if (!['credit', 'debit'].includes(type)) {
      return res.status(400).json({ message: "Type must be either 'credit' or 'debit'" });
    }
    const note = await Note.create({
      title,
      description,
      amount: typeof amount === "number" ? amount : Number(amount),
      type,
      createdBy: req.user._id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a note
router.get("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a note
router.put("/:id", protect, async (req, res) => {
  const { title, description, amount, type } = req.body;
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    note.title = title || note.title;
    note.description = description || note.description;
    if (amount !== undefined && amount !== null && amount !== "") {
      const numericAmount = typeof amount === "number" ? amount : Number(amount);
      if (!Number.isNaN(numericAmount) && numericAmount >= 0) {
        note.amount = numericAmount;
      }
    }
    if (type && ['credit', 'debit'].includes(type)) {
      note.type = type;
    }

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a note
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await note.deleteOne();
    res.json({ message: "Note was deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
