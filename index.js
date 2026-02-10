const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const Room = require("./models/Room");

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// -------------------- TEST --------------------
app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "index.html"));
  res.send("Backend is running successfully 🚀");
});

// -------------------- ADD ROOM --------------------
app.post("/rooms/add", async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();

    res.status(201).json({
      message: "Room added successfully ✅",
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error adding room ❌",
      error: error.message,
    });
  }
});

// -------------------- GET ALL ROOMS --------------------
app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json({
      message: "Rooms fetched successfully ✅",
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching rooms ❌",
      error: error.message,
    });
  }
});

// -------------------- RENT FILTER --------------------
app.get("/rooms/filter/rent", async (req, res) => {
  try {
    const { min, max } = req.query;

    const rooms = await Room.find({
      rent: {
        $gte: Number(min),
        $lte: Number(max),
      },
    });

    res.status(200).json({
      message: "Rooms fetched by rent range ✅",
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering rooms ❌",
      error: error.message,
    });
  }
});

// -------------------- SEARCH BY CITY --------------------
app.get("/rooms/city/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const rooms = await Room.find({
      address: { $regex: city, $options: "i" },
    });

    res.status(200).json({
      message: "Rooms fetched by city ✅",
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching rooms ❌",
      error: error.message,
    });
  }
});

// -------------------- UPDATE ROOM --------------------
app.put("/rooms/update/:id", async (req, res) => {
  console.log("ID RECEIVED:", req.params.id);
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found ❌" });
    }

    res.status(200).json({
      message: "Room updated successfully ✅",
      data: updatedRoom,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid room ID ❌",
      error: error.message,
    });
  }
});

// -------------------- DELETE ROOM --------------------
app.delete("/rooms/delete/:id", async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found ❌" });
    }

    res.status(200).json({
      message: "Room deleted successfully 🗑️",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid room ID ❌",
      error: error.message,
    });
  }
});

// -------------------- DB + SERVER --------------------
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error ❌", err);
  });
