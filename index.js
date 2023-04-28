const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const mongoose = require("mongoose");
const { Voter } = require("./model/voterId.model");
const { Votes } = require("./model/votes.model");
const { counting_votes } = require("./helper/vote_verification");

const app = express();

const server = http.createServer(app);

server.listen(process.env.PORT, async () => {
  console.log(`server running on port ${process.env.PORT}`);
  try {
    await mongoose.connect(process.env.URL);
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
});

const webSocketServer = new Server(server);

webSocketServer.on("connection", async (socket) => {
  // providing voter id to the voter

  // updating votes
  const votes_data = await counting_votes();
  webSocketServer.emit(
    "voteMade",
    votes_data.A_party_votes,
    votes_data.B_party_votes,
    votes_data.C_party_votes
  );

  // sending voter id
  socket.emit("join", socket.id);

  // making vote
  socket.on("vote", async (voting_Id, voteFor) => {
    // verifying voter id
    if (voting_Id != socket.id) {
      socket.emit("wrong_id", "voterId in invalid");
      return;
    }

    // verifying duplicate id
    const fraud = await Voter.findOne({ voterId: voting_Id });
    if (!fraud) {
      // saving vote details
      try {
        const new_ID = new Voter({ voterId: voting_Id });
        const new_vote = new Votes({ party: voteFor, voter: voting_Id });
        await new_ID.save();
        await new_vote.save();
        // sending updated votes

        const votes_data = await counting_votes();
        webSocketServer.emit(
          "voteMade",
          votes_data.A_party_votes,
          votes_data.B_party_votes,
          votes_data.C_party_votes
        );
        // console.log(votes_data);
      } catch (error) {
        console.log(error);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("one user has gone");
  });
});
