module.exports = {
  db: {
  test: "mongodb://localhost/finds-api-test",
  development: "mongodb://localhost/finds-api-development",
  // production: process.env.MONGODB_URI || "mongodb://localhost/findscraper"},
  production: process.env.MONGODB_URI || "mongodb://heroku_40nt4r4d:cqd4pilbhbi9ej4cdikhs1gu52@ds033076.mlab.com:33076/heroku_40nt4r4d"},
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || "Tell anyone and I'll cut you."
};
