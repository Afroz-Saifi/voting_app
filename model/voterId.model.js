const mongoose = require("mongoose");

const voterIdSchema = new mongoose.Schema({
  voterId: { type: String, required: true },
});

const Voter = mongoose.model("voterId", voterIdSchema);

module.exports = { Voter };
