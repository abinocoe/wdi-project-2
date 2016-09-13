const Find = require('../models/find');

function findsIndex(req, res) {
  Find.find((err, finds) => {
    if (err) return res.status(500).json({ message: "Something went wrong." });
    return res.status(200).json({ finds });
  });
}

module.exports = {
  index:  findsIndex
};
