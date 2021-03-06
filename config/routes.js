const express  = require("express");
const router   = express.Router();

const authentications   = require("../controllers/authentications");
const staticsController = require('../controllers/statics');
const findsController   = require('../controllers/finds');

router.route("/")
  .get(staticsController.home);

router.route('/finds')
  .get(findsController.index);

router.route("/register")
  .post(authentications.register);
router.route("/login")
  .post(authentications.login);

module.exports = router;
