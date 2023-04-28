const { Voter } = require("../model/voterId.model");
const { Votes } = require("../model/votes.model");

// counting votes
const counting_votes = async () => {
  const A_party_votes = await Votes.aggregate([
    { $match: { party: "A party" } },
    { $count: "total_votes" },
  ]);

  const B_party_votes = await Votes.aggregate([
    { $match: { party: "B party" } },
    { $count: "total_votes" },
  ]);

  const C_party_votes = await Votes.aggregate([
    { $match: { party: "C party" } },
    { $count: "total_votes" },
  ]);


  return ({
    A_party_votes: A_party_votes[0].total_votes,
    B_party_votes: B_party_votes[0].total_votes,
    C_party_votes: C_party_votes[0].total_votes,
  })
};

module.exports = { counting_votes };
