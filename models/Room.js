const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    roomType: {
      type: String, // single / double / pg
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  }
);

module.exports = mongoose.model("Room", roomSchema);
