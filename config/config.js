module.exports = {
  db: {
  test: "mongodb://localhost/finds-api-test",
  development: "mongodb://localhost/finds-api-development",
  production: process.env.MONGODB_URI || "mongodb://localhost/findscraper"},
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || "Tell anyone and I'll cut you."
};
