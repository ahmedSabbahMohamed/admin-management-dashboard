const express = require("express");
const { auth } = require("../controllers");
const { fileHandler } = require("../middlewares");

const router = express.Router();

router.route("/register").post(fileHandler.single("avatar"), auth.register);
router.route("/login").post(auth.login);

module.exports = router;
