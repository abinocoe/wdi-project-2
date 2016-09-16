module.exports = {
  db: process.env.MONGODB_URI || "mongodb://localhost/findscraper",
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || "Tell anyone and I'll cut you."
};
