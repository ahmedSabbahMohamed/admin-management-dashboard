const express = require("express");
const { metrics } = require("../controllers");
const { verifyToken } = require("../middlewares");

const router = express.Router();

router.route("/register").get(verifyToken, metrics.getUserRegisterationTrends);
router.route("/status").get(verifyToken, metrics.getUserStatusDistribution);
router.route("/roles").get(verifyToken, metrics.getRoleDistribution);
router.route("/login").get(verifyToken, metrics.getLoginMetrics);
router.route("/api").get(verifyToken, metrics.getApiMetrics);

module.exports = router;
