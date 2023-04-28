const mongoose = require("mongoose");

const votesSchema = new mongoose.Schema({
  party: { type: String, required: true },
  voter: { type: String, required: true },
});

const Votes = mongoose.model("voting_numbers", votesSchema);

module.exports = { Votes };
