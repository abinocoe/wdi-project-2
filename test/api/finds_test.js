require('../spec_helper');

const Find = require('../../models/find');

describe("Finds Controller Test", () => {

  afterEach(done => {
    Find.collection.drop();
    done();
  });

  describe("GET /api/finds", () => {

    beforeEach(done => {
      const find = new Find({
        objectType      : "coin",
        broadPeriod     : "Roman",
        description     : "Groat",
        inscription     : "Hiyerr",
        mintName        : "Hadrian",
        district        : "Stepney Green",
        parish          : "St Dunstans",
        lat             : 51.5219809,
        lng             : -0.0488153,
        fromDate        : 200,
        toDate          : 300,
        imageURL        : "../../images/amphora.png",
        discoveryMethod : "Metal Detector",
        subsequently    : "Returned to finder"
      });
      find.save((err, find) => {
        done();
      });
    });

    it ("should return a 200 response", function(done) {
      api
        .get('/api/finds')
        .set('Accept', 'application/json')
        .expect(200, done);
    });
    it ("should return a JSON object", function(done) {
      api
        .get('/api/finds')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.body).to.be.an("object");
          done();
        });
    });
    it ("should return an array of finds", function(done) {
      api
        .get("/api/finds")
        .set("Accept", 'application/json')
        .end((err, res) => {
          expect(res.body.finds).to.be.an("array");
console.log(res.body.finds);
          done();
        });
    });
    it ("should return an array of find objects", function(done) {
      api
        .get('/api/finds')
        .set("Accept", "application/json")
        .end((err, res) => {
          expect(res.body)
            .to.have.property("finds")
            .and.be.an("array")
            .and.have.property(0)
            .and.have.all.keys([
              "_id",
              "__v",
              "objectType",
              "broadPeriod",
              "description",
              "inscription",
              "mintName",
              "district",
              "parish",
              "lat",
              "lng",
              "fromDate",
              "toDate",
              "imageURL",
              "discoveryMethod",
              "subsequently",
              "updatedAt",
              "createdAt"
            ]);
            done();
        });
    });
  });
});
